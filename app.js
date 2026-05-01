/* global QUIZ_QUESTIONS, USERS */

(function () {
  const els = {
    screenCode: document.getElementById("screenCode"),
    appContent: document.getElementById("appContent"),
    formCode: document.getElementById("formCode"),
    inputUsername: document.getElementById("inputUsername"),
    codeError: document.getElementById("codeError"),

    screenStart: document.getElementById("screenStart"),
    screenQuiz: document.getElementById("screenQuiz"),
    screenResult: document.getElementById("screenResult"),
    screenReview: document.getElementById("screenReview"),
    screenAdmin: document.getElementById("screenAdmin"),
    screenDictionary: document.getElementById("screenDictionary"),

    selectLevel: document.getElementById("selectLevel"),
    selectSubject: document.getElementById("selectSubject"),
    selectTopic: document.getElementById("selectTopic"),
    btnModeQuiz: document.getElementById("btnModeQuiz"),
    btnModeDE: document.getElementById("btnModeDE"),
    modeNormal: document.getElementById("modeNormal"),
    modeDE: document.getElementById("modeDE"),
    selectDETrack: document.getElementById("selectDETrack"),
    selectDESubject: document.getElementById("selectDESubject"),
    selectDETopic: document.getElementById("selectDETopic"),
    btnStart: document.getElementById("btnStart"),
    btnReset: document.getElementById("btnReset"),
    questionBankInfo: document.getElementById("questionBankInfo"),

    quizMeta: document.getElementById("quizMeta"),
    questionText: document.getElementById("questionText"),
    answers: document.getElementById("answers"),
    btnSkip: document.getElementById("btnSkip"),
    btnNext: document.getElementById("btnNext"),
    progressBar: document.getElementById("progressBar"),
    progressText: document.getElementById("progressText"),
    quizTimer: document.getElementById("quizTimer"),

    scoreText: document.getElementById("scoreText"),
    btnRetry: document.getElementById("btnRetry"),
    btnReview: document.getElementById("btnReview"),

    reviewList: document.getElementById("reviewList"),
    btnBackToStart: document.getElementById("btnBackToStart"),

    btnOpenSettings: document.getElementById("btnOpenSettings"),
    settingsDialog: document.getElementById("settingsDialog"),
    inputStudentName: document.getElementById("inputStudentName"),
    toggleShuffle: document.getElementById("toggleShuffle"),
    btnSaveSettings: document.getElementById("btnSaveSettings"),
    btnLogout: document.getElementById("btnLogout"),
    currentUser: document.getElementById("currentUser"),
    btnAdmin: document.getElementById("btnAdmin"),
    adminLogs: document.getElementById("adminLogs"),
    btnBackToStartFromAdmin: document.getElementById("btnBackToStartFromAdmin"),

    btnDictionary: document.getElementById("btnDictionary"),
    btnBackToStartFromDictionary: document.getElementById("btnBackToStartFromDictionary"),
    inputDictionarySearch: document.getElementById("inputDictionarySearch"),
    dictionaryList: document.getElementById("dictionaryList"),
  };

  const STORAGE_KEYS = {
    settings: "quizRevision.settings.v1",
    last: "quizRevision.lastSession.v1",
    user: "quizRevision.user.v1",
    activeUsers: "quizRevision.activeUsers.v1",
    activityLog: "quizRevision.activityLog.v1",
    lastResult: "quizRevision.lastResult.v1",
  };

  function isAccessGranted() {
    const user = sessionStorage.getItem(STORAGE_KEYS.user);
    return user && window.USERS && window.USERS[user];
  }

  function grantAccess(username) {
  if (username) {
    const active = getActiveUsers();
    const currentUser = sessionStorage.getItem(STORAGE_KEYS.user);

    // 🔥 corrige bug déjà connecté
    if (active[username] && currentUser !== username) {
      alert("Accès refusé. Merci de contacter les administrateurs au 0708190886 / 0709282169 pour obtenir votre compte personnel.");
      return;
    }

    active[username] = Date.now();
    setActiveUsers(active);

    sessionStorage.setItem(STORAGE_KEYS.user, username);
    logActivity(username, 'login');
  }

  if (els.screenCode) els.screenCode.classList.add("hidden");
  if (els.appContent) els.appContent.classList.remove("hidden");

  if (els.currentUser) els.currentUser.textContent = username;

  // ✅ QUIZ toujours visible
  if (els.btnModeQuiz) els.btnModeQuiz.style.display = "";

  // 🔒 DE selon niveau
  if (!hasDEAccess()) {
    if (els.btnModeDE) els.btnModeDE.style.display = "none";
  } else {
    if (els.btnModeDE) els.btnModeDE.style.display = "";
  }

  // admin
  if (els.btnAdmin && window.ADMINS && window.ADMINS.includes(username)) {
    els.btnAdmin.classList.remove("hidden");
  } else if (els.btnAdmin) {
    els.btnAdmin.classList.add("hidden");
  }
}

  function denyAccess() {
    const user = sessionStorage.getItem(STORAGE_KEYS.user);
    if (user) {
      const active = getActiveUsers();
      delete active[user];
      setActiveUsers(active);
      logActivity(user, 'logout');
    }
    sessionStorage.removeItem(STORAGE_KEYS.user);
    if (els.screenCode) els.screenCode.classList.remove("hidden");
    if (els.appContent) els.appContent.classList.add("hidden");
    if (els.inputUsername) els.inputUsername.value = "";
    if (els.codeError) {
      els.codeError.style.display = "none";
      els.codeError.textContent = "";
    }
    if (els.currentUser) els.currentUser.textContent = "";
  }

  function getActiveUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.activeUsers);
    const users = raw ? JSON.parse(raw) : {};

    const now = Date.now();
    const TIMEOUT = 5 * 60 * 1000; // 5 minutes

    for (const u in users) {
      if (now - users[u] > TIMEOUT) {
        delete users[u];
      }
    }

    localStorage.setItem(STORAGE_KEYS.activeUsers, JSON.stringify(users));

    return users;
  } catch {
    return {};
  }
function hasDEAccess() {
  const user = sessionStorage.getItem(STORAGE_KEYS.user);
  const userConfig = window.USERS?.[user];

  if (!userConfig) return false;

  if (userConfig.levels === "all") return true;

  if (!Array.isArray(userConfig.levels)) return false;

  return userConfig.levels.includes("A2-Niveau moyen") ||
         userConfig.levels.includes("L3-Niveau Accompli INF") ||
         userConfig.levels.includes("L3-Niveau Accompli INF") ||
         userConfig.levels.includes("L3-Niveau Accompli SF");
}
}

  function setActiveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.activeUsers, JSON.stringify(users));
  }

  function logActivity(user, action, details = {}) {
    const log = {
      user,
      action,
      timestamp: Date.now(),
      ...details
    };
    try {
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.activityLog) || '[]');
      logs.push(log);
      // Garder seulement les 1000 derniers logs
      if (logs.length > 1000) logs.shift();
      localStorage.setItem(STORAGE_KEYS.activityLog, JSON.stringify(logs));
    } catch (e) {
      console.error('Erreur lors du logging:', e);
    }
  }

  function getActivityLogs() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.activityLog) || '[]');
    } catch {
      return [];
    }
  }
  function hasDEAccess() {
  const user = sessionStorage.getItem(STORAGE_KEYS.user);
  const userConfig = window.USERS?.[user];

  if (!userConfig) return false;

  if (userConfig.levels === "all") return true;

  if (!Array.isArray(userConfig.levels)) return false;

  return userConfig.levels.includes("A2-Niveau moyen") ||
         userConfig.levels.includes("L3-Niveau Accompli INF") ||
         userConfig.levels.includes("L3-Niveau Accompli INF") ||
         userConfig.levels.includes("L3-Niveau Accompli SF");
}

  function renderAdminLogs() {
    const logs = getActivityLogs();
    els.adminLogs.innerHTML = "";
    if (logs.length === 0) {
      els.adminLogs.innerHTML = "<p class='muted'>Aucune activité enregistrée.</p>";
      return;
    }
    logs.reverse().forEach(log => {
      const item = document.createElement("div");
      item.className = "admin-log-item";
      const date = new Date(log.timestamp).toLocaleString('fr-FR');
      let details = "";
      if (log.action === 'start_quiz') {
        details = `Niveau: ${log.level}, Matière: ${log.subject}, Sujet: ${log.topic}, Questions: ${log.questionCount}`;
      } else if (log.action === 'finish_quiz') {
        details = `Score: ${log.correct}/${log.total} (${log.percentage}%), Répondu: ${log.answered}/${log.total}`;
      }
      item.innerHTML = `<strong>${log.user}</strong> - ${log.action} - ${date}<br><small>${details}</small>`;
      els.adminLogs.appendChild(item);
    });
  }

  const QUESTION_TIME_SEC = 40;
  const MAX_QUESTIONS_PER_SESSION = 100;
  let questionTimerId = null;
  let questionTimerRemaining = 0;
  let lastTimedQuestionIndex = -1;
  let abandonListener = null;

  function safeText(s) {
    return String(s ?? "");
  }

  function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.settings);
      if (!raw) return { studentName: "", shuffleQuestions: true };
      const parsed = JSON.parse(raw);
      return {
        studentName: typeof parsed.studentName === "string" ? parsed.studentName : "",
        // Toujours mélanger les questions (Quiz + EFF) pour éviter
        // un ordre fixe quand on refait le même sujet.
        shuffleQuestions: true,
      };
    } catch {
      return { studentName: "", shuffleQuestions: true };
    }
  }

  function saveSettings(next) {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(next));
  }

  function clearQuestionTimer() {
    if (questionTimerId) {
      clearInterval(questionTimerId);
      questionTimerId = null;
    }
  }

  function startQuestionTimer() {
    clearQuestionTimer();
    questionTimerRemaining = QUESTION_TIME_SEC;
    if (els.quizTimer) els.quizTimer.textContent = `${questionTimerRemaining} s`;
    questionTimerId = setInterval(() => {
      questionTimerRemaining--;
      if (els.quizTimer) els.quizTimer.textContent = `${questionTimerRemaining} s`;
      if (questionTimerRemaining <= 0) {
        clearQuestionTimer();
        goNext();
      }
    }, 1000);
  }

  function showScreen(which) {
    if (!which) return;
    if (which !== els.screenQuiz) {
      clearQuestionTimer();
      if (abandonListener) {
        window.removeEventListener('beforeunload', abandonListener);
        abandonListener = null;
      }
    } else {
      // Add abandon listener when showing quiz
      if (!abandonListener) {
        abandonListener = () => {
          session.abandoned = true;
        };
        window.addEventListener('beforeunload', abandonListener);
      }
    }
    const screens = [
      els.screenStart,
      els.screenQuiz,
      els.screenResult,
      els.screenReview,
      els.screenAdmin,
      els.screenDictionary,
    ].filter(Boolean);
    for (const s of screens) s.classList.add("hidden");
    which.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function normalizeDictionaryEntry(e) {
    if (!e || typeof e !== "object") return null;
    const term = safeText(e.term).trim();
    const definition = safeText(e.definition).trim();
    if (!term || !definition) return null;
    return { term, definition };
  }

  function getDictionary() {
    const raw = Array.isArray(window.MEDICAL_DICTIONARY) ? window.MEDICAL_DICTIONARY : [];
    return raw.map(normalizeDictionaryEntry).filter(Boolean);
  }

  function renderDictionary(query) {
    if (!els.dictionaryList) return;
    const q = normalizeKey(query || "");
    const raw = Array.isArray(window.MEDICAL_DICTIONARY) ? window.MEDICAL_DICTIONARY : [];
    const tokens = q.split(" ").filter(Boolean);

    if (tokens.length === 0) {
      els.dictionaryList.innerHTML = "<p class='muted'>Saisis un mot dans la barre de recherche pour afficher les termes correspondants.</p>";
      return;
    }

    const unique = new Map();
    for (const e of raw) {
      const term = safeText(e && e.term).trim();
      const definition = safeText(e && e.definition).trim();
      if (!term || !definition) continue;
      const searchableTerm = normalizeKey(term);
      const old = unique.get(searchableTerm);
      if (!old || definition.length > old.definition.length) {
        unique.set(searchableTerm, { term, definition, searchableTerm });
      }
    }

    const items = Array.from(unique.values())
      .filter((e) => tokens.every((token) => e.searchableTerm.includes(token)))
      .sort((a, b) => {
        const aStarts = a.searchableTerm.startsWith(q) ? 0 : 1;
        const bStarts = b.searchableTerm.startsWith(q) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        const aTermMatch = tokens.every((token) => a.searchableTerm.includes(token)) ? 0 : 1;
        const bTermMatch = tokens.every((token) => b.searchableTerm.includes(token)) ? 0 : 1;
        if (aTermMatch !== bTermMatch) return aTermMatch - bTermMatch;
        return a.term.localeCompare(b.term, "fr", { sensitivity: "base" });
      });

    if (items.length === 0) {
      els.dictionaryList.innerHTML = "<p class='muted'>Aucun mot correspondant trouvé.</p>";
      return;
    }

    const maxResults = 80;
    const fragment = document.createDocumentFragment();
    const info = document.createElement("p");
    info.className = "muted small";
    info.textContent = String(items.length) + " résultat(s) trouvé(s)" + (items.length > maxResults ? " — " + String(maxResults) + " affiché(s)" : "");
    fragment.appendChild(info);

    for (const e of items.slice(0, maxResults)) {
      const item = document.createElement("div");
      item.className = "dictItem";
      const t = document.createElement("div");
      t.className = "dictItem__term";
      t.textContent = e.term;
      const d = document.createElement("div");
      d.className = "dictItem__def";
      d.textContent = e.definition;
      item.appendChild(t);
      item.appendChild(d);
      fragment.appendChild(item);
    }

    els.dictionaryList.innerHTML = "";
    els.dictionaryList.appendChild(fragment);
  }

  function normalizeQuestion(q) {
    if (!q || typeof q !== "object") return null;
    const level = safeText(q.level || "");
    const subject = safeText(q.subject || "");
    const topic = safeText(q.topic || "");
    const category = safeText(q.category || "");
    const computedCategory =
      level && subject ? `${level} — ${subject}` : category || (level ? level : "Sans catégorie");
    const base = {
      id: safeText(q.id),
      category: computedCategory,
      level: level || "",
      subject: subject || "",
      topic: topic || "",
      question: safeText(q.question),
      explanation: q.explanation ? safeText(q.explanation) : "",
    };

    if (q.type === "tf") {
      if (typeof q.answer !== "boolean") return null;
      return { ...base, type: "tf", answer: q.answer };
    }

    // default: mcq (une ou plusieurs bonnes réponses)
    if (!Array.isArray(q.choices) || q.choices.length < 2) return null;
    const choices = q.choices.map((c) => safeText(c));

    if (Array.isArray(q.answerIndices)) {
      const answerIndices = q.answerIndices
        .map((n) => (Number.isInteger(n) ? n : -1))
        .filter((n) => n >= 0 && n < choices.length);
      const uniqueSorted = Array.from(new Set(answerIndices)).sort((a, b) => a - b);
      if (uniqueSorted.length < 1) return null;
      return { ...base, type: "mcq_multi", choices, answerIndices: uniqueSorted };
    }

    const answerIndex = Number.isInteger(q.answerIndex) ? q.answerIndex : -1;
    if (answerIndex < 0 || answerIndex >= choices.length) return null;
    return { ...base, type: "mcq", choices, answerIndex };
  }

  const QUIZ_QUESTIONS_SOURCE = Array.isArray(window.QUIZ_QUESTIONS_QUIZ)
    ? window.QUIZ_QUESTIONS_QUIZ
    : (Array.isArray(window.QUIZ_QUESTIONS) ? window.QUIZ_QUESTIONS : []);
  const DE_QUESTIONS_SOURCE = Array.isArray(window.QUIZ_QUESTIONS_DE) ? window.QUIZ_QUESTIONS_DE : [];
  const ALL_RAW_QUESTIONS = QUIZ_QUESTIONS_SOURCE.concat(DE_QUESTIONS_SOURCE);

  const QUIZ_SUBJECT_TOPICS =
    (window.SUJETS_PAR_MATIERE_QUIZ && typeof window.SUJETS_PAR_MATIERE_QUIZ === "object")
      ? window.SUJETS_PAR_MATIERE_QUIZ
      : ((window.SUJETS_PAR_MATIERE && typeof window.SUJETS_PAR_MATIERE === "object") ? window.SUJETS_PAR_MATIERE : {});

  function computeDESubjectTopicsFromQuestions() {
    const src = DE_QUESTIONS_SOURCE;
    const bySubject = {};
    for (const q of src) {
      if (!q || typeof q !== "object") continue;
      const subject = safeText(q.subject || "").trim();
      const topic = safeText(q.topic || "").trim();
      if (!subject || !topic) continue;
      if (!bySubject[subject]) bySubject[subject] = new Set();
      bySubject[subject].add(topic);
    }
    const out = {};
    for (const [subject, set] of Object.entries(bySubject)) {
      const topics = Array.from(set);
      // Tri naturel "Sujet 1..9" si applicable, sinon tri alpha
      topics.sort((a, b) => {
        const na = normalizeKey(a);
        const nb = normalizeKey(b);
        const ma = na.match(/^sujet\s*([0-9]+)$/);
        const mb = nb.match(/^sujet\s*([0-9]+)$/);
        if (ma && mb) return Number(ma[1]) - Number(mb[1]);
        return a.localeCompare(b, "fr", { sensitivity: "base" });
      });
      out[subject] = topics;
    }
    return out;
  }

  // Pour le mode "Examen de Fin de Formation", on préfère dériver les matières/sujets
  // des questions réellement disponibles (filtrées via `questions.eff.js`).
  // Cela garantit que seuls "Sujet 1..9" apparaissent si ce sont les seuls présents.
  const DE_SUBJECT_TOPICS = (() => {
    const computed = computeDESubjectTopicsFromQuestions();
    if (Object.keys(computed).length > 0) return computed;
    return (window.SUJETS_PAR_MATIERE_DE && typeof window.SUJETS_PAR_MATIERE_DE === "object")
      ? window.SUJETS_PAR_MATIERE_DE
      : {};
  })();

  function getQuestionBank() {
    const raw = ALL_RAW_QUESTIONS;
    const normalized = raw.map(normalizeQuestion).filter(Boolean);
    // remove duplicates by id (keep first)
    const seen = new Set();
    const unique = [];
    for (const q of normalized) {
      if (!q.id || seen.has(q.id)) continue;
      seen.add(q.id);
      unique.push(q);
    }
    return unique;
  }

  const ALL_LEVELS = [
    "A1-Base Santé",
    "A2-Niveau moyen",
    "L1-Niveau Émergent",
    "L2-Niveau Ascendant",
    "L3-Niveau Accompli SF",
    "L3-Niveau Accompli INF",
  ];

  // Matières affichées dans la liste déroulante.
  // On les tire de `sujets.js` pour éviter les oublis quand on ajoute de nouvelles matières.
  const ALL_SUBJECTS =
    (QUIZ_SUBJECT_TOPICS && typeof QUIZ_SUBJECT_TOPICS === "object")
      ? Object.keys(QUIZ_SUBJECT_TOPICS)
      : ["Pédiatrie", "Santé Publique", "Pathologies churigicale / Sémiologie", "Pathologies médicales / Sémiologie"];

  // Normalisation pour éviter les problèmes quand on saisit/édite des matières et sujets
  // (casse, espaces en trop, accents).
  function normalizeKey(s) {
    return safeText(s)
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase()
      // Retire les accents (ex: "physiologie" == "physiologie")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  // Map: subject normalisé -> { originalKey, topics }
  const SUBJECT_TOPICS_BY_NORM = (() => {
    const raw = QUIZ_SUBJECT_TOPICS;
    const out = {};
    for (const [key, topics] of Object.entries(raw)) {
      const norm = normalizeKey(key);
      if (out[norm]) continue; // éviter les collisions : on garde le premier
      out[norm] = {
        originalKey: key,
        topics: Array.isArray(topics) ? topics : [],
      };
    }
    return out;
  })();

 function computeLevels() {
  const user = sessionStorage.getItem(STORAGE_KEYS.user);
  const userConfig = window.USERS?.[user];

  if (!userConfig) return [];

  if (userConfig.levels === "all") {
    return ALL_LEVELS;
  }

  if (Array.isArray(userConfig.levels)) {
    return userConfig.levels.slice();
  }

  return [];
}

  function computeSubjectsForLevel(level) {
    const nLevel = normalizeKey(level);
    const unique = (arr) => Array.from(new Set((arr || []).map((s) => safeText(s).trim()).filter(Boolean)));

    // Liste officielle des matières par niveau, définie dans sujets.js.
    // Ainsi, quand on change le niveau, seules les matières du niveau choisi s'affichent.
    if (window.SUBJECTS_BY_LEVEL && typeof window.SUBJECTS_BY_LEVEL === "object") {
      for (const [levelName, subjects] of Object.entries(window.SUBJECTS_BY_LEVEL)) {
        if (nLevel === normalizeKey(levelName) && Array.isArray(subjects)) {
          return ["Toutes les matières", ...unique(subjects)];
        }
      }
    }

    return ["Toutes les matières", ...unique(ALL_SUBJECTS)];
  }

  function computeTopicsForSubject(subject) {
    if (!subject || subject === "Toutes les matières") return ["Tous les sujets"];
    const entry = SUBJECT_TOPICS_BY_NORM[normalizeKey(subject)];
    if (entry && Array.isArray(entry.topics) && entry.topics.length > 0) {
      return ["Tous les sujets"].concat(entry.topics);
    }

    // Fallback: si la matière n'est pas trouvée dans `sujets.js`,
    // on dérive les sujets depuis les questions existantes.
    const byQuestions = Array.from(
      new Set(
        getQuestionBank()
          .filter((q) => normalizeKey(q.subject) === normalizeKey(subject))
          .map((q) => safeText(q.topic).trim())
          .filter(Boolean)
      )
    );

    if (byQuestions.length > 0) {
      byQuestions.sort((a, b) => {
        const na = normalizeKey(a);
        const nb = normalizeKey(b);
        const ma = na.match(/^sujet\s*([0-9]+)$/);
        const mb = nb.match(/^sujet\s*([0-9]+)$/);
        if (ma && mb) return Number(ma[1]) - Number(mb[1]);
        return a.localeCompare(b, "fr", { sensitivity: "base" });
      });
      return ["Tous les sujets"].concat(byQuestions);
    }

    return ["Tous les sujets"];
  }

  function setOptions(select, options, valueToSelect) {
    select.innerHTML = "";
    for (const opt of options) {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      select.appendChild(o);
    }
    if (valueToSelect && options.includes(valueToSelect)) select.value = valueToSelect;
  }

  let currentMode = "normal";

  const DE_TRACKS = [
    { value: "IDE/SFM", label: "IDE/SFM" },
    { value: "Auxiliaire", label: "Auxiliaire" },
  ];

  const DE_SUBJECTS_FIXED = [
    "Pédiatrie",
    "Santé Publique",
    "Médecine",
    "Chirurgie",
    "Planning Famillial",
    "Gynécologie",
  ];

  const DE_TOPICS_FIXED = [
    "Sujet 1",
    "Sujet 2",
    "Sujet 3",
    "Sujet 4",
    "Sujet 5",
    "Sujet 6",
    "Sujet 7",
    "Sujet 8",
    "Sujet 9",
  ];

  function getDESubjects() {
    // On force la liste des matières demandées, même si certaines n'ont pas encore de questions.
    return DE_SUBJECTS_FIXED.map((s) => ({ value: s, label: s }));
  }

  function getDETopicsForSubject(subject) {
    // On force "Sujet 1..9" comme demandé.
    // Le bouton "Démarrer" sera désactivé si aucune question ne correspond.
    return DE_TOPICS_FIXED.slice();
  }

  function setOptionsObjects(select, items, valueToSelect) {
    select.innerHTML = "";
    for (const item of items) {
      const o = document.createElement("option");
      o.value = item.value;
      o.textContent = item.label;
      select.appendChild(o);
    }
    if (valueToSelect && items.some((i) => i.value === valueToSelect)) select.value = valueToSelect;
  }

  function filterBank(bank, { level, subject, topic }) {
  let out = bank;

  if (level && level !== "Tous les niveaux") {
    out = out.filter(q => normalizeKey(q.level) === normalizeKey(level));
  }

  if (subject && subject !== "Toutes les matières") {
    out = out.filter(q => normalizeKey(q.subject) === normalizeKey(subject));
  }

  if (topic && topic !== "Tous les sujets") {
    out = out.filter(q => normalizeKey(q.topic) === normalizeKey(topic));
  }

  return out;
}

  function filterBankDE(bank, { track, subject, topic }) {
    let out = bank;
    const nTrack = normalizeKey(track);
    if (nTrack.includes("ide/sfm")) out = out.filter((q) => normalizeKey(q.level).includes("ide/sfm"));
    if (nTrack.includes("auxiliaire")) out = out.filter((q) => normalizeKey(q.level).includes("auxiliaire"));

    if (subject) out = out.filter((q) => normalizeKey(q.subject) === normalizeKey(subject));
    if (topic) out = out.filter((q) => normalizeKey(q.topic) === normalizeKey(topic));
    return out;
  }

  function updateDEStartInfo() {
    if (!els.selectDETrack || !els.selectDESubject || !els.selectDETopic) return;
    bank = getQuestionBank();
    const track = els.selectDETrack.value;
    const subject = els.selectDESubject.value;
    const topic = els.selectDETopic.value;

    const filtered = filterBankDE(bank, { track, subject, topic });
    els.questionBankInfo.textContent = `${filtered.length} question${filtered.length > 1 ? "s" : ""} dispo`;
    els.btnStart.disabled = filtered.length === 0;
  }

  function setupDESelectors() {
    if (!els.selectDETrack || !els.selectDESubject || !els.selectDETopic) return;

    setOptionsObjects(els.selectDETrack, DE_TRACKS, DE_TRACKS[0].value);
    const subjects = getDESubjects();
    if (subjects.length === 0) {
      setOptionsObjects(els.selectDESubject, [{ value: "", label: "Aucune matière DE" }], "");
      setOptions(els.selectDETopic, ["Aucun sujet"], "Aucun sujet");
      updateDEStartInfo();
      return;
    }

    setOptionsObjects(els.selectDESubject, subjects, subjects[0].value);
    const topics = getDETopicsForSubject(els.selectDESubject.value);
    setOptions(els.selectDETopic, topics, topics[0]);

    updateDEStartInfo();
  }

  function setMode(nextMode) {

  // 🔒 sécurité : bloquer accès DE
  if (nextMode === "de" && !hasDEAccess()) {
    alert("Accès refusé à l'Examen de Fin de Formation.");
    return;
  }

  currentMode = nextMode;

  if (els.modeNormal && els.modeDE) {
    if (nextMode === "normal") {
      els.modeDE.classList.add("hidden");
      els.modeNormal.classList.remove("hidden");
      if (els.btnModeQuiz) els.btnModeQuiz.classList.add("active");
      if (els.btnModeDE) els.btnModeDE.classList.remove("active");
      updateStartInfo();
    } else {
      els.modeNormal.classList.add("hidden");
      els.modeDE.classList.remove("hidden");
      if (els.btnModeQuiz) els.btnModeQuiz.classList.remove("active");
      if (els.btnModeDE) els.btnModeDE.classList.add("active");
      updateDEStartInfo();
    }
  }
}

  function pickQuestions(filtered, shuffleQuestions) {
    const pool = filtered.slice();
    // Toujours mélanger pour chaque session (Quiz + EFF)
    // afin que refaire "Sujet 1" change l'ordre et la numérotation.
    shuffleInPlace(pool);
    return pool.slice(0, MAX_QUESTIONS_PER_SESSION);
  }

  function formatMeta({ level, subject, topic, total }, settings) {
    const parts = [];
    if (level && level !== "Tous les niveaux") parts.push(level);
    if (subject && subject !== "Toutes les matières") parts.push(subject);
    if (topic && topic !== "Tous les sujets") parts.push(topic);
    parts.push("QCM + V/F");
    parts.push(`${total} question${total > 1 ? "s" : ""}`);
    const name = settings.studentName.trim();
    if (name) parts.push(`Bon courage, ${name} !`);
    return parts.join(" • ");
  }

  function isAnswered(q, answer) {
    if (!q) return false;
    if (q.type === "mcq") return Number.isInteger(answer?.selectedIndex);
    if (q.type === "mcq_multi") return Array.isArray(answer?.selectedIndices) && answer.selectedIndices.length > 0;
    if (q.type === "tf") return typeof answer?.selectedBool === "boolean";
    return false;
  }

  function normalizeSelectedIndices(indices, maxLen) {
    if (!Array.isArray(indices)) return [];
    const cleaned = indices
      .map((n) => (Number.isInteger(n) ? n : -1))
      .filter((n) => n >= 0 && n < maxLen);
    return Array.from(new Set(cleaned)).sort((a, b) => a - b);
  }

  function isCorrect(q, answer) {
    if (!isAnswered(q, answer)) return false;
    if (q.type === "mcq") return answer.selectedIndex === q.answerIndex;
    if (q.type === "mcq_multi") {
      const selected = normalizeSelectedIndices(answer?.selectedIndices, q.choices.length);
      if (selected.length !== q.answerIndices.length) return false;
      for (let i = 0; i < selected.length; i++) if (selected[i] !== q.answerIndices[i]) return false;
      return true;
    }
    if (q.type === "tf") return answer.selectedBool === q.answer;
    return false;
  }

  let bank = getQuestionBank();
  let settings = loadSettings();

  let session = {
    startedAt: null,
    level: "Tous les niveaux",
    subject: "Toutes les matières",
    topic: "Tous les sujets",
    questions: [],
    answersById: {}, // { [id]: { selectedIndex? , selectedBool? } }
    index: 0,
    abandoned: false,
  };

  function updateStartInfo() {
    bank = getQuestionBank();
    const levels = computeLevels();
    setOptions(els.selectLevel, levels, session.level);
if (!levels.includes(session.level)) {
  session.level = levels[0];
  els.selectLevel.value = session.level;
}
    const subjects = computeSubjectsForLevel(els.selectLevel.value);
    const desiredSubject = subjects.includes(session.subject) ? session.subject : "Toutes les matières";
    setOptions(els.selectSubject, subjects, desiredSubject);
    session.subject = els.selectSubject.value;

    const topics = computeTopicsForSubject(els.selectSubject.value);
    const desiredTopic = topics.includes(session.topic) ? session.topic : "Tous les sujets";
    setOptions(els.selectTopic, topics, desiredTopic);
    session.topic = els.selectTopic.value;

    const filtered = filterBank(bank, {
      level: els.selectLevel.value,
      subject: els.selectSubject.value,
      topic: els.selectTopic.value,
    });
    els.questionBankInfo.textContent = `${filtered.length} question${filtered.length > 1 ? "s" : ""} dispo`;

    const max = filtered.length;
    els.btnStart.disabled = max === 0;
  }

  function renderQuiz() {
    const q = session.questions[session.index];
    if (!q) return;

    if (session.index !== lastTimedQuestionIndex) {
      lastTimedQuestionIndex = session.index;
      startQuestionTimer();
    }

    const total = session.questions.length;
    const pos = session.index + 1;

    els.quizMeta.textContent = formatMeta(
      { level: session.level, subject: session.subject, topic: session.topic, total },
      settings
    );
    els.questionText.textContent = q.question;

    const pct = total === 0 ? 0 : Math.round((pos / total) * 100);
    els.progressBar.style.width = `${pct}%`;
    const answeredCount = session.questions.reduce(
      (acc, qq) => acc + (isAnswered(qq, session.answersById[qq.id]) ? 1 : 0),
      0
    );
    els.progressText.textContent = `Question ${pos}/${total} • Répondu: ${answeredCount}/${total}`;

    els.btnNext.textContent = session.index === total - 1 ? "Terminer" : "Suivant";

    els.answers.innerHTML = "";
    const currentAnswer = session.answersById[q.id] || {};

    if (q.type === "tf") {
      const tfChoices = [
        { label: "Vrai", value: true },
        { label: "Faux", value: false },
      ];
      for (const c of tfChoices) {
        const item = document.createElement("label");
        item.className = "answer";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "answer";
        input.value = c.value ? "true" : "false";
        input.checked = currentAnswer.selectedBool === c.value;
        const text = document.createElement("div");
        text.className = "answer__text";
        text.textContent = c.label;
        item.appendChild(input);
        item.appendChild(text);
        if (input.checked) item.classList.add("answer--selected");
        item.addEventListener("click", () => {
          session.answersById[q.id] = { selectedBool: c.value };
          goNext();
        });
        els.answers.appendChild(item);
      }
      return;
    }

    if (q.type === "mcq_multi") {
      const selected = normalizeSelectedIndices(currentAnswer.selectedIndices, q.choices.length);
      for (let idx = 0; idx < q.choices.length; idx++) {
        const choiceText = q.choices[idx];
        const item = document.createElement("label");
        item.className = "answer";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.name = "answerMulti";
        input.value = String(idx);
        input.checked = selected.includes(idx);
        const text = document.createElement("div");
        text.className = "answer__text";
        text.textContent = choiceText;
        item.appendChild(input);
        item.appendChild(text);
        if (input.checked) item.classList.add("answer--selected");
        item.addEventListener("click", () => {
          const next = new Set(selected);
          if (next.has(idx)) next.delete(idx);
          else next.add(idx);
          session.answersById[q.id] = { selectedIndices: Array.from(next) };
          renderQuiz();
        });
        els.answers.appendChild(item);
      }
      return;
    }

    for (let idx = 0; idx < q.choices.length; idx++) {
      const choiceText = q.choices[idx];
      const item = document.createElement("label");
      item.className = "answer";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.value = String(idx);
      input.checked = currentAnswer.selectedIndex === idx;
      const text = document.createElement("div");
      text.className = "answer__text";
      text.textContent = choiceText;
      item.appendChild(input);
      item.appendChild(text);
      if (input.checked) item.classList.add("answer--selected");
      item.addEventListener("click", () => {
        session.answersById[q.id] = { selectedIndex: idx };
        goNext();
      });
      els.answers.appendChild(item);
    }
  }

  function computeScore() {
  if (session.abandoned) {
    return { correct: 0, answered: 0, total: session.questions.length, score: 0 };
  }

  let correct = 0;
  let answered = 0;
  let wrong = 0;
  let score = 0;

  for (const q of session.questions) {
    const a = session.answersById[q.id];

    if (isAnswered(q, a)) {
      answered++;

      if (isCorrect(q, a)) {
        correct++;
        score += 1; // +1 bonne réponse
      } else {
        wrong++;
        score -= 1; // ❌ pénalité
      }
    }
  }

  // Règle demandée:
  // - bonne réponse: +1
  // - mauvaise réponse: -1
  // - non répondu: 0 (donc score inchangé)
  return { correct, wrong, answered, total: session.questions.length, score };
}

function renderResult() {
    const { correct, answered, total, score } = computeScore();
    const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
    els.scoreText.textContent =
  `${correct}/${total} correct • ${pct}% • Score: ${score} • répondu: ${answered}/${total}`;
    const user = sessionStorage.getItem(STORAGE_KEYS.user);
    logActivity(user, 'finish_quiz', { correct, answered, total, percentage: pct, score });
    localStorage.setItem(
  STORAGE_KEYS.lastResult,
  JSON.stringify({
    session,
    result: computeScore()
  })
);
  }

  function renderReview() {
    els.reviewList.innerHTML = "";
    const { correct, answered, total, score } = computeScore();
const pct = total === 0 ? 0 : Math.round((correct / total) * 100);

const head = document.createElement("div");
head.className = "pill";
head.textContent = `${correct}/${total} correct • ${pct}% • Score: ${score} • répondu: ${answered}/${total}`;

    for (let i = 0; i < session.questions.length; i++) {
      const q = session.questions[i];
      const a = session.answersById[q.id] || {};
      const ok = isCorrect(q, a);
      const answered = isAnswered(q, a);

      const item = document.createElement("div");
      item.className = "reviewItem";

      const qEl = document.createElement("div");
      qEl.className = "reviewItem__q";
      qEl.textContent = `${i + 1}. ${q.question}`;

      const meta = document.createElement("div");
      meta.className = "reviewItem__meta";
      const tag1 = document.createElement("span");
      tag1.className = "tag";
      tag1.textContent = q.category;
      const tag2 = document.createElement("span");
      tag2.className = `tag ${answered ? (ok ? "tag--ok" : "tag--bad") : ""}`;
      tag2.textContent = ok ? "Correct" : answered ? "Incorrect" : "Non répondu";
      meta.appendChild(tag1);
      meta.appendChild(tag2);

      const body = document.createElement("div");
      body.className = "muted";

      if (q.type === "tf") {
        const your = typeof a.selectedBool === "boolean" ? (a.selectedBool ? "Vrai" : "Faux") : "—";
        const right = q.answer ? "Vrai" : "Faux";
        body.textContent = `Ta réponse: ${your} • Bonne réponse: ${right}`;
      } else if (q.type === "mcq_multi") {
        const selected = normalizeSelectedIndices(a.selectedIndices, q.choices.length);
        const your =
          selected.length > 0 ? selected.map((i2) => q.choices[i2]).filter(Boolean).join(", ") : "—";
        const right = q.answerIndices.map((i2) => q.choices[i2]).filter(Boolean).join(", ");
        body.textContent = `Tes réponses: ${your} • Bonnes réponses: ${right}`;
      } else {
        const your =
          Number.isInteger(a.selectedIndex) && q.choices[a.selectedIndex] != null
            ? q.choices[a.selectedIndex]
            : "—";
        const right = q.choices[q.answerIndex];
        body.textContent = `Ta réponse: ${your} • Bonne réponse: ${right}`;
      }

      item.appendChild(qEl);
      item.appendChild(meta);
      item.appendChild(body);

      if (q.explanation) {
        const exp = document.createElement("div");
        exp.className = "small muted";
        exp.style.marginTop = "8px";
        exp.textContent = `Explication: ${q.explanation}`;
        item.appendChild(exp);
      }

      els.reviewList.appendChild(item);
    }
  }

  function startNewSession() {
    alert(
      "Règles de score :\n\n" +
        "Bonne réponse : +1\n" +
        "Mauvaise réponse : -1\n" +
        "Réponse non répondu : +0"
    );

    if (currentMode === "de") {
      const track = els.selectDETrack?.value;
      const subject = els.selectDESubject?.value;
      const topic = els.selectDETopic?.value || "";

      const filtered = filterBankDE(bank, { track, subject, topic });
      const picked = pickQuestions(filtered, settings.shuffleQuestions);

      lastTimedQuestionIndex = -1;
      session = {
        startedAt: Date.now(),
        level: track,
        subject,
        topic,
        questions: picked,
        answersById: {},
        index: 0,
        abandoned: false,
      };

      const user = sessionStorage.getItem(STORAGE_KEYS.user);
      logActivity(user, "start_quiz", { level: track, subject, topic, questionCount: picked.length });

      showScreen(els.screenQuiz);
      renderQuiz();
      return;
    }

    const level = els.selectLevel.value;
    const subject = els.selectSubject.value;
    const topic = els.selectTopic?.value || "Tous les sujets";
    const filtered = filterBank(bank, { level, subject, topic });
    const picked = pickQuestions(filtered, settings.shuffleQuestions);

    lastTimedQuestionIndex = -1;
    session = {
      startedAt: Date.now(),
      level,
      subject,
      topic,
      questions: picked,
      answersById: {},
      index: 0,
      abandoned: false,
    };

    const user = sessionStorage.getItem(STORAGE_KEYS.user);
    logActivity(user, "start_quiz", { level, subject, topic, questionCount: picked.length });

    try {
      localStorage.setItem(
        STORAGE_KEYS.last,
        JSON.stringify({
          startedAt: session.startedAt,
          level,
          subject,
          questionIds: picked.map((q) => q.id),
        })
      );
    } catch {
      // ignore
    }

    showScreen(els.screenQuiz);
    renderQuiz();
  }

  function goNext() {
    const atLast = session.index >= session.questions.length - 1;
    if (atLast) {
      showScreen(els.screenResult);
      renderResult();
      return;
    }
    session.index++;
    renderQuiz();
  }

  function goPrev() {
    if (session.index <= 0) {
      showScreen(els.screenResult);
      renderResult();
      return;
    }
    session.index--;
    renderQuiz();
  }

  function skipQuestion() {
    const q = session.questions[session.index];
    if (!q) return;
    delete session.answersById[q.id];
    goNext();
  }

  function finishQuiz() {
    showScreen(els.screenResult);
    renderResult();
  }

  function resetAll() {
    localStorage.removeItem(STORAGE_KEYS.last);
    localStorage.removeItem(STORAGE_KEYS.settings);
    settings = loadSettings();
    els.inputStudentName.value = settings.studentName;
    els.toggleShuffle.checked = settings.shuffleQuestions;
    session.index = 0;
    showScreen(els.screenStart);
    if (currentMode === "normal") updateStartInfo();
    else updateDEStartInfo();
  }

  // Events
  els.selectLevel.addEventListener("change", () => {
    if (currentMode !== "normal") return;
    session.level = els.selectLevel.value;
    session.subject = "Toutes les matières";
    session.topic = "Tous les sujets";
    updateStartInfo();
  });
  els.selectSubject.addEventListener("change", () => {
    if (currentMode !== "normal") return;
    session.subject = els.selectSubject.value;
    session.topic = "Tous les sujets";
    updateStartInfo();
  });
  if (els.selectTopic) {
    els.selectTopic.addEventListener("change", () => {
      if (currentMode !== "normal") return;
      session.topic = els.selectTopic.value;
      updateStartInfo();
    });
  }

  els.btnStart.addEventListener("click", startNewSession);

  // Onglet "Examen de Fin de Formation"
  if (els.btnModeQuiz) {
    els.btnModeQuiz.addEventListener("click", () => setMode("normal"));
  }
  if (els.btnModeDE) {
    els.btnModeDE.addEventListener("click", () => setMode("de"));
  }
  if (els.selectDETrack) {
    els.selectDETrack.addEventListener("change", () => {
      const subjects = getDESubjects();
      if (subjects.length === 0) {
        setOptionsObjects(els.selectDESubject, [{ value: "", label: "Aucune matière DE" }], "");
        setOptions(els.selectDETopic, ["Aucun sujet"], "Aucun sujet");
        updateDEStartInfo();
        return;
      }

      setOptionsObjects(els.selectDESubject, subjects, subjects[0].value);
      const topics = getDETopicsForSubject(els.selectDESubject.value);
      setOptions(els.selectDETopic, topics, topics[0]);
      updateDEStartInfo();
    });
  }
  if (els.selectDESubject) {
    els.selectDESubject.addEventListener("change", () => {
      const topics = getDETopicsForSubject(els.selectDESubject.value);
      setOptions(els.selectDETopic, topics, topics[0]);
      updateDEStartInfo();
    });
  }
  if (els.selectDETopic) els.selectDETopic.addEventListener("change", updateDEStartInfo);

  els.btnNext.addEventListener("click", goNext);
  els.btnSkip.addEventListener("click", finishQuiz);

  els.btnRetry.addEventListener("click", () => {
    showScreen(els.screenStart);
    if (currentMode === "normal") updateStartInfo();
    else updateDEStartInfo();
  });
  els.btnReview.addEventListener("click", () => {
    showScreen(els.screenReview);
    renderReview();
  });
  els.btnBackToStart.addEventListener("click", () => {
    showScreen(els.screenStart);
    if (currentMode === "normal") updateStartInfo();
    else updateDEStartInfo();
  });

  if (els.btnAdmin) {
    els.btnAdmin.addEventListener("click", () => {
      showScreen(els.screenAdmin);
      renderAdminLogs();
    });
  }

  if (els.btnBackToStartFromAdmin) {
    els.btnBackToStartFromAdmin.addEventListener("click", () => {
      showScreen(els.screenStart);
      if (currentMode === "normal") updateStartInfo();
      else updateDEStartInfo();
    });
  }

  if (els.btnDictionary) {
    els.btnDictionary.addEventListener("click", () => {
      showScreen(els.screenDictionary);
      if (els.inputDictionarySearch) els.inputDictionarySearch.value = "";
      renderDictionary("");
      if (els.inputDictionarySearch) els.inputDictionarySearch.focus();
    });
  }

  if (els.btnBackToStartFromDictionary) {
    els.btnBackToStartFromDictionary.addEventListener("click", () => {
      showScreen(els.screenStart);
      if (currentMode === "normal") updateStartInfo();
      else updateDEStartInfo();
    });
  }

  if (els.inputDictionarySearch) {
    els.inputDictionarySearch.addEventListener("input", () => {
      renderDictionary(els.inputDictionarySearch.value);
    });
  }

  els.btnOpenSettings.addEventListener("click", () => {
    els.inputStudentName.value = settings.studentName;
    // Mélange forcé: garder le toggle en "on" et empêcher de le désactiver.
    els.toggleShuffle.checked = true;
    els.toggleShuffle.disabled = true;
    els.settingsDialog.showModal();
  });
  els.btnSaveSettings.addEventListener("click", () => {
    settings = {
      studentName: safeText(els.inputStudentName.value).slice(0, 40),
      shuffleQuestions: true,
    };
    saveSettings(settings);
  });

  els.btnReset.addEventListener("click", () => {
    const ok = confirm("Réinitialiser la progression et les paramètres ?");
    if (!ok) return;
    resetAll();
  });

  if (els.formCode) {
    els.formCode.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = (els.inputUsername?.value || "").trim();
      const users = window.USERS || {};
      if (users[username]) {
        grantAccess(username);
        els.inputStudentName.value = settings.studentName;
        els.toggleShuffle.checked = settings.shuffleQuestions;
        updateStartInfo();
        setupDESelectors();
        showScreen(els.screenStart);
      } else {
        if (els.codeError) {
          els.codeError.textContent = "Identifiants invalides.";
          els.codeError.style.display = "block";
        }
      }
    });
  }

  if (els.btnLogout) {
    els.btnLogout.addEventListener("click", () => {
      denyAccess();
    });
  }

  // init
  if (isAccessGranted()) {
    const user = sessionStorage.getItem(STORAGE_KEYS.user);
    grantAccess(user);
    els.inputStudentName.value = settings.studentName;
    els.toggleShuffle.checked = settings.shuffleQuestions;
    updateStartInfo();
    setupDESelectors();
    showScreen(els.screenStart);
  } else {
    denyAccess();
  }
})();
