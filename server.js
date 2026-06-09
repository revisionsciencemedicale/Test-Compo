const http = require('http');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const https = require('https');
const { Pool } = require('pg');

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
// Les sessions ne doivent pas expirer automatiquement.
// Elles restent actives jusqu'à une déconnexion volontaire ou une déconnexion forcée par l'administrateur.
const SESSION_TIMEOUT_MS = Number(process.env.SESSION_TIMEOUT_MS || 0);
const MAX_BODY_BYTES = Number(process.env.MAX_BODY_BYTES || 5_000_000);
const LOGIN_RATE_LIMIT_WINDOW_MS = Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const LOGIN_RATE_LIMIT_MAX = Number(process.env.LOGIN_RATE_LIMIT_MAX || 30);
const DATABASE_URL = process.env.DATABASE_URL;

const LOCAL_MODE = !DATABASE_URL;
if (LOCAL_MODE) {
  console.warn('MODE LOCAL: DATABASE_URL absent. Le site démarre sans PostgreSQL; les paramètres administrateur seront conservés dans le navigateur.');
}

const pool = DATABASE_URL ? new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
}) : null;


// Synchronisation GitHub (sauvegarde serveur dans un fichier JSON du dépôt)
// À renseigner sur l'hébergeur du serveur Node.js, jamais dans le navigateur :
// GITHUB_TOKEN=ghp_xxx (token GitHub fine-grained avec droit Contents: Read and Write)
// GITHUB_REPO=utilisateur/nom-du-depot
// GITHUB_BRANCH=main
// GITHUB_USERS_PATH=server-data/app_users_store.json
// IMPORTANT : ce chemin est déjà créé dans ce projet. Mets exactement cette valeur dans Render.
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_REPO = process.env.GITHUB_REPO || '';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const GITHUB_USERS_PATH = process.env.GITHUB_USERS_PATH || 'server-data/app_users_store.json';
const GITHUB_SYNC_ENABLED = !!(GITHUB_TOKEN && GITHUB_REPO);
let githubSyncInProgress = false;
let githubLastPullAt = 0;
let githubLastPushAt = 0;
const GITHUB_PULL_INTERVAL_MS = Number(process.env.GITHUB_PULL_INTERVAL_MS || 60_000);

function githubRequest(method, apiPath, body = null) {
  if (!GITHUB_SYNC_ENABLED) return Promise.resolve(null);
  const payload = body ? JSON.stringify(body) : null;
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.github.com',
      path: apiPath,
      method,
      headers: {
        'User-Agent': 'Revision-Science-Medicale-Sync',
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try { parsed = data ? JSON.parse(data) : null; } catch (_) { parsed = data; }
        if (res.statusCode >= 200 && res.statusCode < 300) return resolve(parsed);
        const err = new Error(`GitHub API ${method} ${apiPath} : HTTP ${res.statusCode}`);
        err.statusCode = res.statusCode;
        err.data = parsed;
        reject(err);
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function encodeGitHubPath(filePath) {
  return String(filePath || '').split('/').map(encodeURIComponent).join('/');
}

async function pullUsersStoreFromGitHub(force = false) {
  if (!GITHUB_SYNC_ENABLED || githubSyncInProgress) return false;
  if (!force && Date.now() - githubLastPullAt < GITHUB_PULL_INTERVAL_MS) return false;
  githubSyncInProgress = true;
  try {
    const apiPath = `/repos/${GITHUB_REPO}/contents/${encodeGitHubPath(GITHUB_USERS_PATH)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`;
    const file = await githubRequest('GET', apiPath);
    if (!file || !file.content) return false;
    const content = Buffer.from(String(file.content).replace(/\n/g, ''), 'base64').toString('utf8');
    const parsed = JSON.parse(content || '{}');
    const users = Array.isArray(parsed) ? parsed : parsed?.users;
    if (!Array.isArray(users)) return false;
    writeUsersStore({ users }, { skipGitHub: true });
    githubLastPullAt = Date.now();
    return true;
  } catch (err) {
    if (err.statusCode !== 404) console.error('Synchronisation GitHub lecture impossible', err.message);
    githubLastPullAt = Date.now();
    return false;
  } finally {
    githubSyncInProgress = false;
  }
}

async function pushUsersStoreToGitHub(store) {
  if (!GITHUB_SYNC_ENABLED) return false;
  try {
    const apiPath = `/repos/${GITHUB_REPO}/contents/${encodeGitHubPath(GITHUB_USERS_PATH)}`;
    let sha = undefined;
    try {
      const current = await githubRequest('GET', `${apiPath}?ref=${encodeURIComponent(GITHUB_BRANCH)}`);
      sha = current && current.sha;
    } catch (err) {
      if (err.statusCode !== 404) throw err;
    }
    const safeStore = { users: Array.isArray(store?.users) ? store.users : [] };
    const content = Buffer.from(JSON.stringify(safeStore, null, 2), 'utf8').toString('base64');
    await githubRequest('PUT', apiPath, {
      message: `Sauvegarde automatique des comptes - ${new Date().toISOString()}`,
      content,
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    });
    githubLastPushAt = Date.now();
    return true;
  } catch (err) {
    console.error('Synchronisation GitHub écriture impossible', err.message);
    return false;
  }
}

const SERVER_DATA_DIR = process.env.SERVER_DATA_DIR || path.join(ROOT, 'server-data');
const USERS_STORE_FILE = path.join(SERVER_DATA_DIR, 'app_users_store.json');

function ensureServerDataDir() {
  fs.mkdirSync(SERVER_DATA_DIR, { recursive: true });
}

function readUsersStore() {
  try {
    ensureServerDataDir();
    if (!fs.existsSync(USERS_STORE_FILE)) return { users: [] };
    const parsed = JSON.parse(fs.readFileSync(USERS_STORE_FILE, 'utf8'));
    if (Array.isArray(parsed)) return { users: parsed };
    return { users: Array.isArray(parsed.users) ? parsed.users : [] };
  } catch (err) {
    console.error('Impossible de lire app_users_store.json', err);
    return { users: [] };
  }
}

function writeUsersStore(store, options = {}) {
  ensureServerDataDir();
  const safeStore = { users: Array.isArray(store.users) ? store.users : [] };
  fs.writeFileSync(USERS_STORE_FILE, JSON.stringify(safeStore, null, 2));
  if (!options.skipGitHub) {
    pushUsersStoreToGitHub(safeStore).catch((err) => console.error('Push GitHub différé impossible', err.message));
  }
}

function loadFileUserRows() {
  return readUsersStore().users.map((row) => ({
    ...row,
    levels: normalizeAccountLevels(row.levels || []),
    dynamic: true,
    source: row.source || 'fichier serveur',
  }));
}

function saveFileUserRow(user) {
  if (!user || !user.username) return;
  const store = readUsersStore();
  const username = String(user.username).trim();
  const idx = store.users.findIndex((u) => u.username === username);
  const row = {
    username,
    full_name: user.full_name || user.fullName || '',
    first_name: user.first_name || user.firstName || '',
    last_name: user.last_name || user.lastName || '',
    phone: user.phone || '',
    levels: normalizeAccountLevels(user.levels || []),
    suspended: !!user.suspended,
    deleted: !!user.deleted,
    dynamic: true,
    source: 'fichier serveur',
    created_at: user.created_at || user.createdAt || now(),
    updated_at: now(),
  };
  if (idx >= 0) store.users[idx] = { ...store.users[idx], ...row, created_at: store.users[idx].created_at || row.created_at };
  else store.users.push(row);
  writeUsersStore(store);
}

function patchFileUser(username, patch) {
  const store = readUsersStore();
  const idx = store.users.findIndex((u) => u.username === username);
  if (idx < 0) return false;
  store.users[idx] = { ...store.users[idx], ...patch, updated_at: now() };
  writeUsersStore(store);
  return true;
}

function loadUsersConfig() {
  const code = fs.readFileSync(path.join(ROOT, 'codes.js'), 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'codes.js' });
  return {
    users: sandbox.window.USERS || {},
    admins: sandbox.window.ADMINS || [],
  };
}


function normalizeTextKey(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function normalizeAccountLevel(level) {
  const key = normalizeTextKey(level);
  if (key === normalizeTextKey('Auxiliaire 2 année') || key === normalizeTextKey('AUXI')) return 'A2-Niveau moyen';
  if (key === normalizeTextKey('L3-Niveau Accompli INF/SFM')) return 'L3-Niveau Accompli INF';
  if (key === normalizeTextKey('Licence 3 INF/SAG-M') || key === normalizeTextKey('INF/SAG-M')) return 'L3-Niveau Accompli SF';
  return String(level || '').trim();
}

function normalizeAccountLevels(levels) {
  if (levels === 'all') return 'all';
  const allowed = new Set([
    'A1-Base Santé',
    'A2-Niveau moyen',
    'L1-Niveau Émergent',
    'L2-Niveau Ascendant',
    'L3-Niveau Accompli INF',
    'L3-Niveau Accompli SF',
  ]);
  const out = [];
  const seen = new Set();
  for (const level of Array.isArray(levels) ? levels : []) {
    const normalized = normalizeAccountLevel(level);
    if (!allowed.has(normalized)) continue;
    const key = normalizeTextKey(normalized);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(normalized);
  }
  return out;
}

function cleanPart(value, length) {
  return String(value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, length)
    .padEnd(length, 'X');
}

function generateUsername({ lastName, firstName, levels, phone }) {
  const levelText = Array.isArray(levels) ? levels[0] || 'NA' : String(levels || 'NA');
  const digits = String(phone || '').replace(/\D/g, '');
  return `${cleanPart(lastName, 3)}${cleanPart(firstName, 3)}${cleanPart(levelText, 2)}${digits.slice(-4).padStart(4, '0')}`;
}


function staticUsersToRows(staticUsers) {
  return Object.entries(staticUsers || {}).map(([username, config]) => {
    const levels = normalizeAccountLevels(config.levels || []);
    const firstName = config.firstName || config.first_name || '';
    const lastName = config.lastName || config.last_name || '';
    const fullName = config.fullName || config.full_name || `${lastName} ${firstName}`.trim();
    return {
      username,
      full_name: fullName,
      first_name: firstName,
      last_name: lastName,
      phone: config.phone || '',
      levels,
      suspended: !!config.suspended,
      deleted: false,
      dynamic: false,
      source: 'codes.js',
    };
  });
}

function mergeUserRows(staticUsers, dbRows) {
  const merged = new Map();
  for (const user of staticUsersToRows(staticUsers)) merged.set(user.username, user);
  const allRows = [...loadFileUserRows(), ...(dbRows || [])];
  for (const row of allRows) {
    if (row.deleted) continue;
    merged.set(row.username, {
      ...row,
      levels: normalizeAccountLevels(row.levels || []),
      dynamic: true,
      source: row.source || 'base de données',
    });
  }
  return Array.from(merged.values()).sort((a, b) => String(a.username).localeCompare(String(b.username)));
}

async function getAllUsers(client, staticUsers) {
  const result = await client.query('SELECT * FROM app_users ORDER BY username ASC');
  const users = { ...staticUsers };
  for (const row of [...loadFileUserRows(), ...result.rows]) {
    if (!row.deleted) users[row.username] = { levels: normalizeAccountLevels(row.levels || []), suspended: row.suspended, dynamic: true, fullName: row.full_name || '', firstName: row.first_name || '', lastName: row.last_name || '', phone: row.phone || '' };
  }
  return users;
}

async function assertAdmin(client, username, sessionToken, admins) {
  const sessionResult = await client.query('SELECT * FROM active_sessions WHERE username=$1 AND session_token=$2', [username, sessionToken]);
  return admins.includes(username) && sessionResult.rowCount > 0;
}

function now() { return Date.now(); }

function getSessionKey(username, sessionToken, admins) {
  return admins.includes(username) ? `${username}:${sessionToken}` : username;
}

const loginAttempts = new Map();

function getClientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || req.socket.remoteAddress || '-';
}

function isRateLimited(req, keySuffix = '') {
  const key = `${getClientIp(req)}:${keySuffix}`;
  const current = now();
  const previous = loginAttempts.get(key) || { count: 0, resetAt: current + LOGIN_RATE_LIMIT_WINDOW_MS };
  if (current > previous.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: current + LOGIN_RATE_LIMIT_WINDOW_MS });
    return false;
  }
  previous.count += 1;
  loginAttempts.set(key, previous);
  return previous.count > LOGIN_RATE_LIMIT_MAX;
}

function securityHeaders(extra = {}) {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(self), microphone=(), geolocation=()',
    ...extra,
  };
}

async function initDb() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS active_sessions (
      session_key TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      session_token TEXT NOT NULL,
      device_id TEXT,
      browser TEXT,
      platform TEXT,
      user_agent TEXT,
      language TEXT,
      online BOOLEAN DEFAULT TRUE,
      started_at BIGINT NOT NULL,
      last_seen BIGINT NOT NULL,
      ip TEXT
    );
  `);
  // Compatibilité avec l'ancienne version : avant, username était la clé primaire.
  // Maintenant, session_key vaut username pour les comptes simples, et username:sessionToken pour les admins.
  await pool.query(`ALTER TABLE active_sessions ADD COLUMN IF NOT EXISTS session_key TEXT;`);
  await pool.query(`UPDATE active_sessions SET session_key = username WHERE session_key IS NULL OR session_key = '';`);
  await pool.query(`
    DO $$
    DECLARE pk_name TEXT;
    BEGIN
      SELECT conname INTO pk_name
      FROM pg_constraint
      WHERE conrelid = 'active_sessions'::regclass AND contype = 'p';
      IF pk_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE active_sessions DROP CONSTRAINT %I', pk_name);
      END IF;
    END $$;
  `);
  await pool.query(`ALTER TABLE active_sessions ALTER COLUMN session_key SET NOT NULL;`);
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_active_sessions_session_key ON active_sessions(session_key);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_active_sessions_username ON active_sessions(username);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_active_sessions_token ON active_sessions(username, session_token);`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS login_logs (
      id TEXT PRIMARY KEY,
      timestamp BIGINT NOT NULL,
      username TEXT NOT NULL,
      action TEXT NOT NULL,
      device JSONB DEFAULT '{}'::jsonb,
      details JSONB DEFAULT '{}'::jsonb,
      blocked_by JSONB DEFAULT NULL
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_login_logs_timestamp ON login_logs(timestamp DESC);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_login_logs_username ON login_logs(username);`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS revoked_sessions (
      username TEXT NOT NULL,
      session_token TEXT NOT NULL,
      revoked_at BIGINT NOT NULL,
      revoked_by TEXT,
      reason TEXT DEFAULT 'admin_force_logout',
      PRIMARY KEY(username, session_token)
    );
  `);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_revoked_sessions_revoked_at ON revoked_sessions(revoked_at DESC);`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS force_logout_requests (
      username TEXT PRIMARY KEY,
      requested_at BIGINT NOT NULL,
      requested_by TEXT,
      reason TEXT DEFAULT 'admin_force_logout'
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_users (
      username TEXT PRIMARY KEY,
      full_name TEXT DEFAULT '',
      first_name TEXT DEFAULT '',
      last_name TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      levels JSONB DEFAULT '[]'::jsonb,
      suspended BOOLEAN DEFAULT FALSE,
      deleted BOOLEAN DEFAULT FALSE,
      created_at BIGINT NOT NULL,
      updated_at BIGINT NOT NULL
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at BIGINT NOT NULL,
      updated_by TEXT
    );
  `);
}


async function cleanupExpired(client = pool) {
  // Désactivé volontairement : aucune session active n'est supprimée pour inactivité.
  // La session est supprimée uniquement si l'utilisateur clique sur "Se déconnecter"
  // ou si un administrateur force la déconnexion depuis l'interface admin.
  return;
}

function rowToSession(row) {
  if (!row) return null;
  return {
    sessionKey: row.session_key || row.username,
    username: row.username,
    sessionToken: row.session_token,
    deviceId: row.device_id || '-',
    browser: row.browser || '-',
    platform: row.platform || '-',
    userAgent: row.user_agent || '-',
    language: row.language || '-',
    online: row.online,
    startedAt: Number(row.started_at || 0),
    lastSeen: Number(row.last_seen || 0),
    ip: row.ip || '-',
  };
}

function publicSession(session) {
  if (!session) return null;
  const { sessionToken, ...safe } = session;
  return safe;
}

function rowToLog(row) {
  return {
    id: row.id,
    timestamp: Number(row.timestamp || 0),
    user: row.username,
    action: row.action,
    device: row.device || {},
    details: row.details || {},
    blockedBy: row.blocked_by || undefined,
  };
}

async function addLog(client, entry) {
  await client.query(
    `INSERT INTO login_logs(id, timestamp, username, action, device, details, blocked_by)
     VALUES($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7::jsonb)`,
    [
      crypto.randomUUID(),
      now(),
      entry.user || '-',
      entry.action || 'activity',
      JSON.stringify(entry.device || {}),
      JSON.stringify(entry.details || {}),
      entry.blockedBy ? JSON.stringify(entry.blockedBy) : null,
    ]
  );
  await client.query(`DELETE FROM login_logs WHERE id NOT IN (SELECT id FROM login_logs ORDER BY timestamp DESC LIMIT 5000)`);
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, securityHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  }));
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > MAX_BODY_BYTES) req.destroy(); });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

function getMime(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  }[ext] || 'application/octet-stream';
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let requested = decodeURIComponent(url.pathname);
  if (requested === '/') requested = '/index.html';
  const filePath = path.normalize(path.join(ROOT, requested));
  const forbiddenFiles = new Set(['server.js', 'database.json', 'app_users_store.json', '.env', 'render.yaml', '.env.example']);
  if (!filePath.startsWith(ROOT) || filePath.startsWith(SERVER_DATA_DIR) || forbiddenFiles.has(path.basename(filePath))) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404); res.end('Not found'); return; }
    // Après chaque déploiement Render, on force le navigateur à reprendre les fichiers mis à jour.
    // Cela évite que l'ancien app.js/style.css reste en cache et donne l'impression que les corrections ne sont pas appliquées.
    res.writeHead(200, securityHeaders({
      'Content-Type': getMime(filePath),
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }));
    fs.createReadStream(filePath).pipe(res);
  });
}

async function withDb(res, handler) {
  if (!pool) return sendJson(res, 503, { ok: false, error: 'Mode local : base PostgreSQL non connectée. Les paramètres sont appliqués localement dans ce navigateur.' });
  const client = await pool.connect();
  try {
    // Les sessions restent actives jusqu’à une déconnexion explicite ou admin.
    await cleanupExpired(client);
    return await handler(client);
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { ok: false, error: 'Erreur serveur ou base de données.' });
  } finally {
    client.release();
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (!url.pathname.startsWith('/api/')) return serveStatic(req, res);

  const { users: staticUsers, admins } = loadUsersConfig();
  let users = staticUsers;
  // À chaque visite/API, le serveur vérifie GitHub périodiquement pour ramener les comptes créés ailleurs.
  await pullUsersStoreFromGitHub(false);

  if (req.method === 'GET' && url.pathname === '/api/health') {
    if (!pool) return sendJson(res, 200, { ok: true, database: 'fichier serveur local', fileStore: true, githubSync: GITHUB_SYNC_ENABLED, github: GITHUB_SYNC_ENABLED ? { repo: GITHUB_REPO, branch: GITHUB_BRANCH, path: GITHUB_USERS_PATH, lastPullAt: githubLastPullAt, lastPushAt: githubLastPushAt } : null });
    return withDb(res, async () => sendJson(res, 200, { ok: true, database: 'postgresql', fileStore: true, githubSync: GITHUB_SYNC_ENABLED, github: GITHUB_SYNC_ENABLED ? { repo: GITHUB_REPO, branch: GITHUB_BRANCH, path: GITHUB_USERS_PATH, lastPullAt: githubLastPullAt, lastPushAt: githubLastPushAt } : null }));
  }

  if (req.method === 'POST' && url.pathname === '/api/login') {
    const body = await readJsonBody(req);
    const username = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim() || crypto.randomUUID();
    const device = body.device || {};

    // Correction mobile : plusieurs téléphones peuvent partager la même adresse IP
    // via le réseau mobile. La limitation reste active, mais elle est séparée par compte
    // afin de ne pas bloquer injustement les autres appareils.
    if (isRateLimited(req, `login:${username || 'empty'}`)) {
      return sendJson(res, 429, { ok: false, error: 'Trop de tentatives. Réessayez plus tard.' });
    }

    return withDb(res, async (client) => {
      if (!username) {
        await addLog(client, { user: '-', action: 'login_empty_username', device });
        return sendJson(res, 400, { ok: false, error: 'Veuillez entrer votre nom d’utilisateur avant de vous connecter.' });
      }
      users = await getAllUsers(client, staticUsers);
      if (users[username]?.suspended) {
        await addLog(client, { user: username, action: 'login_suspended', device });
        return sendJson(res, 403, { ok: false, error: 'Compte suspendu. Merci de contacter un administrateur.' });
      }
      if (!users[username]) {
        await addLog(client, { user: username || '-', action: 'login_invalid', device });
        return sendJson(res, 401, { ok: false, error: 'Identifiants invalides.' });
      }

      const revokedResult = await client.query('SELECT 1 FROM revoked_sessions WHERE username=$1 AND session_token=$2', [username, sessionToken]);
      if (revokedResult.rowCount) {
        await addLog(client, { user: username, action: 'login_refused_admin_logout', device });
        return sendJson(res, 403, {
          ok: false,
          error: 'Ce compte a été déconnecté par un administrateur. Reconnectez-vous manuellement.',
          forcedLogout: true,
        });
      }

      await client.query('BEGIN');
      try {
        const isAdminAccount = admins.includes(username);
        const sessionKey = getSessionKey(username, sessionToken, admins);
        const existingResult = await client.query(
          isAdminAccount
            ? 'SELECT * FROM active_sessions WHERE session_key = $1 FOR UPDATE'
            : 'SELECT * FROM active_sessions WHERE username = $1 FOR UPDATE',
          [isAdminAccount ? sessionKey : username]
        );
        const existing = rowToSession(existingResult.rows[0]);

        const incomingDeviceId = String(device.deviceId || '-');
        const isSameSession = existing && existing.sessionToken === sessionToken && existing.deviceId === incomingDeviceId;
        const isDifferentActiveAccess = !isAdminAccount && existing && !isSameSession;

        if (isDifferentActiveAccess) {
          await addLog(client, {
            user: username,
            action: 'login_refused_already_online',
            device,
            blockedBy: publicSession(existing),
          });
          await client.query('COMMIT');
          return sendJson(res, 409, {
            ok: false,
            error: 'Accès refusé.\nVous n\'êtes pas propriétaire de ce compte.\nMerci de contacter un administrateur au 0708190886 / 0709282169.',
            activeSession: publicSession(existing),
          });
        }


        const startedAt = existing?.startedAt || now();
        const lastSeen = now();
        await client.query(
          `INSERT INTO active_sessions(session_key, username, session_token, device_id, browser, platform, user_agent, language, online, started_at, last_seen, ip)
           VALUES($1,$2,$3,$4,$5,$6,$7,$8,TRUE,$9,$10,$11)
           ON CONFLICT(session_key) DO UPDATE SET
             username = EXCLUDED.username,
             session_token = EXCLUDED.session_token,
             device_id = EXCLUDED.device_id,
             browser = EXCLUDED.browser,
             platform = EXCLUDED.platform,
             user_agent = EXCLUDED.user_agent,
             language = EXCLUDED.language,
             online = TRUE,
             last_seen = EXCLUDED.last_seen,
             ip = EXCLUDED.ip`,
          [sessionKey, username, sessionToken, device.deviceId || '-', device.browser || '-', device.platform || '-', device.userAgent || '-', device.language || '-', startedAt, lastSeen, getClientIp(req)]
        );
        const session = { sessionKey, username, sessionToken, deviceId: device.deviceId || '-', browser: device.browser || '-', platform: device.platform || '-', userAgent: device.userAgent || '-', language: device.language || '-', online: true, startedAt, lastSeen, ip: getClientIp(req) };
        await addLog(client, { user: username, action: 'login', device: publicSession(session) });
        await client.query('COMMIT');
        return sendJson(res, 200, { ok: true, user: username, admin: admins.includes(username), userConfig: users[username] });
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/check-session') {
    const body = await readJsonBody(req);
    const username = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim();
    return withDb(res, async (client) => {
      if (!username || !sessionToken) return sendJson(res, 200, { ok: true, loggedIn: false, forceLogout: false });

      const revokedResult = await client.query(
        'SELECT revoked_by, revoked_at, reason FROM revoked_sessions WHERE username=$1 AND session_token=$2',
        [username, sessionToken]
      );
      if (revokedResult.rowCount) {
        return sendJson(res, 200, {
          ok: true,
          loggedIn: false,
          forceLogout: true,
          error: 'Session déconnectée par un administrateur.',
          details: revokedResult.rows[0],
        });
      }

      const device = body.device || {};
      const incomingDeviceId = String(device.deviceId || '-');
      const allUsers = await getAllUsers(client, staticUsers);
      const userConfig = allUsers[username] || null;
      if (!userConfig) {
        return sendJson(res, 200, { ok: true, loggedIn: false, forceLogout: false });
      }
      if (userConfig.suspended) {
        return sendJson(res, 200, { ok: true, loggedIn: false, forceLogout: true, error: 'Compte suspendu.' });
      }

      // Correction : un compte créé depuis le site ne doit plus être déconnecté automatiquement
      // après un déploiement Render, un redémarrage serveur, une perte de ligne active ou un changement
      // d'identifiant appareil/navigateur. La session est recréée/rafraîchie tant que l'administrateur
      // ne l'a pas explicitement déconnectée dans revoked_sessions.
      const ts = now();
      const sessionKey = getSessionKey(username, sessionToken, admins);
      await client.query(
        `INSERT INTO active_sessions(session_key, username, session_token, device_id, browser, platform, user_agent, language, online, started_at, last_seen, ip)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,TRUE,$9,$9,$10)
         ON CONFLICT(session_key) DO UPDATE SET
           username = EXCLUDED.username,
           session_token = EXCLUDED.session_token,
           device_id = EXCLUDED.device_id,
           browser = EXCLUDED.browser,
           platform = EXCLUDED.platform,
           user_agent = EXCLUDED.user_agent,
           language = EXCLUDED.language,
           online = TRUE,
           last_seen = EXCLUDED.last_seen,
           ip = EXCLUDED.ip`,
        [sessionKey, username, sessionToken, incomingDeviceId, device.browser || '-', device.platform || '-', device.userAgent || '-', device.language || '-', ts, getClientIp(req)]
      );
      return sendJson(res, 200, { ok: true, loggedIn: true, forceLogout: false, userConfig });
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/heartbeat') {
    const body = await readJsonBody(req);
    const username = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim();
    return withDb(res, async (client) => {
      const revokedResult = await client.query('SELECT 1 FROM revoked_sessions WHERE username=$1 AND session_token=$2', [username, sessionToken]);
      if (revokedResult.rowCount) return sendJson(res, 401, { ok: false, error: 'Session déconnectée par un administrateur.', forcedLogout: true });
      const device = body.device || {};
      const incomingDeviceId = String(device.deviceId || '-');
      const allUsers = await getAllUsers(client, staticUsers);
      const userConfig = allUsers[username] || null;
      if (!userConfig) return sendJson(res, 200, { ok: false, loggedIn: false });
      if (userConfig.suspended) return sendJson(res, 401, { ok: false, error: 'Compte suspendu.', forcedLogout: true });

      // Ne plus expirer automatiquement les comptes créés localement / depuis le site.
      // Si la ligne active a disparu après déploiement, on la recrée au lieu de déconnecter l'utilisateur.
      const ts = now();
      const sessionKey = getSessionKey(username, sessionToken, admins);
      await client.query(
        `INSERT INTO active_sessions(session_key, username, session_token, device_id, browser, platform, user_agent, language, online, started_at, last_seen, ip)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,TRUE,$9,$9,$10)
         ON CONFLICT(session_key) DO UPDATE SET
           username = EXCLUDED.username,
           session_token = EXCLUDED.session_token,
           device_id = EXCLUDED.device_id,
           browser = EXCLUDED.browser,
           platform = EXCLUDED.platform,
           user_agent = EXCLUDED.user_agent,
           language = EXCLUDED.language,
           online = TRUE,
           last_seen = EXCLUDED.last_seen,
           ip = EXCLUDED.ip`,
        [sessionKey, username, sessionToken, incomingDeviceId, device.browser || '-', device.platform || '-', device.userAgent || '-', device.language || '-', ts, getClientIp(req)]
      );
      return sendJson(res, 200, { ok: true, loggedIn: true });
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/logout') {
    const body = await readJsonBody(req);
    const username = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim();
    const action = String(body.action || 'logout');
    return withDb(res, async (client) => {
      if (username && sessionToken) await client.query('DELETE FROM active_sessions WHERE username=$1 AND session_token=$2', [username, sessionToken]);
      if (username) await addLog(client, { user: username, action, device: body.device || {} });
      return sendJson(res, 200, { ok: true });
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/activity') {
    const body = await readJsonBody(req);
    const username = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim();
    return withDb(res, async (client) => {
      const result = await client.query('SELECT * FROM active_sessions WHERE username=$1 AND session_token=$2', [username, sessionToken]);
      let session = rowToSession(result.rows[0]);
      if (!session) {
        const allUsers = await getAllUsers(client, staticUsers);
        if (!allUsers[username]) return sendJson(res, 200, { ok: false });
        const device = body.device || {};
        const ts = now();
        const sessionKey = getSessionKey(username, sessionToken, admins);
        await client.query(
          `INSERT INTO active_sessions(session_key, username, session_token, device_id, browser, platform, user_agent, language, online, started_at, last_seen, ip)
           VALUES($1,$2,$3,$4,$5,$6,$7,$8,TRUE,$9,$9,$10)
           ON CONFLICT(session_key) DO UPDATE SET username=EXCLUDED.username, session_token=EXCLUDED.session_token, device_id=EXCLUDED.device_id, browser=EXCLUDED.browser, platform=EXCLUDED.platform, user_agent=EXCLUDED.user_agent, language=EXCLUDED.language, online=TRUE, last_seen=EXCLUDED.last_seen, ip=EXCLUDED.ip`,
          [sessionKey, username, sessionToken, device.deviceId || '-', device.browser || '-', device.platform || '-', device.userAgent || '-', device.language || '-', ts, getClientIp(req)]
        );
        session = { sessionKey, username, sessionToken, deviceId: device.deviceId || '-', browser: device.browser || '-', platform: device.platform || '-', userAgent: device.userAgent || '-', language: device.language || '-', online: true, startedAt: ts, lastSeen: ts, ip: getClientIp(req) };
      }
      await addLog(client, { user: username, action: String(body.action || 'activity'), details: body.details || {}, device: publicSession(session) });
      return sendJson(res, 200, { ok: true });
    });
  }


  if (req.method === 'GET' && url.pathname === '/api/settings') {
    return withDb(res, async (client) => {
      const result = await client.query("SELECT value FROM app_settings WHERE key='global'");
      return sendJson(res, 200, { ok: true, settings: result.rows[0]?.value || {} });
    });
  }


  if (req.method === 'POST' && url.pathname === '/api/admin/all-users') {
    await pullUsersStoreFromGitHub(false);
    const body = await readJsonBody(req);
    const username = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim();
    if (!pool) {
      if (!admins.includes(username)) return sendJson(res, 403, { ok: false, error: 'Accès administrateur refusé.' });
      const activeSessions = {};
      return sendJson(res, 200, {
        ok: true,
        activeSessions,
        dynamicUsers: mergeUserRows(staticUsers, []),
        dashboard: { connectedUsers: 0 },
        storage: 'fichier serveur local'
      });
    }
    return withDb(res, async (client) => {
      const sessionResult = await client.query('SELECT * FROM active_sessions WHERE username=$1 AND session_token=$2', [username, sessionToken]);
      if (!admins.includes(username) || !sessionResult.rowCount) {
        return sendJson(res, 403, { ok: false, error: 'Accès administrateur refusé.' });
      }
      const activeResult = await client.query('SELECT * FROM active_sessions ORDER BY last_seen DESC');
      const dynamicUsers = await client.query('SELECT * FROM app_users WHERE deleted=FALSE ORDER BY username ASC');
      return sendJson(res, 200, {
        ok: true,
        activeSessions: Object.fromEntries(activeResult.rows.map((r) => [r.session_key || `${r.username}:${r.session_token}`, publicSession(rowToSession(r))])),
        dynamicUsers: mergeUserRows(staticUsers, dynamicUsers.rows),
        dashboard: { connectedUsers: activeResult.rowCount }
      });
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/logs') {
    await pullUsersStoreFromGitHub(false);
    const body = await readJsonBody(req);
    const username = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim();
    if (!pool) {
      if (!admins.includes(username)) return sendJson(res, 403, { ok: false, error: 'Accès administrateur refusé.' });
      return sendJson(res, 200, {
        ok: true,
        activeSessions: {},
        loginLogs: [],
        dashboard: { connectedUsers: 0, quizDone: 0 },
        dynamicUsers: mergeUserRows(staticUsers, []),
        appSettings: {},
        storage: 'fichier serveur local',
      });
    }
    return withDb(res, async (client) => {
      const sessionResult = await client.query('SELECT * FROM active_sessions WHERE username=$1 AND session_token=$2', [username, sessionToken]);
      if (!admins.includes(username) || !sessionResult.rowCount) {
        return sendJson(res, 403, { ok: false, error: 'Accès administrateur refusé.' });
      }
      const activeResult = await client.query('SELECT * FROM active_sessions ORDER BY last_seen DESC');
      const logsResult = await client.query('SELECT * FROM login_logs ORDER BY timestamp ASC LIMIT 5000');
      const dynamicUsers = await client.query('SELECT * FROM app_users WHERE deleted=FALSE ORDER BY username ASC');
      const settingsResult = await client.query("SELECT value FROM app_settings WHERE key='global'");
      const quizCount = logsResult.rows.filter(r => r.action === 'finish_quiz').length;
      return sendJson(res, 200, {
        ok: true,
        activeSessions: Object.fromEntries(activeResult.rows.map((r) => [r.session_key || `${r.username}:${r.session_token}`, publicSession(rowToSession(r))])),
        loginLogs: logsResult.rows.map(rowToLog),
        dashboard: { connectedUsers: activeResult.rowCount, quizDone: quizCount },
        // Important : la recherche utilisateur doit afficher TOUS les comptes existants :
        // ceux du fichier codes.js + ceux créés depuis l'interface admin et enregistrés en base.
        dynamicUsers: mergeUserRows(staticUsers, dynamicUsers.rows),
        appSettings: settingsResult.rows[0]?.value || {},
      });
    });
  }


  if (req.method === 'POST' && url.pathname === '/api/admin/force-logout') {
    const body = await readJsonBody(req);
    const adminUsername = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim();
    const targetUser = String(body.targetUser || '').trim();
    return withDb(res, async (client) => {
      const sessionResult = await client.query('SELECT * FROM active_sessions WHERE username=$1 AND session_token=$2', [adminUsername, sessionToken]);
      if (!admins.includes(adminUsername) || !sessionResult.rowCount) {
        return sendJson(res, 403, { ok: false, error: 'Accès administrateur refusé.' });
      }
      if (!targetUser) return sendJson(res, 400, { ok: false, error: 'Utilisateur cible manquant.' });
      if (targetUser === adminUsername) return sendJson(res, 400, { ok: false, error: 'Vous ne pouvez pas déconnecter votre propre compte depuis ce bouton.' });
      await client.query(
        `INSERT INTO force_logout_requests(username, requested_at, requested_by, reason)
         VALUES($1,$2,$3,'admin_force_logout')
         ON CONFLICT(username) DO UPDATE SET requested_at=EXCLUDED.requested_at, requested_by=EXCLUDED.requested_by`,
        [targetUser, now(), adminUsername]
      );
      const sessionsToRevoke = await client.query('SELECT session_token FROM active_sessions WHERE username=$1', [targetUser]);
      for (const row of sessionsToRevoke.rows) {
        await client.query(
          `INSERT INTO revoked_sessions(username, session_token, revoked_at, revoked_by, reason)
           VALUES($1,$2,$3,$4,'admin_force_logout')
           ON CONFLICT(username, session_token) DO UPDATE SET revoked_at=EXCLUDED.revoked_at, revoked_by=EXCLUDED.revoked_by`,
          [targetUser, row.session_token, now(), adminUsername]
        );
      }
      const deleted = await client.query('DELETE FROM active_sessions WHERE username=$1 RETURNING username', [targetUser]);
      await addLog(client, { user: targetUser, action: 'admin_force_logout', details: { by: adminUsername, disconnected: deleted.rowCount } });
      return sendJson(res, 200, { ok: true, disconnected: deleted.rowCount, forceLogout: true });
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/clear-expired') {
    const body = await readJsonBody(req);
    const adminUsername = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim();
    return withDb(res, async (client) => {
      const sessionResult = await client.query('SELECT * FROM active_sessions WHERE username=$1 AND session_token=$2', [adminUsername, sessionToken]);
      if (!admins.includes(adminUsername) || !sessionResult.rowCount) {
        return sendJson(res, 403, { ok: false, error: 'Accès administrateur refusé.' });
      }
      // Les sessions restent actives jusqu’à une déconnexion explicite ou admin.
    await cleanupExpired(client);
      await addLog(client, { user: adminUsername, action: 'admin_clear_expired' });
      return sendJson(res, 200, { ok: true });
    });
  }


  if (req.method === 'POST' && url.pathname === '/api/admin/create-user') {
    const body = await readJsonBody(req);
    const adminUsername = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim();
    if (!pool) {
      if (!admins.includes(adminUsername)) return sendJson(res, 403, { ok: false, error: 'Accès administrateur refusé.' });
      const levels = normalizeAccountLevels(Array.isArray(body.levels) ? body.levels.filter(Boolean) : []);
      if (!levels.length) return sendJson(res, 400, { ok: false, error: 'Veuillez cocher au moins un niveau valide.' });
      const generated = generateUsername({ lastName: body.lastName, firstName: body.firstName, levels, phone: body.phone });
      const existingRows = mergeUserRows(staticUsers, []);
      let username = generated;
      let i = 1;
      while (existingRows.some((u) => u.username === username)) username = `${generated}${i++}`;
      const fullName = `${body.lastName || ''} ${body.firstName || ''}`.trim();
      const userConfig = { username, levels, suspended: false, dynamic: true, full_name: fullName, first_name: body.firstName || '', last_name: body.lastName || '', phone: body.phone || '' };
      saveFileUserRow(userConfig);
      return sendJson(res, 200, { ok: true, username, levels, userConfig, storage: 'fichier serveur local' });
    }
    return withDb(res, async (client) => {
      if (!(await assertAdmin(client, adminUsername, sessionToken, admins))) return sendJson(res, 403, { ok: false, error: 'Accès administrateur refusé.' });
      const levels = normalizeAccountLevels(Array.isArray(body.levels) ? body.levels.filter(Boolean) : []);
      if (!levels.length) return sendJson(res, 400, { ok: false, error: 'Veuillez cocher au moins un niveau valide.' });
      const generated = generateUsername({ lastName: body.lastName, firstName: body.firstName, levels, phone: body.phone });
      let username = generated;
      let i = 1;
      while ((await client.query('SELECT 1 FROM app_users WHERE username=$1 AND deleted=FALSE', [username])).rowCount || mergeUserRows(staticUsers, []).some((u) => u.username === username)) username = `${generated}${i++}`;
      await client.query(`INSERT INTO app_users(username, full_name, first_name, last_name, phone, levels, created_at, updated_at)
        VALUES($1,$2,$3,$4,$5,$6::jsonb,$7,$7)`, [username, `${body.lastName || ''} ${body.firstName || ''}`.trim(), body.firstName || '', body.lastName || '', body.phone || '', JSON.stringify(levels), now()]);
      const userConfig = { levels, suspended: false, dynamic: true, fullName: `${body.lastName || ''} ${body.firstName || ''}`.trim(), firstName: body.firstName || '', lastName: body.lastName || '', phone: body.phone || '' };
      saveFileUserRow({ username, ...userConfig, full_name: userConfig.fullName, first_name: userConfig.firstName, last_name: userConfig.lastName });
      await addLog(client, { user: username, action: 'admin_create_user', details: { by: adminUsername, levels } });
      return sendJson(res, 200, { ok: true, username, levels, userConfig });
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/update-user') {
    const body = await readJsonBody(req);
    const adminUsername = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim();
    const targetUser = String(body.targetUser || '').trim();
    if (!pool) {
      if (!admins.includes(adminUsername)) return sendJson(res, 403, { ok: false, error: 'Accès administrateur refusé.' });
      if (!targetUser) return sendJson(res, 400, { ok: false, error: 'Utilisateur cible manquant.' });
      if (body.action === 'suspend' || body.action === 'reactivate') {
        const suspended = body.action === 'suspend';
        const ok = patchFileUser(targetUser, { suspended });
        if (!ok) return sendJson(res, 404, { ok: false, error: 'Compte introuvable dans le fichier serveur.' });
        return sendJson(res, 200, { ok: true, action: body.action, targetUser, suspended });
      }
      if (body.action === 'delete') {
        const ok = patchFileUser(targetUser, { deleted: true });
        if (!ok) return sendJson(res, 404, { ok: false, error: 'Compte introuvable dans le fichier serveur.' });
        return sendJson(res, 200, { ok: true, action: 'delete', targetUser, deleted: true });
      }
      if (body.action === 'editProfile') {
        const levels = normalizeAccountLevels(Array.isArray(body.levels) ? body.levels.filter(Boolean) : []);
        const firstName = String(body.firstName || '').trim();
        const lastName = String(body.lastName || '').trim();
        const phone = String(body.phone || '').trim();
        if (!levels.length || !firstName || !lastName || !phone) return sendJson(res, 400, { ok: false, error: 'Nom, prénom, numéro et niveau sont obligatoires.' });
        const baseUsername = generateUsername({ lastName, firstName, levels, phone });
        const existingRows = mergeUserRows(staticUsers, []).filter((u) => u.username !== targetUser);
        let newUsername = baseUsername;
        let i = 1;
        while (existingRows.some((u) => u.username === newUsername)) newUsername = `${baseUsername}${i++}`;
        patchFileUser(targetUser, { deleted: true });
        const fullName = `${lastName} ${firstName}`.trim();
        saveFileUserRow({ username: newUsername, full_name: fullName, first_name: firstName, last_name: lastName, phone, levels, suspended: false });
        return sendJson(res, 200, { ok: true, action: 'editProfile', oldUsername: targetUser, username: newUsername, levels });
      }
      return sendJson(res, 400, { ok: false, error: 'Action inconnue.' });
    }
    return withDb(res, async (client) => {
      if (!(await assertAdmin(client, adminUsername, sessionToken, admins))) return sendJson(res, 403, { ok: false, error: 'Accès administrateur refusé.' });
      if (!targetUser) return sendJson(res, 400, { ok: false, error: 'Utilisateur cible manquant.' });

      if (body.action === 'suspend') {
        const ts = now();
        const updateResult = await client.query('UPDATE app_users SET suspended=TRUE, updated_at=$2 WHERE username=$1 AND deleted=FALSE RETURNING *', [targetUser, ts]);
        if (!updateResult.rowCount) return sendJson(res, 404, { ok: false, error: 'Compte introuvable ou déjà supprimé.' });
        const sessionsToRevoke = await client.query('SELECT session_token FROM active_sessions WHERE username=$1', [targetUser]);
        for (const row of sessionsToRevoke.rows) {
          await client.query(
            `INSERT INTO revoked_sessions(username, session_token, revoked_at, revoked_by, reason)
             VALUES($1,$2,$3,$4,'admin_suspend_user')
             ON CONFLICT(username, session_token) DO UPDATE SET revoked_at=EXCLUDED.revoked_at, revoked_by=EXCLUDED.revoked_by, reason=EXCLUDED.reason`,
            [targetUser, row.session_token, ts, adminUsername]
          );
        }
        await client.query(
          `INSERT INTO force_logout_requests(username, requested_at, requested_by, reason)
           VALUES($1,$2,$3,'admin_suspend_user')
           ON CONFLICT(username) DO UPDATE SET requested_at=EXCLUDED.requested_at, requested_by=EXCLUDED.requested_by, reason=EXCLUDED.reason`,
          [targetUser, ts, adminUsername]
        );
        await client.query('DELETE FROM active_sessions WHERE username=$1', [targetUser]);
        patchFileUser(targetUser, { suspended: true });
        await addLog(client, { user: targetUser, action: 'admin_suspend_user', details: { by: adminUsername } });
        return sendJson(res, 200, { ok: true, action: 'suspend', targetUser, suspended: true });
      }

      if (body.action === 'reactivate') {
        const updateResult = await client.query('UPDATE app_users SET suspended=FALSE, updated_at=$2 WHERE username=$1 AND deleted=FALSE RETURNING *', [targetUser, now()]);
        if (!updateResult.rowCount) return sendJson(res, 404, { ok: false, error: 'Compte introuvable ou déjà supprimé.' });
        await client.query('DELETE FROM force_logout_requests WHERE username=$1', [targetUser]);
        await client.query('DELETE FROM revoked_sessions WHERE username=$1', [targetUser]);
        patchFileUser(targetUser, { suspended: false });
        await addLog(client, { user: targetUser, action: 'admin_reactivate_user', details: { by: adminUsername } });
        return sendJson(res, 200, { ok: true, action: 'reactivate', targetUser, suspended: false });
      }

      if (body.action === 'delete') {
        const updateResult = await client.query('UPDATE app_users SET deleted=TRUE, updated_at=$2 WHERE username=$1 RETURNING *', [targetUser, now()]);
        if (!updateResult.rowCount) return sendJson(res, 404, { ok: false, error: 'Compte introuvable.' });
        await client.query('DELETE FROM active_sessions WHERE username=$1', [targetUser]);
        await client.query('DELETE FROM force_logout_requests WHERE username=$1', [targetUser]);
        await client.query('DELETE FROM revoked_sessions WHERE username=$1', [targetUser]);
        patchFileUser(targetUser, { deleted: true });
        await addLog(client, { user: targetUser, action: 'admin_delete_user', details: { by: adminUsername } });
        return sendJson(res, 200, { ok: true, action: 'delete', targetUser, deleted: true });
      }

      if (body.action === 'editProfile') {
        const levels = normalizeAccountLevels(Array.isArray(body.levels) ? body.levels.filter(Boolean) : []);
        if (!levels.length) return sendJson(res, 400, { ok: false, error: 'Veuillez sélectionner au moins un niveau valide.' });
        const firstName = String(body.firstName || '').trim();
        const lastName = String(body.lastName || '').trim();
        const phone = String(body.phone || '').trim();
        if (!firstName || !lastName || !phone) return sendJson(res, 400, { ok: false, error: 'Premier nom, deuxième nom et numéro sont obligatoires.' });
        const baseUsername = generateUsername({ lastName, firstName, levels, phone });
        let newUsername = baseUsername;
        let i = 1;
        while ((await client.query('SELECT 1 FROM app_users WHERE username=$1 AND username<>$2 AND deleted=FALSE', [newUsername, targetUser])).rowCount || (staticUsers[newUsername] && newUsername !== targetUser)) newUsername = `${baseUsername}${i++}`;
        const fullName = `${lastName} ${firstName}`.trim();
        const updateResult = await client.query(
          `UPDATE app_users
           SET username=$2, full_name=$3, first_name=$4, last_name=$5, phone=$6, levels=$7::jsonb, updated_at=$8
           WHERE username=$1 AND deleted=FALSE
           RETURNING username, full_name, first_name, last_name, phone, levels, suspended`,
          [targetUser, newUsername, fullName, firstName, lastName, phone, JSON.stringify(levels), now()]
        );
        if (!updateResult.rowCount) return sendJson(res, 404, { ok: false, error: 'Compte introuvable ou déjà supprimé.' });
        await client.query('UPDATE active_sessions SET username=$2 WHERE username=$1', [targetUser, newUsername]);
        await client.query('UPDATE force_logout_requests SET username=$2 WHERE username=$1', [targetUser, newUsername]);
        await client.query('UPDATE revoked_sessions SET username=$2 WHERE username=$1', [targetUser, newUsername]);
        patchFileUser(targetUser, { deleted: true });
        saveFileUserRow({ username: newUsername, full_name: fullName, first_name: firstName, last_name: lastName, phone, levels, suspended: updateResult.rows[0].suspended });
        await addLog(client, { user: newUsername, action: 'admin_edit_user', details: { by: adminUsername, oldUsername: targetUser, levels } });
        return sendJson(res, 200, { ok: true, action: 'editProfile', oldUsername: targetUser, username: newUsername, levels, user: updateResult.rows[0] });
      }

      return sendJson(res, 400, { ok: false, error: 'Action inconnue.' });
    });
  }


  if (req.method === 'POST' && url.pathname === '/api/admin/sync-github') {
    const body = await readJsonBody(req);
    const adminUsername = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim();
    const direction = String(body.direction || 'pull').trim();
    if (!GITHUB_SYNC_ENABLED) return sendJson(res, 400, { ok: false, error: 'Synchronisation GitHub non configurée. Ajoute GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH et GITHUB_USERS_PATH sur ton serveur.' });
    if (!pool) {
      if (!admins.includes(adminUsername)) return sendJson(res, 403, { ok: false, error: 'Accès administrateur refusé.' });
    } else {
      const allowed = await new Promise((resolve) => withDb(res, async (client) => resolve(await assertAdmin(client, adminUsername, sessionToken, admins))));
      if (!allowed) return sendJson(res, 403, { ok: false, error: 'Accès administrateur refusé.' });
    }
    if (direction === 'push') {
      const ok = await pushUsersStoreToGitHub(readUsersStore());
      return sendJson(res, ok ? 200 : 500, { ok, direction: 'push', github: { repo: GITHUB_REPO, branch: GITHUB_BRANCH, path: GITHUB_USERS_PATH } });
    }
    const ok = await pullUsersStoreFromGitHub(true);
    return sendJson(res, ok ? 200 : 500, { ok, direction: 'pull', github: { repo: GITHUB_REPO, branch: GITHUB_BRANCH, path: GITHUB_USERS_PATH } });
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/save-settings') {
    const body = await readJsonBody(req);
    const adminUsername = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim();
    return withDb(res, async (client) => {
      if (!(await assertAdmin(client, adminUsername, sessionToken, admins))) return sendJson(res, 403, { ok: false, error: 'Accès administrateur refusé.' });
      await client.query(`INSERT INTO app_settings(key, value, updated_at, updated_by) VALUES('global',$1::jsonb,$2,$3)
        ON CONFLICT(key) DO UPDATE SET value=EXCLUDED.value, updated_at=EXCLUDED.updated_at, updated_by=EXCLUDED.updated_by`, [JSON.stringify(body.settings || {}), now(), adminUsername]);
      await addLog(client, { user: adminUsername, action: 'admin_save_settings', details: body.settings || {} });
      return sendJson(res, 200, { ok: true });
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/disconnect-all') {
    const body = await readJsonBody(req);
    const adminUsername = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim();
    return withDb(res, async (client) => {
      if (!(await assertAdmin(client, adminUsername, sessionToken, admins))) return sendJson(res, 403, { ok: false, error: 'Accès administrateur refusé.' });
      const result = await client.query('DELETE FROM active_sessions WHERE username<>$1', [adminUsername]);
      await addLog(client, { user: adminUsername, action: 'admin_disconnect_all', details: { disconnected: result.rowCount } });
      return sendJson(res, 200, { ok: true, disconnected: result.rowCount });
    });
  }

  sendJson(res, 404, { ok: false, error: 'API inconnue.' });
});


function startKeepAlive() {
  const rawUrl = process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || '';
  if (!rawUrl) return;
  const pingUrl = rawUrl.replace(/\/$/, '') + '/api/health';
  const intervalMs = Number(process.env.KEEP_ALIVE_INTERVAL_MS || 10 * 60 * 1000);
  setInterval(() => {
    fetch(pingUrl).catch(() => {});
  }, intervalMs).unref?.();
  console.log(`Keep-alive activé vers ${pingUrl}`);
}

initDb()
  .then(async () => {
    await pullUsersStoreFromGitHub(true);
    server.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}${LOCAL_MODE ? ' en mode local sans PostgreSQL' : ' avec PostgreSQL'}`);
      if (!LOCAL_MODE) startKeepAlive();
    });
  })
  .catch((err) => {
    console.error('Impossible d\'initialiser PostgreSQL:', err);
    server.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT} en mode local de secours`));
  });

