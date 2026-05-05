const http = require('http');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const { Pool } = require('pg');

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const SESSION_TIMEOUT_MS = Number(process.env.SESSION_TIMEOUT_MS || 365 * 24 * 60 * 60 * 1000);
const MAX_BODY_BYTES = Number(process.env.MAX_BODY_BYTES || 200_000);
const LOGIN_RATE_LIMIT_WINDOW_MS = Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000);
const LOGIN_RATE_LIMIT_MAX = Number(process.env.LOGIN_RATE_LIMIT_MAX || 30);
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERREUR: DATABASE_URL est manquant. Crée une base PostgreSQL sur Neon et colle sa chaîne de connexion dans Render > Environment.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
});

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

function now() { return Date.now(); }

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
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    ...extra,
  };
}

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS active_sessions (
      username TEXT PRIMARY KEY,
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
}

async function cleanupExpired(client = pool) {
  await client.query('DELETE FROM active_sessions WHERE $1 - last_seen > $2', [now(), SESSION_TIMEOUT_MS]);
}

function rowToSession(row) {
  if (!row) return null;
  return {
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
  const forbiddenFiles = new Set(['server.js', 'database.json', '.env', 'render.yaml', '.env.example']);
  if (!filePath.startsWith(ROOT) || forbiddenFiles.has(path.basename(filePath))) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404); res.end('Not found'); return; }
    const isStaticAsset = /\.(png|jpg|jpeg|webp|svg|css)$/i.test(filePath);
    res.writeHead(200, securityHeaders({
      'Content-Type': getMime(filePath),
      'Cache-Control': isStaticAsset ? 'public, max-age=86400' : 'no-cache',
    }));
    fs.createReadStream(filePath).pipe(res);
  });
}

async function withDb(res, handler) {
  const client = await pool.connect();
  try {
    // Les sessions restent actives jusqu’à une déconnexion explicite ou une expiration très longue.
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

  const { users, admins } = loadUsersConfig();

  if (req.method === 'GET' && url.pathname === '/api/health') {
    return withDb(res, async () => sendJson(res, 200, { ok: true, database: 'postgresql' }));
  }

  if (req.method === 'POST' && url.pathname === '/api/login') {
    if (isRateLimited(req, 'login')) {
      return sendJson(res, 429, { ok: false, error: 'Trop de tentatives. Réessayez plus tard.' });
    }
    const body = await readJsonBody(req);
    const username = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim() || crypto.randomUUID();
    const device = body.device || {};

    return withDb(res, async (client) => {
      if (!users[username]) {
        await addLog(client, { user: username || '-', action: 'login_invalid', device });
        return sendJson(res, 401, { ok: false, error: 'Identifiants invalides.' });
      }

      await client.query('BEGIN');
      try {
        const existingResult = await client.query('SELECT * FROM active_sessions WHERE username = $1 FOR UPDATE', [username]);
        const existing = rowToSession(existingResult.rows[0]);

        if (existing && existing.sessionToken !== sessionToken) {
          await addLog(client, {
            user: username,
            action: 'login_refused_already_online',
            device,
            blockedBy: publicSession(existing),
          });
          await client.query('COMMIT');
          return sendJson(res, 409, {
            ok: false,
            error: 'Accès refusé.\nvous n\'êtes pas propriétaire de ce compte.\nMerci de contacter les administrateurs au 0708190886 / 0709282169 pour obtenir votre compte personnel.',
          });
        }

        const startedAt = existing?.startedAt || now();
        const lastSeen = now();
        await client.query(
          `INSERT INTO active_sessions(username, session_token, device_id, browser, platform, user_agent, language, online, started_at, last_seen, ip)
           VALUES($1,$2,$3,$4,$5,$6,$7,TRUE,$8,$9,$10)
           ON CONFLICT(username) DO UPDATE SET
             session_token = EXCLUDED.session_token,
             device_id = EXCLUDED.device_id,
             browser = EXCLUDED.browser,
             platform = EXCLUDED.platform,
             user_agent = EXCLUDED.user_agent,
             language = EXCLUDED.language,
             online = TRUE,
             last_seen = EXCLUDED.last_seen,
             ip = EXCLUDED.ip`,
          [username, sessionToken, device.deviceId || '-', device.browser || '-', device.platform || '-', device.userAgent || '-', device.language || '-', startedAt, lastSeen, getClientIp(req)]
        );
        const session = { username, sessionToken, deviceId: device.deviceId || '-', browser: device.browser || '-', platform: device.platform || '-', userAgent: device.userAgent || '-', language: device.language || '-', online: true, startedAt, lastSeen, ip: getClientIp(req) };
        await addLog(client, { user: username, action: 'login', device: publicSession(session) });
        await client.query('COMMIT');
        return sendJson(res, 200, { ok: true, user: username, admin: admins.includes(username), userConfig: users[username] });
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/heartbeat') {
    const body = await readJsonBody(req);
    const username = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim();
    return withDb(res, async (client) => {
      const result = await client.query('UPDATE active_sessions SET last_seen=$1, online=TRUE WHERE username=$2 AND session_token=$3 RETURNING username', [now(), username, sessionToken]);
      if (!result.rowCount) return sendJson(res, 401, { ok: false, error: 'Session expirée ou remplacée.' });
      return sendJson(res, 200, { ok: true });
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
      const session = rowToSession(result.rows[0]);
      if (!session) return sendJson(res, 401, { ok: false });
      await addLog(client, { user: username, action: String(body.action || 'activity'), details: body.details || {}, device: publicSession(session) });
      return sendJson(res, 200, { ok: true });
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/admin/logs') {
    const body = await readJsonBody(req);
    const username = String(body.username || '').trim();
    const sessionToken = String(body.sessionToken || '').trim();
    return withDb(res, async (client) => {
      const sessionResult = await client.query('SELECT * FROM active_sessions WHERE username=$1 AND session_token=$2', [username, sessionToken]);
      if (!admins.includes(username) || !sessionResult.rowCount) {
        return sendJson(res, 403, { ok: false, error: 'Accès administrateur refusé.' });
      }
      const activeResult = await client.query('SELECT * FROM active_sessions ORDER BY last_seen DESC');
      const logsResult = await client.query('SELECT * FROM login_logs ORDER BY timestamp ASC LIMIT 5000');
      return sendJson(res, 200, {
        ok: true,
        activeSessions: Object.fromEntries(activeResult.rows.map((r) => [r.username, publicSession(rowToSession(r))])),
        loginLogs: logsResult.rows.map(rowToLog),
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
      const deleted = await client.query('DELETE FROM active_sessions WHERE username=$1 RETURNING username', [targetUser]);
      await addLog(client, { user: targetUser, action: 'admin_force_logout', details: { by: adminUsername } });
      return sendJson(res, 200, { ok: true, disconnected: deleted.rowCount });
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
      // Les sessions restent actives jusqu’à une déconnexion explicite ou une expiration très longue.
    await cleanupExpired(client);
      await addLog(client, { user: adminUsername, action: 'admin_clear_expired' });
      return sendJson(res, 200, { ok: true });
    });
  }

  sendJson(res, 404, { ok: false, error: 'API inconnue.' });
});

initDb()
  .then(() => server.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT} avec PostgreSQL`)))
  .catch((err) => {
    console.error('Impossible d\'initialiser PostgreSQL:', err);
    process.exit(1);
  });
