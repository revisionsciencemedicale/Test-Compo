/* global QUIZ_QUESTIONS, USERS */

(function () {
  const els = {
    screenCode: document.getElementById("screenCode"),
    appContent: document.getElementById("appContent"),
    formCode: document.getElementById("formCode"),
    inputUsername: document.getElementById("inputUsername"),
    codeError: document.getElementById("codeError"),
    btnFreeTrial: document.getElementById("btnFreeTrial"),

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
    btnFinish: document.getElementById("btnFinish"),
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
    btnHome: document.getElementById("btnHome"),
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
    lastResult: "quizRevision.lastResult.v1",
    sessionToken: "quizRevision.sessionToken.v1",
    deviceId: "quizRevision.deviceId.v1",
    appSettings: "quizRevision.appSettings.v1",
  };

  const FREE_TRIAL_USER = "__ESSAI_GRATUIT__";
  const FREE_TRIAL_LEVEL = "Essai gratuit";
  const FREE_TRIAL_SUBJECT = "Sujet d’essai gratuit";
  const FREE_TRIAL_TOPIC = "Sujet essai";
  const FREE_TRIAL_BLOCK_MESSAGE =
    "Veuillez disposer d’un compte personnel pour accéder à tous les quiz ainsi qu’aux corrections expliquées.\n" +
    "Merci de contacter les administrateurs au +225 0708190886 / +225 0709282169 pour obtenir votre compte personnel.";

  const FREE_TRIAL_QUESTIONS = [
    {
      id: "essai-gratuit-1",
      level: FREE_TRIAL_LEVEL,
      subject: FREE_TRIAL_SUBJECT,
      topic: FREE_TRIAL_TOPIC,
      type: "mcq",
      question: "Quel est le signe principal de la fièvre ?",
      choices: ["Température élevée", "Peau toujours froide", "Absence de pouls", "Vision trouble uniquement"],
      answerIndex: 0,
      explanation: "La fièvre correspond à une élévation anormale de la température corporelle."
    },
    {
      id: "essai-gratuit-2",
      level: FREE_TRIAL_LEVEL,
      subject: FREE_TRIAL_SUBJECT,
      topic: FREE_TRIAL_TOPIC,
      type: "mcq",
      question: "Quel geste est prioritaire avant de faire un pansement ?",
      choices: ["Se laver ou se désinfecter les mains", "Toucher directement la plaie", "Réutiliser une compresse sale", "Souffler sur la plaie"],
      answerIndex: 0,
      explanation: "L’hygiène des mains réduit le risque de contamination de la plaie."
    },
    {
      id: "essai-gratuit-3",
      level: FREE_TRIAL_LEVEL,
      subject: FREE_TRIAL_SUBJECT,
      topic: FREE_TRIAL_TOPIC,
      type: "tf",
      question: "Une mauvaise hydratation peut entraîner une fatigue et une sécheresse des muqueuses.",
      answer: true,
      explanation: "La déshydratation peut provoquer fatigue, soif, sécheresse buccale et diminution des urines."
    },
    {
      id: "essai-gratuit-4",
      level: FREE_TRIAL_LEVEL,
      subject: FREE_TRIAL_SUBJECT,
      topic: FREE_TRIAL_TOPIC,
      type: "mcq",
      question: "Quel est le rôle principal d’un antiseptique ?",
      choices: ["Détruire ou réduire les microbes", "Augmenter le saignement", "Remplacer l’eau de boisson", "Endormir le patient"],
      answerIndex: 0,
      explanation: "Un antiseptique sert à réduire ou éliminer les micro-organismes sur les tissus vivants."
    },
    {
      id: "essai-gratuit-5",
      level: FREE_TRIAL_LEVEL,
      subject: FREE_TRIAL_SUBJECT,
      topic: FREE_TRIAL_TOPIC,
      type: "mcq",
      question: "Quel élément est indispensable pour prendre la température ?",
      choices: ["Un thermomètre", "Un tensiomètre", "Une seringue", "Une bande plâtrée"],
      answerIndex: 0,
      explanation: "Le thermomètre est l’instrument utilisé pour mesurer la température corporelle."
    },
    {
      id: "essai-gratuit-6",
      level: FREE_TRIAL_LEVEL,
      subject: FREE_TRIAL_SUBJECT,
      topic: FREE_TRIAL_TOPIC,
      type: "mcq",
      question: "Quelle est la fréquence normale du lavage des mains en milieu de soins ?",
      choices: ["Avant et après chaque soin", "Une fois par jour", "Seulement si les mains sont sales", "Uniquement avant les repas"],
      answerIndex: 0,
      explanation: "Le lavage ou la désinfection des mains doit être réalisé avant et après chaque soin."
    },
    {
      id: "essai-gratuit-7",
      level: FREE_TRIAL_LEVEL,
      subject: FREE_TRIAL_SUBJECT,
      topic: FREE_TRIAL_TOPIC,
      type: "tf",
      question: "Le port des gants peut aider à prévenir certaines infections.",
      answer: true,
      explanation: "Les gants réduisent le risque de transmission des microbes pendant les soins."
    },
    {
      id: "essai-gratuit-8",
      level: FREE_TRIAL_LEVEL,
      subject: FREE_TRIAL_SUBJECT,
      topic: FREE_TRIAL_TOPIC,
      type: "mcq",
      question: "Quel organe permet principalement la respiration ?",
      choices: ["Les poumons", "Le foie", "Les reins", "L’estomac"],
      answerIndex: 0,
      explanation: "Les poumons assurent les échanges gazeux nécessaires à la respiration."
    },
    {
      id: "essai-gratuit-9",
      level: FREE_TRIAL_LEVEL,
      subject: FREE_TRIAL_SUBJECT,
      topic: FREE_TRIAL_TOPIC,
      type: "mcq",
      question: "Quelle est la position recommandée pour un patient en difficulté respiratoire ?",
      choices: ["Position semi-assise", "Position couchée à plat ventre", "Position tête en bas", "Position debout sans appui"],
      answerIndex: 0,
      explanation: "La position semi-assise facilite généralement la respiration."
    },
    {
      id: "essai-gratuit-10",
      level: FREE_TRIAL_LEVEL,
      subject: FREE_TRIAL_SUBJECT,
      topic: FREE_TRIAL_TOPIC,
      type: "tf",
      question: "Une douleur intense doit être signalée rapidement au personnel soignant.",
      answer: true,
      explanation: "Toute douleur importante doit être évaluée et prise en charge rapidement."
    },
    {
      id: "essai-gratuit-11",
      level: FREE_TRIAL_LEVEL,
      subject: FREE_TRIAL_SUBJECT,
      topic: FREE_TRIAL_TOPIC,
      type: "mcq",
      question: "Quel appareil permet de mesurer la tension artérielle ?",
      choices: ["Le tensiomètre", "Le thermomètre", "Le stéthoscope seul", "Le glucomètre"],
      answerIndex: 0,
      explanation: "Le tensiomètre est utilisé pour mesurer la pression artérielle."
    },
    {
      id: "essai-gratuit-12",
      level: FREE_TRIAL_LEVEL,
      subject: FREE_TRIAL_SUBJECT,
      topic: FREE_TRIAL_TOPIC,
      type: "mcq",
      question: "Quel est le premier réflexe devant un saignement important ?",
      choices: ["Comprimer la plaie", "Donner à boire", "Faire marcher le patient", "Appliquer du parfum"],
      answerIndex: 0,
      explanation: "La compression permet de limiter la perte de sang."
    },
    {
      id: "essai-gratuit-13",
      level: FREE_TRIAL_LEVEL,
      subject: FREE_TRIAL_SUBJECT,
      topic: FREE_TRIAL_TOPIC,
      type: "tf",
      question: "La vaccination aide à prévenir certaines maladies infectieuses.",
      answer: true,
      explanation: "La vaccination protège contre plusieurs maladies graves."
    },
    {
      id: "essai-gratuit-14",
      level: FREE_TRIAL_LEVEL,
      subject: FREE_TRIAL_SUBJECT,
      topic: FREE_TRIAL_TOPIC,
      type: "mcq",
      question: "Quel est le signe fréquent d’une hypoglycémie ?",
      choices: ["Sueurs et malaise", "Peau bleue uniquement", "Perte des cheveux", "Douleur au genou uniquement"],
      answerIndex: 0,
      explanation: "Une hypoglycémie peut provoquer des sueurs, tremblements et malaises."
    },
    {
      id: "essai-gratuit-15",
      level: FREE_TRIAL_LEVEL,
      subject: FREE_TRIAL_SUBJECT,
      topic: FREE_TRIAL_TOPIC,
      type: "mcq",
      question: "Pourquoi faut-il respecter les horaires des médicaments ?",
      choices: ["Pour assurer leur efficacité", "Pour décorer le dossier", "Pour fatiguer le patient", "Sans raison particulière"],
      answerIndex: 0,
      explanation: "Le respect des horaires permet une meilleure efficacité du traitement."
    }
  ];

  const DEFAULT_APP_SETTINGS = {
    shuffleQuestions: true,
    shuffleAnswers: false,
    instantCorrection: false,
    finalScore: true,
    negativePoints: true,
    qpqMode: true,
    photoRequired: false,
    cheatDetection: false,
    notifyCheat: false,
    antiScreenshot: false,
    antiTabChange: false,
    antiCopyPaste: false,
    maxWarnings: false,
    autoPenalty: false,
    autoSubmitCheat: false,
    questionTime: 40,
    quizTotalTime: "",
    freeTrialQuestions: 15,
    freeTrialDuration: "",
    freeTrialMaxAttempts: 1,
    autoBackup: false,
    serverSync: true,
    keepAlive: false,
    customQuestions: []
  };

  let appSettings = { ...DEFAULT_APP_SETTINGS };

  function toBool(value, fallback = false) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return fallback;
  }

  function toPositiveNumber(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  }

  function normalizeAppSettings(raw = {}) {
    const merged = { ...DEFAULT_APP_SETTINGS, ...(raw || {}) };
    return {
      ...merged,
      shuffleQuestions: toBool(merged.shuffleQuestions, true),
      shuffleAnswers: toBool(merged.shuffleAnswers, false),
      instantCorrection: toBool(merged.instantCorrection, false),
      finalScore: toBool(merged.finalScore, true),
      negativePoints: toBool(merged.negativePoints, true),
      qpqMode: toBool(merged.qpqMode, true),
      photoRequired: toBool(merged.photoRequired, false),
      cheatDetection: toBool(merged.cheatDetection, false),
      notifyCheat: toBool(merged.notifyCheat, false),
      antiScreenshot: toBool(merged.antiScreenshot, false),
      antiTabChange: toBool(merged.antiTabChange, false),
      antiCopyPaste: toBool(merged.antiCopyPaste, false),
      maxWarnings: toBool(merged.maxWarnings, false),
      autoPenalty: toBool(merged.autoPenalty, false),
      autoSubmitCheat: toBool(merged.autoSubmitCheat, false),
      questionTime: toPositiveNumber(merged.questionTime, 40),
      freeTrialQuestions: Math.max(1, Math.floor(toPositiveNumber(merged.freeTrialQuestions, 15))),
      freeTrialMaxAttempts: Math.max(1, Math.floor(toPositiveNumber(merged.freeTrialMaxAttempts, 1))),
      customQuestions: Array.isArray(merged.customQuestions) ? merged.customQuestions : []
    };
  }

  async function loadAppSettingsFromServer() {
    try {
      const data = await apiGet('/api/settings');
      appSettings = normalizeAppSettings(data.settings || {});
      localStorage.setItem(STORAGE_KEYS.appSettings, JSON.stringify(appSettings));
    } catch (_) {
      try {
        appSettings = normalizeAppSettings(JSON.parse(localStorage.getItem(STORAGE_KEYS.appSettings) || '{}'));
      } catch {
        appSettings = normalizeAppSettings({});
      }
    }
    applyRuntimeSettings();
    return appSettings;
  }

  function shouldAutoAdvance() {
    return appSettings.qpqMode !== false;
  }

  function applyRuntimeSettings() {
    document.body?.classList.toggle('anti-screenshot-enabled', !!appSettings.antiScreenshot);
    document.body?.classList.toggle('copy-blocked', !!appSettings.antiCopyPaste);
  }

  function isFreeTrialUser(user = localStorage.getItem(STORAGE_KEYS.user)) {
    return user === FREE_TRIAL_USER;
  }

  function canUseOfflineMode() {
    return location.protocol === "file:" || !navigator.onLine;
  }

  async function apiPost(path, payload = {}) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || "Erreur serveur");
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  async function apiGet(path) {
    const res = await fetch(path, { method: "GET", headers: { "Accept": "application/json" } });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || "Erreur serveur");
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  function getSessionToken() {
    let token = localStorage.getItem(STORAGE_KEYS.sessionToken);
    if (!token) {
      token = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(STORAGE_KEYS.sessionToken, token);
    }
    return token;
  }

  function getDeviceId() {
    let id = localStorage.getItem(STORAGE_KEYS.deviceId);
    if (!id) {
      id = `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(STORAGE_KEYS.deviceId, id);
    }
    return id;
  }

  function detectBrowser() {
    const ua = navigator.userAgent || "";
    if (ua.includes("Edg/")) return "Microsoft Edge";
    if (ua.includes("Firefox/")) return "Firefox";
    if (ua.includes("OPR/") || ua.includes("Opera")) return "Opera";
    if (ua.includes("Chrome/")) return "Chrome";
    if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
    return "Navigateur inconnu";
  }

  function getDeviceInfo() {
    const platform = navigator.platform || "Appareil inconnu";
    const browser = detectBrowser();
    return {
      deviceId: getDeviceId(),
      browser,
      platform,
      userAgent: navigator.userAgent || "",
      language: navigator.language || "",
      online: navigator.onLine,
    };
  }

  function formatDate(ts) {
    return ts ? new Date(ts).toLocaleString('fr-FR') : "-";
  }

  function readJsonStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJsonStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function currentAuthPayload(extra = {}) {
    return {
      username: localStorage.getItem(STORAGE_KEYS.user) || "",
      sessionToken: localStorage.getItem(STORAGE_KEYS.sessionToken) || "",
      device: getDeviceInfo(),
      ...extra,
    };
  }

  async function logActivity(user, action, details = {}) {
    if (isFreeTrialUser(user)) return;
    try {
      await apiPost("/api/activity", {
        username: user,
        sessionToken: getSessionToken(),
        action,
        details,
        device: getDeviceInfo(),
      });
    } catch (e) {
      // On évite de bloquer le quiz si le journal d'activité ne peut pas être écrit.
      console.warn("Journal d'activité non enregistré:", e.message);
    }
  }

  function clearLocalLogin() {
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.sessionToken);
  }

  async function checkCurrentSession() {
    const user = localStorage.getItem(STORAGE_KEYS.user);
    const token = localStorage.getItem(STORAGE_KEYS.sessionToken);
    if (isFreeTrialUser(user)) {
      return { loggedIn: true, forceLogout: false };
    }
    if (!user || !token) {
      return { loggedIn: false, forceLogout: false };
    }
    try {
      const status = await apiPost("/api/check-session", { username: user, sessionToken: token, device: getDeviceInfo() });
      if (status.userConfig) {
        window.USERS = window.USERS || {};
        window.USERS[user] = status.userConfig;
      }
      // Ne plus déconnecter automatiquement les comptes créés localement / depuis le site
      // quand la session serveur n'est pas retrouvée ou quand l'appareil change.
      // Seule une déconnexion forcée par l'administrateur doit vraiment couper l'accès.
      if (status && status.forceLogout) return status;
      if (status && status.loggedIn === false) {
        return { ...status, loggedIn: true, forceLogout: false, localSessionMaintained: true };
      }
      return status;
    } catch {
      if (canUseOfflineMode() && window.USERS && window.USERS[user]) {
        return { loggedIn: true, forceLogout: false, offlineMode: true };
      }
      // Ne pas déconnecter automatiquement un compte créé sur le site si le serveur répond mal.
      return { loggedIn: true, forceLogout: false, pendingServerCheck: true };
    }
  }

  async function isAccessGranted() {
    const status = await checkCurrentSession();
    if (status.forceLogout) clearLocalLogin();
    return !!status.loggedIn && !status.forceLogout;
  }

  function startSessionHeartbeat(username) {
    stopSessionHeartbeat();
    heartbeatTimerId = setInterval(async () => {
      const current = localStorage.getItem(STORAGE_KEYS.user);
      if (current !== username) return;
      const status = await checkCurrentSession();
      if (status.forceLogout) {
        alert("Votre compte a été déconnecté par un administrateur.");
        denyAccess(false);
      } else if (!status.loggedIn) {
        // On ne déconnecte plus automatiquement l'utilisateur.
        // La déconnexion automatique posait problème aux comptes créés directement depuis le site.
        console.warn("Session non confirmée par le serveur, maintien de l'accès local.", status);
      }
    }, 30000);
  }

  function stopSessionHeartbeat() {
    if (heartbeatTimerId) {
      clearInterval(heartbeatTimerId);
      heartbeatTimerId = null;
    }
  }

  function releaseCurrentSession(action = 'logout') {
    const user = localStorage.getItem(STORAGE_KEYS.user);
    const token = localStorage.getItem(STORAGE_KEYS.sessionToken);
    if (!user || !token) return;
    const payload = JSON.stringify({ username: user, sessionToken: token, action, device: getDeviceInfo() });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/logout", new Blob([payload], { type: "application/json" }));
      } else {
        fetch("/api/logout", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true });
      }
    } catch (e) {
      console.warn("Déconnexion serveur non confirmée:", e.message);
    }
  }

  async function grantAccess(username) {
    username = String(username || "").trim();
    const freeTrial = isFreeTrialUser(username);
    if (!username) {
      const msg = "Veuillez entrer votre nom d’utilisateur avant de vous connecter.";
      if (els.codeError) {
        els.codeError.textContent = msg;
        els.codeError.style.display = "block";
      }
      alert(msg);
      return false;
    }
    if (!freeTrial) {
      try {
        const data = await apiPost("/api/login", {
          username,
          sessionToken: getSessionToken(),
          device: getDeviceInfo(),
        });
        if (data.userConfig) {
          window.USERS = window.USERS || {};
          window.USERS[username] = data.userConfig;
        }
        localStorage.setItem(STORAGE_KEYS.user, username);
        startSessionHeartbeat(username);
      } catch (e) {
        if (canUseOfflineMode() && window.USERS && window.USERS[username]) {
          console.warn("Mode hors ligne activé pour", username);
          localStorage.setItem(STORAGE_KEYS.user, username);
          alert("Mode local hors ligne activé. Certaines fonctions serveur peuvent être indisponibles.");
        } else {
          const msg = e.data?.error || e.message || "Connexion refusée par le serveur.";
          if (e.data?.forcedLogout) {
            clearLocalLogin();
          }
          if (els.codeError) {
            els.codeError.textContent = msg.replace(/\n/g, " ");
            els.codeError.style.display = "block";
          }
          alert(msg);
          return false;
        }
      }
    }

    if (els.screenCode) els.screenCode.classList.add("hidden");
    if (els.appContent) els.appContent.classList.remove("hidden");

    if (els.currentUser) els.currentUser.textContent = freeTrial ? "Essai gratuit" : username;

    if (els.btnModeQuiz) els.btnModeQuiz.style.display = "";

    if (freeTrial || !hasDEAccess()) {
      if (els.btnModeDE) els.btnModeDE.style.display = "none";
    } else {
      if (els.btnModeDE) els.btnModeDE.style.display = "";
    }

    if (freeTrial && els.btnOpenSettings) els.btnOpenSettings.style.display = "none";
    else if (els.btnOpenSettings) els.btnOpenSettings.style.display = "";
    // En mode essai gratuit, le bouton du dictionnaire reste visible.
    // Son ouverture est bloquée par un message explicatif.
    if (els.btnDictionary) els.btnDictionary.style.display = "";
    if (els.btnReset) els.btnReset.classList.add("hidden");

    if (!freeTrial && els.btnAdmin && window.ADMINS && window.ADMINS.includes(username)) {
      els.btnAdmin.classList.remove("hidden");
    } else if (els.btnAdmin) {
      els.btnAdmin.classList.add("hidden");
    }
    return true;
  }

  function denyAccess(sendLogout = true) {
    if (sendLogout) releaseCurrentSession('logout');
    stopSessionHeartbeat();
    clearLocalLogin();
    if (els.screenCode) els.screenCode.classList.remove("hidden");
    if (els.appContent) els.appContent.classList.add("hidden");
    if (els.inputUsername) els.inputUsername.value = "";
    if (els.codeError) {
      els.codeError.style.display = "none";
      els.codeError.textContent = "";
    }
    if (els.currentUser) els.currentUser.textContent = "";
  }

  function normalizeAccountLevel(level) {
    const n = normalizeKey(level);
    if (n === normalizeKey("Auxiliaire 2 année") || n === normalizeKey("AUXI")) return "A2-Niveau moyen";
    if (n === normalizeKey("L3-Niveau Accompli INF/SFM")) return "L3-Niveau Accompli INF";
    if (n === normalizeKey("Licence 3 INF/SAG-M") || n === normalizeKey("INF/SAG-M")) return "L3-Niveau Accompli SF";
    return String(level || "").trim();
  }

  function normalizeAccountLevels(levels) {
    if (levels === "all") return "all";
    if (!Array.isArray(levels)) return [];
    const out = [];
    const seen = new Set();
    for (const level of levels) {
      const normalized = normalizeAccountLevel(level);
      if (!normalized) continue;
      const key = normalizeKey(normalized);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(normalized);
    }
    return out;
  }

  function getCurrentUserConfig() {
    const user = localStorage.getItem(STORAGE_KEYS.user);
    const cfg = window.USERS?.[user];
    if (cfg && Array.isArray(cfg.levels)) cfg.levels = normalizeAccountLevels(cfg.levels);
    return cfg;
  }

  function hasDEAccess() {
    const user = localStorage.getItem(STORAGE_KEYS.user);
    if (isFreeTrialUser(user)) return false;
    const userConfig = getCurrentUserConfig();

    if (!userConfig) return false;
    if (userConfig.levels === "all") return true;
    if (!Array.isArray(userConfig.levels)) return false;

    return userConfig.levels.includes("A2-Niveau moyen") ||
           userConfig.levels.includes("L3-Niveau Accompli INF") ||
           userConfig.levels.includes("L3-Niveau Accompli SF");
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async function renderAdminLogs(options = {}) {
    if (!els.adminLogs) return;
    const silent = !!options.silent;
    // Ne plus afficher "Chargement des paramètres administrateur..." à chaque action.
    // Le panneau reste visible pendant que les données se mettent à jour en arrière-plan.
    if (!silent && !els.adminLogs.dataset.rendered) {
      els.adminLogs.innerHTML = "";
    }

    let payload;
    let adminWarning = "";
    try {
      payload = await Promise.race([
        apiPost("/api/admin/logs", currentAuthPayload()),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Le serveur met trop de temps à répondre. Le menu est affiché en mode local.")), 4500))
      ]);
    } catch (e) {
      adminWarning = e.data?.error || e.message || "Impossible de charger les données serveur. Le menu est affiché en mode local.";
      payload = {
        loginLogs: [],
        activeSessions: {},
        dynamicUsers: [],
        appSettings: {},
        dashboard: { connectedUsers: 0, quizDone: 0 }
      };
    }

    const logs = payload.loginLogs || [];
    const active = payload.activeSessions || {};
    const activeRows = Object.values(active).sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0));
    const dynamicUsers = payload.dynamicUsers || [];
    appSettings = normalizeAppSettings(payload.appSettings || appSettings || {});
    localStorage.setItem(STORAGE_KEYS.appSettings, JSON.stringify(appSettings));
    const dashboard = payload.dashboard || { connectedUsers: activeRows.length, quizDone: logs.filter(l => l.action === 'finish_quiz').length };
    const allQuestionsForLevels = []
      .concat(Array.isArray(window.QUIZ_QUESTIONS) ? window.QUIZ_QUESTIONS : [])
      .concat(Array.isArray(window.QUIZ_QUESTIONS_QUIZ) ? window.QUIZ_QUESTIONS_QUIZ : [])
      .concat(Array.isArray(window.QUIZ_QUESTIONS_DE) ? window.QUIZ_QUESTIONS_DE : []);
    const defaultLevels = ["A1-Base Santé", "A2-Niveau moyen", "L1-Niveau Émergent", "L2-Niveau Ascendant", "L3-Niveau Accompli INF", "L3-Niveau Accompli SF"];
    const removedAccountLevels = new Set([
      normalizeKey("Auxiliaire 2 année"),
      normalizeKey("L3-Niveau Accompli INF/SFM"),
      normalizeKey("Licence 3 INF/SAG-M"),
      normalizeKey("AUXI"),
      normalizeKey("INF/SAG-M"),
    ]);
    const allLevels = Array.from(new Set(allQuestionsForLevels.map(q => q.level).filter(Boolean).concat(defaultLevels)))
      .filter(level => !removedAccountLevels.has(normalizeKey(level)))
      .sort();

    els.adminLogs.dataset.rendered = "1";
    els.adminLogs.innerHTML = `
      ${adminWarning ? `<div class="notice" style="margin-bottom:12px"><strong>Information :</strong> ${escapeHtml(adminWarning)}<br><small>Le menu reste visible. Les actions qui modifient les comptes nécessitent que le serveur et la base de données soient bien connectés.</small></div>` : ""}
      <div class="admin-tabs">
        <button class="btn btn--primary adminTabBtn" data-tab="general" type="button">⚙️ Paramètres généraux</button>
        <button class="btn adminTabBtn" data-tab="quiz" type="button">📚 Gestion des quiz</button>
        <button class="btn adminTabBtn" data-tab="trial" type="button">🎯 Essais gratuits</button>
        <button class="btn adminTabBtn" data-tab="tech" type="button">🌐 Technique</button>
      </div>

      <div class="adminTab" data-panel="general">
        <h3 class="h3">📊 Tableau de bord</h3>
        <div class="admin-cards">
          <div class="admin-card"><strong>${escapeHtml(dashboard.connectedUsers)}</strong><span>Utilisateur(s) connecté(s)</span></div>
          <div class="admin-card"><strong>${escapeHtml(dashboard.quizDone)}</strong><span>Quiz effectué(s)</span></div>
        </div>

        <h3 class="h3">👥 Gestion des comptes et des utilisateurs</h3>
        <div class="admin-box">
          <div class="grid">
            <div class="field"><label class="label">Nom</label><input class="input" id="adminLastName" placeholder="Ex: Kouassi"></div>
            <div class="field"><label class="label">1er prénom</label><input class="input" id="adminFirstName" placeholder="Ex: Jean"></div>
            <div class="field"><label class="label">Téléphone</label><input class="input" id="adminPhone" placeholder="Ex: 0708190886"></div>
          </div>
          <div class="field"><label class="label">Niveaux autorisés</label>
            <div class="checkbox-grid" id="adminLevels">
              ${allLevels.map(l => `<label><input type="checkbox" value="${escapeHtml(l)}"> ${escapeHtml(l)}</label>`).join("")}
            </div>
          </div>
          <div class="create-user-row">
            <button class="btn btn--primary" id="btnCreateUser" type="button">Créer compte automatiquement</button>
            <div id="createdUsername" class="created-username-box">
              ${window.__LAST_CREATED_USER ? `<table class="mini-table"><thead><tr><th>Nom d’utilisateur généré</th></tr></thead><tbody><tr><td><strong>${escapeHtml(window.__LAST_CREATED_USER.username || window.__LAST_CREATED_USER)}</strong></td></tr></tbody></table>` : ""}
            </div>
          </div>
        </div>

        <div class="admin-box">
          <div class="field"><label class="label">Rechercher utilisateur</label><input class="input" id="adminUserSearch" placeholder="Nom d’utilisateur..."></div>
          <div id="adminUsersList"></div>
        </div>

        <h3 class="h3">Utilisateurs connectés en temps réel</h3>
        ${activeRows.length ? activeRows.map(s => `
          <div class="admin-log-item admin-session-row">
            <div>
              <strong>${escapeHtml(s.username)}</strong><br>
              <small>Appareil : ${escapeHtml(s.platform)} | Navigateur : ${escapeHtml(s.browser)} | IP : ${escapeHtml(s.ip)}<br>Connexion : ${formatDate(s.startedAt)} | Dernière activité : ${formatDate(s.lastSeen)}</small>
            </div>
            <button class="btn btn--danger btnForceLogout" type="button" data-user="${escapeHtml(s.username)}" ${s.username === (localStorage.getItem(STORAGE_KEYS.user) || "") ? "disabled" : ""}>Déconnecter</button>
          </div>`).join("") : "<p class='muted'>Aucun compte en ligne actuellement.</p>"}
        <button class="btn btn--danger" id="btnDisconnectAll" type="button" style="margin-top:10px">Déconnexion de tous les appareils</button>

        <h3 class="h3">📋 Journal d’activité</h3>
        <div class="admin-log-list">
          ${[...logs].reverse().slice(0, 150).map(log => {
            const d = log.device || {}; const detailsObj = log.details || {};
            let extra = `Appareil: ${escapeHtml(d.platform || "-")} | Navigateur: ${escapeHtml(d.browser || "-")} | IP: ${escapeHtml(d.ip || "-")} | Dernière activité: ${formatDate(log.timestamp)}`;
            if (log.action === 'finish_quiz') extra += `<br>Quiz: ${escapeHtml(detailsObj.correct)}/${escapeHtml(detailsObj.total)} • Note: ${escapeHtml(detailsObj.note20 || '-')}/20`;
            return `<div class="admin-log-item"><strong>${escapeHtml(log.user)}</strong> - ${escapeHtml(log.action)} - ${formatDate(log.timestamp)}<br><small>${extra}</small></div>`;
          }).join("") || "<p class='muted'>Aucune activité enregistrée.</p>"}
        </div>
      </div>

      <div class="adminTab hidden" data-panel="quiz">
        <h3 class="h3">📚 Ajouter de nouvelles matières et de nouveaux sujets</h3>
        <div class="admin-box">
          <p class="muted small">Import actif : collez un tableau JavaScript de questions ou sélectionnez un fichier <code>.js</code>. Les questions ajoutées seront enregistrées dans les paramètres du serveur et visibles sur le site après enregistrement.</p>
          <input class="input" id="adminImportFile" type="file" accept=".js,.txt,.json">
          <textarea class="input" id="adminImportScript" rows="8" placeholder="Exemple : [{ level: 'A1-Base Santé', subject: 'Anatomie', topic: 'Sujet 1', type: 'mcq', question: '...', choices: ['A','B'], answerIndex: 0, explanation: '...' }]"></textarea>
          <div class="row" style="margin-top:10px">
            <button class="btn" id="btnPreviewImport" type="button">Vérifier l’import</button>
            <button class="btn btn--primary" id="btnApplyImport" type="button">Ajouter ces questions au site</button>
          </div>
          <div id="adminImportStatus" class="muted small" style="margin-top:8px"></div>
        </div>
        <h3 class="h3">🧠 Paramètres des questions</h3>
        <div class="checkbox-grid adminSettings">
          ${[
            ['shuffleQuestions','Mélanger les questions'],['shuffleAnswers','Mélanger les réponses'],['instantCorrection','Afficher correction immédiatement'],['finalScore','Afficher note finale'],['negativePoints','Points négatifs'],['qpqMode','Mode QPQ activé/désactivé'],['photoRequired','Photo obligatoire avant quiz'],['cheatDetection','Gestion tentatives de tricherie'],['notifyCheat','Recevoir notification/appel'],['antiScreenshot','Anti capture d’écran'],['antiTabChange','Anti changement d’onglet ou réduction'],['antiCopyPaste','Anti copier/coller'],['maxWarnings','Nombre maximal d’avertissements'],['autoPenalty','Pénalité automatique'],['autoSubmitCheat','Soumission automatique en cas de tricherie']
          ].map(([k,label]) => `<label><input type="checkbox" data-setting="${k}" ${appSettings[k] ? 'checked' : ''}> ${label}</label>`).join('')}
        </div>
        <div class="grid"><div class="field"><label class="label">Temps par question (secondes)</label><input class="input" data-setting="questionTime" type="number" value="${escapeHtml(appSettings.questionTime || 40)}"></div><div class="field"><label class="label">Temps total du quiz (minutes)</label><input class="input" data-setting="quizTotalTime" type="number" value="${escapeHtml(appSettings.quizTotalTime || '')}"></div></div>
        <button class="btn btn--primary btnSaveAdminSettings" type="button">Enregistrer les paramètres quiz</button>
      </div>

      <div class="adminTab hidden" data-panel="trial">
        <h3 class="h3">🎯 Gestion des essais gratuits</h3>
        <div class="grid"><div class="field"><label class="label">Nombre de questions gratuites</label><input class="input" data-setting="freeTrialQuestions" type="number" value="${escapeHtml(appSettings.freeTrialQuestions || 15)}"></div><div class="field"><label class="label">Durée du test gratuit (minutes)</label><input class="input" data-setting="freeTrialDuration" type="number" value="${escapeHtml(appSettings.freeTrialDuration || '')}"></div><div class="field"><label class="label">Nombre maximal d’essais</label><input class="input" data-setting="freeTrialMaxAttempts" type="number" value="${escapeHtml(appSettings.freeTrialMaxAttempts || 1)}"></div></div>
        <button class="btn btn--primary btnSaveAdminSettings" type="button">Enregistrer les essais gratuits</button>
      </div>

      <div class="adminTab hidden" data-panel="tech">
        <h3 class="h3">🌐 Paramètres techniques</h3>
        <div class="checkbox-grid adminSettings"><label><input type="checkbox" data-setting="autoBackup" ${appSettings.autoBackup ? 'checked' : ''}> Sauvegarde automatique</label><label><input type="checkbox" data-setting="serverSync" ${appSettings.serverSync ? 'checked' : ''}> Synchronisation serveur</label><label><input type="checkbox" data-setting="keepAlive" ${appSettings.keepAlive ? 'checked' : ''}> Garder le serveur actif automatiquement</label></div>
        <button class="btn" id="btnClearCache" type="button">Vider cache local</button>
        <button class="btn btn--primary btnSaveAdminSettings" type="button">Enregistrer paramètres techniques</button>
        <p class="muted small">Pour Render : ajoute aussi la variable d’environnement <code>PUBLIC_URL=https://ton-site.onrender.com</code> pour activer le ping automatique côté serveur.</p>
      </div>
    `;


    // Empêche les actions du panneau admin de provoquer un rechargement complet de la page.
    if (!els.adminLogs.dataset.noReloadGuard) {
      els.adminLogs.dataset.noReloadGuard = "1";
      els.adminLogs.addEventListener('submit', (event) => { event.preventDefault(); });
      els.adminLogs.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (button) event.preventDefault();
      });
    }

    function renderUsers(filter = '') {
      const box = document.getElementById('adminUsersList');
      if (!box) return;
      const q = filter.toLowerCase();
      const rows = dynamicUsers.filter(u => !q || String(u.username).toLowerCase().includes(q) || String(u.full_name || '').toLowerCase().includes(q));
      box.innerHTML = rows.length ? rows.map(u => `<div class="admin-log-item admin-session-row"><div><strong>${escapeHtml(u.username)}</strong><br><small>${escapeHtml(u.full_name || '')} • ${(u.levels || []).map(escapeHtml).join(', ')} • ${u.suspended ? 'Suspendu' : 'Actif'}</small></div><div class="row"><button class="btn btnUserAction" data-action="${u.suspended ? 'reactivate' : 'suspend'}" data-user="${escapeHtml(u.username)}" type="button">${u.suspended ? 'Réactiver' : 'Suspendre'}</button><button class="btn btnUserRename" data-user="${escapeHtml(u.username)}" type="button">Modifier nom</button><button class="btn btn--danger btnUserAction" data-action="delete" data-user="${escapeHtml(u.username)}" type="button">Supprimer</button></div></div>`).join('') : "<p class='muted'>Aucun utilisateur créé depuis le site.</p>";
    }
    renderUsers();

    els.adminLogs.querySelectorAll('.adminTabBtn').forEach(btn => btn.addEventListener('click', () => {
      els.adminLogs.querySelectorAll('.adminTabBtn').forEach(b => b.classList.remove('btn--primary'));
      btn.classList.add('btn--primary');
      els.adminLogs.querySelectorAll('.adminTab').forEach(p => p.classList.toggle('hidden', p.dataset.panel !== btn.dataset.tab));
    }));

    document.getElementById('adminUserSearch')?.addEventListener('input', (e) => renderUsers(e.target.value));
    document.getElementById('btnCreateUser')?.addEventListener('click', async () => {
      const levels = [...document.querySelectorAll('#adminLevels input:checked')].map(i => i.value);
      const body = currentAuthPayload({ lastName: document.getElementById('adminLastName')?.value, firstName: document.getElementById('adminFirstName')?.value, phone: document.getElementById('adminPhone')?.value, levels });
      try {
        const r = await apiPost('/api/admin/create-user', body);
        window.__LAST_CREATED_USER = { username: r.username, levels: r.levels || levels };
        if (r.userConfig) {
          window.USERS = window.USERS || {};
          window.USERS[r.username] = r.userConfig;
        }
        await renderAdminLogs({ silent: true });
      } catch(e) { alert(e.data?.error || e.message); }
    });

    els.adminLogs.querySelectorAll('.btnForceLogout').forEach(button => button.addEventListener('click', async () => {
      const targetUser = button.dataset.user || ''; if (!targetUser || !confirm(`Déconnecter ${targetUser} ?`)) return;
      try { await apiPost('/api/admin/force-logout', currentAuthPayload({ targetUser })); await renderAdminLogs({ silent: true }); } catch(e) { alert(e.data?.error || e.message); }
    }));
    document.getElementById('btnDisconnectAll')?.addEventListener('click', async () => { if (!confirm('Déconnecter tous les autres appareils ?')) return; try { const r = await apiPost('/api/admin/disconnect-all', currentAuthPayload()); alert(`${r.disconnected} session(s) déconnectée(s).`); await renderAdminLogs({ silent: true }); } catch(e) { alert(e.data?.error || e.message); } });
    els.adminLogs.querySelectorAll('.btnUserAction').forEach(btn => btn.addEventListener('click', async () => { if (btn.dataset.action === 'delete' && !confirm(`Supprimer ${btn.dataset.user} ?`)) return; try { await apiPost('/api/admin/update-user', currentAuthPayload({ targetUser: btn.dataset.user, action: btn.dataset.action })); await renderAdminLogs({ silent: true }); } catch(e) { alert(e.data?.error || e.message); } }));
    els.adminLogs.querySelectorAll('.btnUserRename').forEach(btn => btn.addEventListener('click', async () => { const newUsername = prompt('Nouveau nom d’utilisateur :', btn.dataset.user); if (!newUsername) return; try { await apiPost('/api/admin/update-user', currentAuthPayload({ targetUser: btn.dataset.user, action: 'rename', newUsername })); await renderAdminLogs({ silent: true }); } catch(e) { alert(e.data?.error || e.message); } }));
    document.getElementById('btnClearCache')?.addEventListener('click', () => { localStorage.removeItem(STORAGE_KEYS.last); localStorage.removeItem(STORAGE_KEYS.lastResult); alert('Cache local vidé.'); });
    function collectAdminSettings() {
      const settings = { ...appSettings };
      els.adminLogs.querySelectorAll('[data-setting]').forEach(input => {
        settings[input.dataset.setting] = input.type === 'checkbox' ? input.checked : input.value;
      });
      return normalizeAppSettings(settings);
    }

    function parseImportedQuestions(text) {
      const src = String(text || '').trim();
      if (!src) throw new Error('Collez d’abord un tableau de questions ou choisissez un fichier .js.');
      let value;
      try {
        value = JSON.parse(src);
      } catch (_) {
        const cleaned = src
          .replace(/^\s*(?:window\.)?[A-Z0-9_]+\s*=\s*/i, '')
          .replace(/;\s*$/, '');
        value = Function(`"use strict"; return (${cleaned});`)();
      }
      if (!Array.isArray(value)) throw new Error('Le contenu doit être un tableau de questions : [{...}, {...}].');
      const normalized = value.map(normalizeQuestion).filter(Boolean);
      if (!normalized.length) throw new Error('Aucune question valide trouvée. Vérifiez level, subject, topic, type, question et réponses.');
      return normalized;
    }

    document.getElementById('adminImportFile')?.addEventListener('change', async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const text = await file.text();
      const area = document.getElementById('adminImportScript');
      if (area) area.value = text;
    });

    document.getElementById('btnPreviewImport')?.addEventListener('click', () => {
      const status = document.getElementById('adminImportStatus');
      try {
        const imported = parseImportedQuestions(document.getElementById('adminImportScript')?.value || '');
        if (status) status.textContent = `${imported.length} question(s) valide(s) détectée(s).`;
      } catch (e) {
        if (status) status.textContent = e.message;
      }
    });

    document.getElementById('btnApplyImport')?.addEventListener('click', async () => {
      const status = document.getElementById('adminImportStatus');
      try {
        const imported = parseImportedQuestions(document.getElementById('adminImportScript')?.value || '');
        const existing = Array.isArray(appSettings.customQuestions) ? appSettings.customQuestions : [];
        const byId = new Map(existing.map(q => [q.id, q]));
        for (const q of imported) byId.set(q.id, q);
        const settings = normalizeAppSettings({ ...collectAdminSettings(), customQuestions: Array.from(byId.values()) });
        await apiPost('/api/admin/save-settings', currentAuthPayload({ settings }));
        appSettings = settings;
        localStorage.setItem(STORAGE_KEYS.appSettings, JSON.stringify(appSettings));
        bank = getQuestionBank();
        updateStartInfo();
        if (status) status.textContent = `${imported.length} question(s) ajoutée(s). Total importé : ${appSettings.customQuestions.length}.`;
      } catch(e) {
        if (status) status.textContent = e.data?.error || e.message;
        else alert(e.data?.error || e.message);
      }
    });

    els.adminLogs.querySelectorAll('.btnSaveAdminSettings').forEach(btn => btn.addEventListener('click', async () => {
      const settings = collectAdminSettings();
      try {
        await apiPost('/api/admin/save-settings', currentAuthPayload({ settings }));
        appSettings = settings;
        localStorage.setItem(STORAGE_KEYS.appSettings, JSON.stringify(appSettings));
        applyRuntimeSettings();
        bank = getQuestionBank();
        alert('Paramètres enregistrés et appliqués sur le site.');
      } catch(e) { alert(e.data?.error || e.message); }
    }));
  }

  const QUESTION_TIME_SEC = 40; // valeur par défaut si aucun paramètre serveur
  const MAX_QUESTIONS_PER_SESSION = 100;
  let questionTimerId = null;
  let questionTimerRemaining = 0;
  let lastTimedQuestionIndex = -1;
  let abandonListener = null;
  let heartbeatTimerId = null;

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
    questionTimerRemaining = Math.max(5, Math.floor(Number(appSettings.questionTime || QUESTION_TIME_SEC)));
    if (els.quizTimer) els.quizTimer.textContent = `${questionTimerRemaining} s`;
    questionTimerId = setInterval(() => {
      questionTimerRemaining--;
      if (els.quizTimer) els.quizTimer.textContent = `${questionTimerRemaining} s`;
      if (questionTimerRemaining <= 0) {
        clearQuestionTimer();
        advanceAfterAnswer();
      }
    }, 1000);
  }

  function getRequiredAnswerCount(q) {
    if (!q) return 1;
    if (q.type === "mcq_multi" && Array.isArray(q.answerIndices)) return q.answerIndices.length;
    return 1;
  }

  function advanceAfterAnswer() {
    const atLast = session.index >= session.questions.length - 1;
    if (atLast) {
      renderQuiz();
      return;
    }
    goNext();
  }

  function advanceAfterAnswerSoon() {
    clearQuestionTimer();
    setTimeout(advanceAfterAnswer, 250);
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
    if (els.btnReset) {
      els.btnReset.classList.toggle("hidden", which !== els.screenQuiz);
    }
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

  const QUIZ_QUESTIONS_SOURCE = (Array.isArray(window.QUIZ_QUESTIONS_QUIZ)
    ? window.QUIZ_QUESTIONS_QUIZ
    : (Array.isArray(window.QUIZ_QUESTIONS) ? window.QUIZ_QUESTIONS : [])).concat(FREE_TRIAL_QUESTIONS);
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
    const raw = ALL_RAW_QUESTIONS.concat(Array.isArray(appSettings.customQuestions) ? appSettings.customQuestions : []);
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
  const user = localStorage.getItem(STORAGE_KEYS.user);
  // En mode essai, l'utilisateur doit voir tout le contenu disponible.
  // Le niveau "Essai gratuit" reste disponible uniquement pour lancer le sujet d'essai autorisé.
  if (isFreeTrialUser(user)) return ["Tous les niveaux", ...ALL_LEVELS, FREE_TRIAL_LEVEL];
  const userConfig = getCurrentUserConfig();

  if (!userConfig) return [];

  if (userConfig.levels === "all") {
    return ALL_LEVELS;
  }

  if (Array.isArray(userConfig.levels)) {
    if (userConfig.levels.some((lv) => normalizeKey(lv) === "all" || normalizeKey(lv) === "tous les niveaux")) {
      return ALL_LEVELS;
    }
    return normalizeAccountLevels(userConfig.levels).filter((lv) => ALL_LEVELS.includes(lv));
  }

  return [];
}


  const SUBJECTS_BY_LEVEL_RESTRICTED = {
  "A1-Base Santé": [
    "Sémiologie médical",
    "Anatomie physiologie",
    "Spécialités médicales et chirurgicales",
    "Pédiatrie",
    "Néonatalogie",
    "Diététique",
    "Santé publique et communautaire et psychologique",
    "Rédaction administrative",
    "Rédaction de rapports de stage",
    "Informatique",
    "Pathologies médicale et chirurgicale",
    "Radiologie",
    "Laboratoire et pharmacologie",
    "Hygiène et assainissement",
    "Biosecurité",
    "Éthique et déontologie",
    "Hygiène hospitalière",
    "Soins infirmiers de bases-accueil",
    "SOINS HUMANISES",
    "ergonomie",
    "Manutention",
    "Secourisme"
  ],
  "L1-Niveau Émergent": [
    "Pédiatrie",
    "Santé Publique",
    "Pathologies churigicale / Sémiologie",
    "Pathologies médicales / Sémiologie",
    "Anatomie physiologie appareils",
    "Anatomie physiologie obstétricale",
    "Soins aux enfants",
    "Diététique",
    "Bactériologie",
    "Parasitologie",
    "IST/VIH",
    "Maladies parasitaires et infectieuses",
    "Pathologies respiratoires",
    "Maladies non transmissibles",
    "Théorie et concepts des Soins Infirmiers / Obstétricaux / Relation d’aide",
    "Psycho-sociologie",
    "Anthropologie de la santé",
    "Secourisme",
    "Prévention des infections / Hygiène hospitalière",
    "Soins infirmiers obstétricaux / néonataux de base / infantiles",
    "Déontologie et éthique professionnelle",
    "Législation du travail",
    "Anglais de la santé",
    "Informatique",
    "Hygiène et assainissement",
    "Soins de santé primaire",
    "Epidémiologie",
    "Biochimie",
    "Immunologie",
    "Hématologie",
    "Droit administratif",
    "Droit civil"
  ],
  "L2-Niveau Ascendant": [
    "Chirugie pédiatrique/Pathologies chirurrgicales",
    "Initiation a la kinésitherapie",
    "Déontologie de la sage femme",
    "Santé de la reproduction planification familiale",
    "Gériatrie/Gérontologie",
    "Approche genre/santé sexuelle/santé de la reproduction des adolescents et des jeunes/gestion logistique",
    "Psychologie médicale",
    "Réanimation",
    "Soins obstetricaux et néonataux d'urgence",
    "Pharmacologie",
    "Soins infirmiers dans les pathologies médicales",
    "Techniques de soins infirmiers",
    "Gynécologie-obstétrique (SFM)",
    "Gynécologie-obstétrique (IDE)",
    "Consultation enfant sain",
    "Pédiatrie",
    "Santé Publique",
    "Pathologies churigicale / Sémiologie",
    "Pathologies médicales / Sémiologie",
    "Anglais de la santé"
  ],
  "L3-Niveau Accompli INF": [
    "Imagerie médicale",
    "Gestion des catastrophes",
    "Gouvernance et Organisation du Système de Santé Communautaire",
    "Organisation d’une séance de Vaccination / Sécurité des injections",
    "Oncologie",
    "Neuropsychiatrie",
    "Endocrinologie",
    "Hépato-gastro-entérologie",
    "Cardiologie",
    "Dermatologie",
    "Néphrologie",
    "Odonto-Stomatologie",
    "Ophtalmologie",
    "Neurochirurgie",
    "ORL",
    "Surveillances thérapeutiques",
    "Surveillance thérapeutique",
    "Droit administratif",
    "Élaboration d’un projet de soins infirmiers",
    "Mise en œuvre et évaluation d’un projet de soins infirmiers",
    "Soins infirmiers spécialisés en médecine",
    "Soins palliatifs",
    "Soins infirmiers spécialisés en chirurgie",
    "Rédaction administrative",
    "Supervision / Suivi – Evaluation",
    "Gestion Hospitalière",
    "Analyse des données quantitatives et qualitatives"
  ],
  "L3-Niveau Accompli SF": [
    "Pathologies gynécologiques III",
    "Pathologies obstétricales III",
    "Hygiène menstruelle",
    "Violences Basées sur Genre / Encadrement (Egalité - Equité)",
    "Santé sexuelle et reproductive des adolescents et des jeunes / Planification Familiale / IST / VIH-SIDA",
    "Imagerie médicale",
    "Gestion des catastrophes",
    "Gouvernance et Organisation du Système de Santé Communautaire",
    "Organisation d’une séance de Vaccination / Sécurité des injections",
    "Psychiatrie",
    "Pédiatrie (PCIMNE)",
    "Soins obstétricaux et néonataux d’urgence de base (SONUB)",
    "Soins obstétricaux et néonataux d’urgence complets (SONUC)",
    "Présentation de cas cliniques",
    "Stage en soins infirmiers et Obstétricaux",
    "Droit administratif / Responsabilité médicale",
    "Sécurité sociale",
    "Gestion Hospitalière / Rédaction Administrative",
    "Soins infirmiers obstétricaux et néonataux",
    "Consultation Postnatale (CPoN)",
    "Ventouse obstétricale",
    "Aspiration Manuelle Intra- Utérine (AMIU) / Soins Post Avortement",
    "Prise en charge des substances psychoactives",
    "Gériatrie",
    "Soins palliatifs",
    "Analyse des données qualitatives et quantitatives"
  ],
  "A2-Niveau moyen": [
    "Sémiologie médical",
    "Anatomie physiologie",
    "Spécialités médicales et chirurgicales",
    "Pédiatrie",
    "Néonatalogie",
    "Diététique",
    "Santé publique et communautaire et psychologique",
    "Rédaction administrative",
    "Rédaction de rapports de stage",
    "Informatique",
    "Pathologies médicale et chirurgicale",
    "Radiologie",
    "Laboratoire et pharmacologie",
    "Hygiène et assainissement",
    "Biosecurité",
    "Éthique et déontologie",
    "Hygiène hospitalière",
    "Soins infirmiers de bases-accueil",
    "SOINS HUMANISES",
    "ergonomie",
    "Manutention",
    "Secourisme"
  ]
};

  function getAllowedSubjectsForLevel(level) {
    const nLevel = normalizeKey(level);
    for (const [levelName, subjects] of Object.entries(SUBJECTS_BY_LEVEL_RESTRICTED)) {
      if (nLevel === normalizeKey(levelName) && Array.isArray(subjects)) {
        return subjects.map((s) => safeText(s).trim()).filter(Boolean);
      }
    }
    if (window.SUBJECTS_BY_LEVEL && typeof window.SUBJECTS_BY_LEVEL === "object") {
      for (const [levelName, subjects] of Object.entries(window.SUBJECTS_BY_LEVEL)) {
        if (nLevel === normalizeKey(levelName) && Array.isArray(subjects)) {
          return subjects.map((s) => safeText(s).trim()).filter(Boolean);
        }
      }
    }
    return [];
  }

  function computeSubjectsForLevel(level) {
    if (isFreeTrialUser() && normalizeKey(level) === normalizeKey(FREE_TRIAL_LEVEL)) return [FREE_TRIAL_SUBJECT];
    const unique = (arr) => Array.from(new Set((arr || []).map((s) => safeText(s).trim()).filter(Boolean)));

    // Affiche uniquement les matières autorisées pour le niveau sélectionné.
    const restrictedSubjects = getAllowedSubjectsForLevel(level);
    const subjectsFromQuestions = getQuestionBank()
      .filter((q) => !level || level === "Tous les niveaux" || levelMatches(q.level, level))
      .map((q) => q.subject);

    if (restrictedSubjects.length > 0) {
      return ["Toutes les matières", ...unique(restrictedSubjects.concat(subjectsFromQuestions))];
    }

    return ["Toutes les matières", ...unique(ALL_SUBJECTS.concat(subjectsFromQuestions))];
  }

  function computeTopicsForSubject(subject) {
    if (isFreeTrialUser() && normalizeKey(subject) === normalizeKey(FREE_TRIAL_SUBJECT)) return [FREE_TRIAL_TOPIC];
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

  const DE_TRACKS_ALL = [
    { value: "INF/SAG-M", label: "INF/SAG-M" },
    { value: "AUXI", label: "AUXI" },
  ];

  function getAllowedDETracks() {
    const user = localStorage.getItem(STORAGE_KEYS.user);
    const userConfig = getCurrentUserConfig();
    if (!userConfig) return [];

    if (userConfig.levels === "all") return DE_TRACKS_ALL.slice();
    if (!Array.isArray(userConfig.levels)) return [];

    const levels = normalizeAccountLevels(userConfig.levels).map((lv) => normalizeKey(lv));
    const tracks = [];

    // A2-Niveau moyen : accès uniquement aux sujets du niveau AUXI.
    if (levels.includes(normalizeKey("A2-Niveau moyen"))) {
      tracks.push({ value: "AUXI", label: "AUXI" });
    }

    // L3-Niveau Accompli SF / INF : accès uniquement aux sujets du niveau INF/SAG-M.
    if (levels.includes(normalizeKey("L3-Niveau Accompli SF")) || levels.includes(normalizeKey("L3-Niveau Accompli INF"))) {
      tracks.push({ value: "INF/SAG-M", label: "INF/SAG-M" });
    }

    const seen = new Set();
    return tracks.filter((track) => {
      if (seen.has(track.value)) return false;
      seen.add(track.value);
      return true;
    });
  }

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

  const LEVEL_ALIASES = {
    "a1-base sante": ["a1-base sante", "auxiliaire 1 annee"],
    "a2-niveau moyen": ["a2-niveau moyen", "auxiliaire 2 annee", "auxi 2 annee"],
    "l1-niveau emergent": ["l1-niveau emergent", "licence 1 ide/sfm", "licence 1 inf/sag-m"],
    "l2-niveau ascendant": ["l2-niveau ascendant", "licence 2 ide/sfm", "licence 2 inf/sag-m"],
    "l3-niveau accompli inf": ["l3-niveau accompli inf", "licence 3 ide", "licence 3 ide/sfm", "licence 3 inf/sag-m"],
    "l3-niveau accompli sf": ["l3-niveau accompli sf", "licence 3 sfm", "licence 3 ide/sfm", "licence 3 inf/sag-m"],
  };

  function levelMatches(questionLevel, selectedLevel) {
    const nSelected = normalizeKey(selectedLevel);
    const nQuestion = normalizeKey(questionLevel);
    const aliases = LEVEL_ALIASES[nSelected] || [nSelected];
    return aliases.includes(nQuestion);
  }

  function filterBank(bank, { level, subject, topic }) {
  let out = bank;

  if (level && level !== "Tous les niveaux") {
    out = out.filter(q => levelMatches(q.level, level));

    // Sécurité: même avec "Toutes les matières", on ne garde que les matières autorisées du niveau choisi.
    const allowedSubjects = getAllowedSubjectsForLevel(level).map((s) => normalizeKey(s));
    if (allowedSubjects.length > 0) {
      out = out.filter(q => allowedSubjects.includes(normalizeKey(q.subject)));
    }
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
    if (nTrack.includes("inf/sag-m")) {
      out = out.filter((q) => {
        const lv = normalizeKey(q.level);
        return lv.includes("inf/sag-m") || lv.includes("ide/sfm") || lv.includes("licence 3 ide") || lv.includes("licence 3 sfm") || lv.includes(normalizeKey("L3-Niveau Accompli INF")) || lv.includes(normalizeKey("L3-Niveau Accompli SF"));
      });
    }
    if (nTrack.includes("auxi")) {
      out = out.filter((q) => {
        const lv = normalizeKey(q.level);
        return lv.includes("auxi") || lv.includes("auxiliaire") || lv.includes(normalizeKey("A2-Niveau moyen"));
      });
    }

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

    const tracks = getAllowedDETracks();
    if (tracks.length === 0) {
      setOptionsObjects(els.selectDETrack, [{ value: "", label: "Aucun niveau autorisé" }], "");
      setOptionsObjects(els.selectDESubject, [{ value: "", label: "Aucune matière DE" }], "");
      setOptions(els.selectDETopic, ["Aucun sujet"], "Aucun sujet");
      updateDEStartInfo();
      return;
    }

    setOptionsObjects(els.selectDETrack, tracks, tracks[0].value);
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

  if (isFreeTrialUser() && nextMode !== "normal") {
    alert(FREE_TRIAL_BLOCK_MESSAGE);
    return;
  }

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
    if (shuffleQuestions !== false) shuffleInPlace(pool);
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
    choiceOrderById: {},
    index: 0,
    abandoned: false,
  };

  function updateStartInfo() {
    bank = getQuestionBank();
    const levels = computeLevels();
    if (isFreeTrialUser() && !levels.includes(session.level)) {
      // Ne plus forcer l'utilisateur d'essai sur le sujet d'essai.
      // Il doit voir l'aperçu général des niveaux, matières et sujets.
      session.level = "Tous les niveaux";
      session.subject = "Toutes les matières";
      session.topic = "Tous les sujets";
    }
    setOptions(els.selectLevel, levels, session.level);
if (!levels.includes(session.level)) {
  session.level = levels[0];
  els.selectLevel.value = session.level;
}
    const subjects = computeSubjectsForLevel(els.selectLevel.value);
    const desiredSubject = subjects.includes(session.subject)
      ? session.subject
      : "Toutes les matières";
    setOptions(els.selectSubject, subjects, desiredSubject);
    session.subject = els.selectSubject.value;

    const topics = computeTopicsForSubject(els.selectSubject.value);
    const desiredTopic = topics.includes(session.topic)
      ? session.topic
      : "Tous les sujets";
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

  function getChoiceOrder(q) {
    const len = Array.isArray(q?.choices) ? q.choices.length : 0;
    const normal = Array.from({ length: len }, (_, i) => i);
    if (!appSettings.shuffleAnswers || len < 2) return normal;
    session.choiceOrderById = session.choiceOrderById || {};
    if (!Array.isArray(session.choiceOrderById[q.id]) || session.choiceOrderById[q.id].length !== len) {
      session.choiceOrderById[q.id] = shuffleInPlace(normal.slice());
    }
    return session.choiceOrderById[q.id];
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

    // Les boutons Suivant et Terminer sont visibles uniquement dans l'écran du quiz.
    if (els.btnNext) {
      els.btnNext.classList.remove("hidden");
      els.btnNext.disabled = session.index >= total - 1;
      els.btnNext.title = session.index >= total - 1 ? "Dernière question" : "Passer à la question suivante";
    }
    if (els.btnSkip) els.btnSkip.classList.add("hidden");
    if (els.btnFinish) {
      els.btnFinish.classList.remove("hidden");
      els.btnFinish.disabled = false;
    }

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
          renderQuiz();
          if (shouldAutoAdvance()) advanceAfterAnswerSoon();
        });
        els.answers.appendChild(item);
      }
      return;
    }

    if (q.type === "mcq_multi") {
      const requiredCount = getRequiredAnswerCount(q);
      const instruction = document.createElement("div");
      instruction.className = "pill";
      instruction.style.margin = "0 0 12px 0";
      instruction.textContent = `Nombre de propositions justes à cocher : ${requiredCount}`;
      els.answers.appendChild(instruction);

      const selected = normalizeSelectedIndices(currentAnswer.selectedIndices, q.choices.length);
      for (const idx of getChoiceOrder(q)) {
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
          const next = new Set(normalizeSelectedIndices(session.answersById[q.id]?.selectedIndices, q.choices.length));
          if (next.has(idx)) next.delete(idx);
          else next.add(idx);
          const nextSelected = Array.from(next).sort((a, b) => a - b);
          session.answersById[q.id] = { selectedIndices: nextSelected };
          renderQuiz();
          if (nextSelected.length >= requiredCount && shouldAutoAdvance()) {
            advanceAfterAnswerSoon();
          }
        });
        els.answers.appendChild(item);
      }
      return;
    }

    for (const idx of getChoiceOrder(q)) {
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
        renderQuiz();
        if (shouldAutoAdvance()) advanceAfterAnswerSoon();
      });
      els.answers.appendChild(item);
    }
  }

  function formatNoteSur20(note) {
    if (!Number.isFinite(note)) return "0";
    const rounded = Math.round(note * 100) / 100;
    const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    return text.replace(".", ",");
  }

  function getQuestionBasePoint(q) {
    // Permet d'utiliser une note/pondération personnalisée si elle existe dans une question.
    // Exemples acceptés : note, points, point, bareme, barème, mark, coefficient, coef.
    const values = [q?.note, q?.points, q?.point, q?.bareme, q?.["barème"], q?.mark, q?.coefficient, q?.coef];
    for (const value of values) {
      const n = Number(value);
      if (Number.isFinite(n) && n > 0) return n;
    }
    return 1;
  }

  function getQuestionMarksOn20(questions) {
    const list = Array.isArray(questions) ? questions : [];
    const basePoints = list.map(getQuestionBasePoint);
    const totalBase = basePoints.reduce((sum, n) => sum + n, 0);
    if (!list.length || totalBase <= 0) return new Map();
    const marks = new Map();
    list.forEach((q, index) => {
      marks.set(q.id, (basePoints[index] / totalBase) * 20);
    });
    return marks;
  }

  function getNoteSur20(result) {
    if (Number.isFinite(result?.note20)) return result.note20;
    const total = result?.total || 0;
    if (total === 0) return 0;
    return ((result.score || 0) / total) * 20;
  }

  function formatResultSummary(result) {
    const { correct, answered, total, score } = result;
    const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
    const note20 = formatNoteSur20(getNoteSur20(result));
    return `${correct}/${total} correct • ${pct}% • Score: ${score} • répondu: ${answered}/${total} • Note sur 20: ${note20}/20`;
  }

  function computeScore() {
    const total = session.questions.length;
    const marksById = getQuestionMarksOn20(session.questions);

    if (session.abandoned) {
      return { correct: 0, wrong: 0, answered: 0, total, score: 0, note20: 0, marksById: {} };
    }

    let correct = 0;
    let answered = 0;
    let wrong = 0;
    let score = 0;
    let note20 = 0;
    const marksResultById = {};

    for (const q of session.questions) {
      const a = session.answersById[q.id];
      const questionMark = marksById.get(q.id) || 0;
      let markObtained = 0;

      if (isAnswered(q, a)) {
        answered++;

        if (isCorrect(q, a)) {
          correct++;
          score += 1;
          markObtained = questionMark;
        } else {
          wrong++;
          if (appSettings.negativePoints) {
            score -= 1;
            markObtained = -questionMark;
          } else {
            markObtained = 0;
          }
        }
      }

      note20 += markObtained;
      marksResultById[q.id] = {
        questionMark,
        obtained: markObtained
      };
    }

    // La note sur 20 applique directement la pondération et les pénalités de chaque question.
    // Exemple : 5 questions => 4 points/question ; score -1 => -4/20.
    return { correct, wrong, answered, total, score, note20, marksById: marksResultById };
  }

function renderResult() {
    const result = computeScore();
    const { correct, answered, total, score } = result;
    const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
    const note20 = formatNoteSur20(getNoteSur20(result));
    els.scoreText.textContent = appSettings.finalScore === false ? "Quiz soumis avec succès. La note finale est masquée par l’administrateur." : formatResultSummary(result);
    const user = localStorage.getItem(STORAGE_KEYS.user);
    logActivity(user, 'finish_quiz', { correct, answered, total, percentage: pct, score, note20 });
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
    const result = computeScore();

const head = document.createElement("div");
head.className = "pill";
head.style.marginBottom = "12px";
head.textContent = appSettings.finalScore === false ? "Correction du quiz — note masquée par l’administrateur." : formatResultSummary(result);
els.reviewList.appendChild(head);

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
      const markInfo = result.marksById && result.marksById[q.id] ? result.marksById[q.id] : null;
      const tag3 = document.createElement("span");
      tag3.className = `tag ${markInfo && markInfo.obtained > 0 ? "tag--ok" : markInfo && markInfo.obtained < 0 ? "tag--bad" : ""}`;
      tag3.textContent = `Note question: ${markInfo && markInfo.obtained > 0 ? "+" : ""}${formatNoteSur20(markInfo ? markInfo.obtained : 0)}/20`;
      meta.appendChild(tag3);

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
    if (isFreeTrialUser()) {
      if (currentMode !== "normal" || els.selectLevel.value !== FREE_TRIAL_LEVEL || els.selectSubject.value !== FREE_TRIAL_SUBJECT || els.selectTopic.value !== FREE_TRIAL_TOPIC) {
        alert(FREE_TRIAL_BLOCK_MESSAGE);
        return;
      }
    }

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
      const picked = pickQuestions(filtered, appSettings.shuffleQuestions);

      lastTimedQuestionIndex = -1;
      session = {
        startedAt: Date.now(),
        level: track,
        subject,
        topic,
        questions: picked,
        answersById: {},
        choiceOrderById: {},
        index: 0,
        abandoned: false,
      };

      const user = localStorage.getItem(STORAGE_KEYS.user);
      logActivity(user, "start_quiz", { level: track, subject, topic, questionCount: picked.length });

      showScreen(els.screenQuiz);
      renderQuiz();
      return;
    }

    const level = els.selectLevel.value;
    const subject = els.selectSubject.value;
    const topic = els.selectTopic?.value || "Tous les sujets";
    const filtered = filterBank(bank, { level, subject, topic });
    const picked = isFreeTrialUser() ? filtered.slice(0, appSettings.freeTrialQuestions || 15) : pickQuestions(filtered, appSettings.shuffleQuestions);

    lastTimedQuestionIndex = -1;
    session = {
      startedAt: Date.now(),
      level,
      subject,
      topic,
      questions: picked,
      answersById: {},
      choiceOrderById: {},
      index: 0,
      abandoned: false,
    };

    const user = localStorage.getItem(STORAGE_KEYS.user);
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
      renderQuiz();
      return;
    }
    session.index++;
    renderQuiz();
  }

  function goPrev() {
    if (session.index <= 0) {
      session.index = 0;
      renderQuiz();
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

  function restartCurrentQuizWithNewOrder() {
    if (!Array.isArray(session.questions) || session.questions.length === 0) return;
    const oldOrder = session.questions.map((q) => q.id).join("|");
    const nextQuestions = session.questions.slice();
    shuffleInPlace(nextQuestions);
    if (nextQuestions.length > 1 && nextQuestions.map((q) => q.id).join("|") === oldOrder) {
      nextQuestions.push(nextQuestions.shift());
    }
    clearQuestionTimer();
    lastTimedQuestionIndex = -1;
    session = {
      ...session,
      startedAt: Date.now(),
      questions: nextQuestions,
      answersById: {},
      choiceOrderById: {},
      index: 0,
      abandoned: false,
    };
    renderQuiz();
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
      if (isFreeTrialUser() && (els.selectLevel.value !== FREE_TRIAL_LEVEL || els.selectSubject.value !== FREE_TRIAL_SUBJECT || els.selectTopic.value !== FREE_TRIAL_TOPIC)) {
        alert(FREE_TRIAL_BLOCK_MESSAGE);
      }
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

  if (els.btnNext) els.btnNext.addEventListener("click", goNext);
  if (els.btnSkip) els.btnSkip.addEventListener("click", goPrev);
  if (els.btnFinish) els.btnFinish.addEventListener("click", finishQuiz);

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

  function goHome() {
    showScreen(els.screenStart);
    if (currentMode === "normal") updateStartInfo();
    else updateDEStartInfo();
  }

  if (els.btnHome) {
    els.btnHome.addEventListener("click", goHome);
  }

  if (els.btnAdmin) {
    els.btnAdmin.addEventListener("click", async () => {
      showScreen(els.screenAdmin);
      await renderAdminLogs({ silent: true });
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
      if (isFreeTrialUser()) {
        alert(FREE_TRIAL_BLOCK_MESSAGE);
        return;
      }
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

  if (els.btnOpenSettings) {
    els.btnOpenSettings.addEventListener("click", () => {
      els.inputStudentName.value = settings.studentName;
      // Mélange forcé: garder le toggle en "on" et empêcher de le désactiver.
      els.toggleShuffle.checked = true;
      els.toggleShuffle.disabled = true;
      els.settingsDialog.showModal();
    });
  }
  els.btnSaveSettings.addEventListener("click", () => {
    settings = {
      studentName: safeText(els.inputStudentName.value).slice(0, 40),
      shuffleQuestions: true,
    };
    saveSettings(settings);
  });

  if (els.btnReset) {
    els.btnReset.addEventListener("click", () => {
      if (els.screenQuiz && els.screenQuiz.classList.contains("hidden")) return;
      restartCurrentQuizWithNewOrder();
    });
  }

  if (els.btnFreeTrial) {
    els.btnFreeTrial.addEventListener("click", async () => {
      localStorage.setItem(STORAGE_KEYS.user, FREE_TRIAL_USER);
      // Afficher d'abord l'aperçu complet du site en mode essai.
      // Le visiteur ne pourra démarrer que le sujet "Essai gratuit".
      session.level = "Tous les niveaux";
      session.subject = "Toutes les matières";
      session.topic = "Tous les sujets";
      localStorage.setItem(STORAGE_KEYS.sessionToken, getSessionToken());
      const ok = await grantAccess(FREE_TRIAL_USER);
      if (!ok) return;
      setMode("normal");
      updateStartInfo();
      setupDESelectors();
      showScreen(els.screenStart);
    });
  }

  if (els.formCode) {
    els.formCode.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = (els.inputUsername?.value || "").trim();
      if (!username) {
        const msg = "Veuillez entrer votre nom d’utilisateur avant de vous connecter.";
        if (els.codeError) {
          els.codeError.textContent = msg;
          els.codeError.style.display = "block";
        }
        alert(msg);
        els.inputUsername?.focus();
        return;
      }
      const ok = await grantAccess(username);
      if (!ok) return;
      els.inputStudentName.value = settings.studentName;
      els.toggleShuffle.checked = settings.shuffleQuestions;
      updateStartInfo();
      setupDESelectors();
      showScreen(els.screenStart);
    });
  }

  if (els.btnLogout) {
    els.btnLogout.addEventListener("click", () => {
      denyAccess();
    });
  }

  // Important : on ne libère plus la session lors d'une actualisation ou fermeture d'onglet.
  // Le compte reste connecté sur le même appareil jusqu'au clic explicite sur "Se déconnecter".


  document.addEventListener('copy', (event) => {
    if (appSettings.antiCopyPaste) event.preventDefault();
  });
  document.addEventListener('paste', (event) => {
    if (appSettings.antiCopyPaste && els.screenQuiz && !els.screenQuiz.classList.contains('hidden')) event.preventDefault();
  });
  document.addEventListener('visibilitychange', () => {
    if (appSettings.antiTabChange && document.hidden && els.screenQuiz && !els.screenQuiz.classList.contains('hidden')) {
      session.cheatWarning = { at: Date.now(), reason: 'Changement d’onglet ou réduction de la page' };
    }
  });

  // init
  (async () => {
    await loadAppSettingsFromServer();
    settings = loadSettings();
    bank = getQuestionBank();
    if (await isAccessGranted()) {
      const user = localStorage.getItem(STORAGE_KEYS.user);
      await grantAccess(user);
      els.inputStudentName.value = settings.studentName;
      els.toggleShuffle.checked = settings.shuffleQuestions;
      updateStartInfo();
      setupDESelectors();
      showScreen(els.screenStart);
    } else {
      denyAccess(false);
    }
  })();
})();

