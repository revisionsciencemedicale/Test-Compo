/* global window */
/**
 * ============================================================
 * QUESTIONS - EXAMEN DE FIN DE FORMATION
 * ============================================================
 *
 * Toutes les matières et questions de l'Examen de Fin de Formation
 * sont maintenant regroupées dans ce fichier.
 *
 * Tu peux ajouter manuellement de nouvelles questions dans le bloc
 * MANUAL_EFF_QUESTIONS plus bas.
 *
 * Niveaux acceptés pour l'Examen de Fin de Formation :
 * - level: "INF/SAG-M"
 * - level: "AUXI"
 *
 * IMPORTANT : l'export vers window.QUIZ_QUESTIONS_DE est exécuté
 * à la fin du fichier, après tous les ajouts.
 */

/* global window */
/**
 * Questions "Examen de Fin de Formation" (EFF)
 *
 * Ce fichier est séparé de `questions.js` (Quiz) pour faciliter l'ajout de questions.
 * Ajoute tes questions ici (ou utilise les générateurs ci-dessous).
 *
 * Convention:
 * - level: "Licence X INF/SAG-M" ou "AUXI X année"
 * - subject: "Pédiatrie" | "Santé Publique" | "Médecine" | "Chirurgie" | "Planning Famillial" | "Gynécologie"
 * - topic: "Sujet 1" ... "Sujet 9"
 */

(function initEFFBank() {
  if (!Array.isArray(window.QUIZ_QUESTIONS_EFF)) window.QUIZ_QUESTIONS_EFF = [];
})();

// ============================================================
// QUESTIONS AUTOMATIQUES SUPPRIMÉES
// ============================================================
// Les anciens générateurs automatiques de l’Examen de Fin de Formation
// ont été retirés. Ce fichier ne doit charger que les questions ajoutées
// manuellement dans les blocs ci-dessous ou via l’administration du site.

// AJOUT MANUEL (EXEMPLE) : Médecine - Sujet 7
// (tu peux dupliquer ce bloc et changer subject/topic/id/questions)
// ============================================================
(function () {
  const bank = window.QUIZ_QUESTIONS_EFF;
  if (!Array.isArray(bank)) return;

  // Anti-duplication si tu recharges la page
  if (bank.some((q) => q && typeof q === "object" && String(q.id || "").startsWith("eff-med-s7-"))) return;

  bank.push({
    id: "eff-med-s7-001",
    level: "L3-Niveau Accompli SF",
    subject: "Médecine",
    topic: "Sujet 7",
    type: "mcq",
    question: "Quel signe peut orienter vers une déshydratation ?",
    choices: ["Soif + muqueuses sèches", "Vision parfaite", "Peau toujours froide", "Sommeil normal"],
    answerIndex: 0,
    explanation: "La soif et la sécheresse des muqueuses sont des signes fréquents (selon contexte).",
  });

  bank.push({
    id: "eff-med-s7-002",
    level: "A2-Niveau moyen",
    subject: "Médecine",
    topic: "Sujet 7",
    type: "tf",
    question: "Une hypoglycémie peut être une urgence.",
    answer: true,
    explanation: "Une hypoglycémie sévère peut nécessiter une prise en charge rapide.",
  });
})();

// ============================================================
// AJOUTS MANUELS - EXAMEN DE FIN DE FORMATION
// Ajoute tes nouvelles questions dans MANUAL_EFF_QUESTIONS.
// ============================================================
(function chargerQuestionsManuellesExamenFinFormation() {
  if (!Array.isArray(window.QUIZ_QUESTIONS_EFF)) {
    window.QUIZ_QUESTIONS_EFF = [];
  }

  const MANUAL_EFF_QUESTIONS = [
    // ========================================================
    // AJOUTE TES QUESTIONS ICI, AVANT LA LIGNE ];
    // ========================================================

    // Exemple 1 : QCM simple pour INF/SAG-M
    {
      id: "eff-manuel-inf-pathologies-paludisme-001",
      level: "INF/SAG-M",
      subject: "Pathologies",
      topic: "Paludisme",
      type: "mcq",
      question: "Quel est le signe le plus évocateur du paludisme simple ?",
      choices: [
        "Fièvre",
        "Fracture",
        "Brûlure",
        "Otorragie"
      ],
      answerIndex: 0,
      explanation: "La fièvre est un signe fréquent et évocateur du paludisme."
    },

    // Exemple 2 : même question pour AUXI
    {
      id: "eff-manuel-auxi-pathologies-paludisme-001",
      level: "AUXI",
      subject: "Pathologies",
      topic: "Paludisme",
      type: "mcq",
      question: "Quel est le signe le plus évocateur du paludisme simple ?",
      choices: [
        "Fièvre",
        "Fracture",
        "Brûlure",
        "Otorragie"
      ],
      answerIndex: 0,
      explanation: "La fièvre est un signe fréquent et évocateur du paludisme."
    },

    // Exemple 3 : QCM multiple
    {
      id: "eff-manuel-inf-pathologies-paludisme-002",
      level: "INF/SAG-M",
      subject: "Pathologies",
      topic: "Paludisme",
      type: "mcq_multi",
      question: "Quels sont des signes possibles du paludisme ?",
      choices: [
        "Fièvre",
        "Frissons",
        "Céphalées",
        "Fracture ouverte"
      ],
      answerIndices: [0, 1, 2],
      explanation: "Le paludisme peut donner fièvre, frissons et céphalées."
    },

    // Exemple 4 : Vrai/Faux
    {
      id: "eff-manuel-inf-pathologies-paludisme-003",
      level: "INF/SAG-M",
      subject: "Médecine",
      topic: "sujet 1",
      type: "tf",
      question: "Le paludisme peut se manifester par une fièvre.",
      answer: true,
      explanation: "La fièvre est un signe fréquent du paludisme."
    }
  ];

  const idsDejaPresents = new Set(
    window.QUIZ_QUESTIONS_EFF
      .filter((q) => q && typeof q === "object" && q.id)
      .map((q) => String(q.id))
  );

  function normaliserQuestionEFF(q) {
    if (!q || typeof q !== "object") return null;
    const base = {
      id: String(q.id || ""),
      level: String(q.level || ""),
      subject: String(q.subject || ""),
      topic: String(q.topic || ""),
      type: String(q.type || ""),
      question: String(q.question || ""),
      explanation: String(q.explanation || ""),
    };

    if (base.type === "tf") {
      return { ...base, answer: Boolean(q.answer) };
    }

    if (base.type === "mcq_multi") {
      const indices = Array.isArray(q.answerIndices)
        ? q.answerIndices
        : (Array.isArray(q.answerIndexes) ? q.answerIndexes : []);
      return {
        ...base,
        choices: Array.isArray(q.choices) ? q.choices.map((choice) => String(choice)) : [],
        answerIndices: indices.map((idx) => Number(idx)).filter((idx) => Number.isInteger(idx)),
      };
    }

    if (base.type === "mcq") {
      return {
        ...base,
        choices: Array.isArray(q.choices) ? q.choices.map((choice) => String(choice)) : [],
        answerIndex: Number.isInteger(Number(q.answerIndex)) ? Number(q.answerIndex) : 0,
      };
    }

    return null;
  }

  MANUAL_EFF_QUESTIONS.forEach((item) => {
    const q = normaliserQuestionEFF(item);
    if (!q || !q.id) return;
    if (idsDejaPresents.has(String(q.id))) return;
    window.QUIZ_QUESTIONS_EFF.push(q);
    idsDejaPresents.add(String(q.id));
  });
})();

// Correction 20-05-2026 : suppression uniquement des doublons de questions EFF
// pour INF/SAG-M et AUXI, y compris leurs niveaux sources L3-Niveau Accompli SF et A2-Niveau moyen.
// Le premier exemplaire est conservé, les répétitions identiques sont retirées.
(function supprimerDoublonsQuestionsEFFCibles() {
  if (!Array.isArray(window.QUIZ_QUESTIONS_EFF)) return;
  const niveauxCibles = new Set([
    "INF/SAG-M",
    "AUXI",
    "L3-Niveau Accompli SF",
    "A2-Niveau moyen",
  ]);
  function normaliserNiveau(level) {
    const value = String(level || "");
    if (/^Licence\s+\d+\s+INF\/SAG-M$/i.test(value)) return "INF/SAG-M";
    if (/^AUXI\s+\d+\s+ann[ée]e$/i.test(value)) return "AUXI";
    return value;
  }
  function normaliserTexte(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }
  const vus = new Set();
  window.QUIZ_QUESTIONS_EFF = window.QUIZ_QUESTIONS_EFF.filter(function (q) {
    if (!q || typeof q !== "object") return true;
    const niveau = normaliserNiveau(q.level);
    if (!niveauxCibles.has(niveau)) return true;
    const cle = niveau + "|" + normaliserTexte(q.question);
    if (vus.has(cle)) return false;
    vus.add(cle);
    return true;
  });
})();

// ============================================================
// Export EFF -> Banque utilisée par l'app (QUIZ_QUESTIONS_DE)
// IMPORTANT: doit être exécuté EN DERNIER (après tous les ajouts)
// ============================================================
(function () {
  function safeText(s) {
    return String(s ?? "");
  }

  function normalizeKey(s) {
    return safeText(s)
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function mapSubjectToDE(subject) {
    // Correction EFF 31/05/2026 : ne plus regrouper les matières spécifiques
    // dans les grandes catégories Médecine/Chirurgie/Pédiatrie. Le bouton
    // « Examen de Fin de Formation » doit afficher et filtrer les matières
    // telles qu'elles sont déclarées dans les listes spécifiques.
    return safeText(subject).trim();
  }

  function mapLevelToDE(level) {
    const raw = safeText(level).trim();
    const n = normalizeKey(raw);

    // Les comptes L3 / anciens libellés IDE-SFM sont affichés et modifiés
    // dans l'administration sous le niveau unique INF/SAG-M.
    if (
      n.includes("inf/sag-m") ||
      n.includes("ide/sfm") ||
      n.includes("licence 3") ||
      n.includes("l3-niveau accompli")
    ) {
      return "INF/SAG-M";
    }

    // Les comptes A2 / anciens libellés Auxiliaire sont affichés et modifiés
    // dans l'administration sous le niveau unique AUXI.
    if (
      n.includes("auxi") ||
      n.includes("auxiliaire") ||
      n.includes("a2-niveau moyen")
    ) {
      return "AUXI";
    }

    return "";
  }

  function isAllowedLevel(level) {
    return Boolean(mapLevelToDE(level));
  }

  function isAllowedTopic(topic) {
    // Accepte les anciens sujets "Sujet 1" à "Sujet 9"
    // et accepte aussi les sujets ajoutés manuellement
    // comme "Paludisme", "Diabète", etc.
    return safeText(topic).trim().length > 0;
  }

  const src = Array.isArray(window.QUIZ_QUESTIONS_EFF) ? window.QUIZ_QUESTIONS_EFF : [];

  window.QUIZ_QUESTIONS_DE = src
    .filter((q) => {
      if (!q || typeof q !== "object") return false;
      return isAllowedLevel(q.level) && isAllowedTopic(q.topic);
    })
    .map((q) => {
      const mappedSubject = mapSubjectToDE(q.subject);
      const mappedLevel = mapLevelToDE(q.level);
      if (!mappedSubject || !mappedLevel) return null;
      return { ...q, level: mappedLevel, subject: mappedSubject };
    })
    .filter(Boolean);
})();
