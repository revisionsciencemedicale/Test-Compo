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
// Générateur: Planning Famillial + Gynécologie
// Sujets 1..3, 60 questions par sujet, niveaux INF/SAG-M + AUXI
// ============================================================
(function () {
  const bank = window.QUIZ_QUESTIONS_EFF;
  if (!Array.isArray(bank)) return;

  // Anti-duplication si le fichier est chargé plusieurs fois
  if (bank.some((q) => q && typeof q === "object" && String(q.id || "").startsWith("eff-"))) return;

  const LEVELS = ["Licence 3 INF/SAG-M", "AUXI 2 année"];
  const SUBJECTS = [
    { key: "pf", label: "Planning Famillial" },
    { key: "gy", label: "Gynécologie" },
  ];
  // Sujets demandés:
  // - Sujet 1..3: existant (60 questions / sujet)
  // - À partir du Sujet 4: 100 questions / sujet
  const TOPICS_WITH_COUNT = [
    { topic: "Sujet 1", count: 60 },
    { topic: "Sujet 2", count: 60 },
    { topic: "Sujet 3", count: 60 },
    { topic: "Sujet 4", count: 100 },
    { topic: "Sujet 5", count: 100 },
    { topic: "Sujet 6", count: 100 },
    { topic: "Sujet 7", count: 100 },
    { topic: "Sujet 8", count: 100 },
    { topic: "Sujet 9", count: 100 },
  ];

  function mkMcq({ id, level, subject, topic, question, choices, answerIndex, explanation }) {
    return { id, level, subject, topic, type: "mcq", question, choices, answerIndex, explanation };
  }
  function mkTf({ id, level, subject, topic, question, answer, explanation }) {
    return { id, level, subject, topic, type: "tf", question, answer, explanation };
  }

  function clampIdx(n, len) {
    const x = n % len;
    return x < 0 ? x + len : x;
  }

  function addBatch(subjectKey, subjectLabel, topic, countPerTopic) {
    for (let i = 1; i <= countPerTopic; i++) {
      const level = LEVELS[(i - 1) % LEVELS.length];
      const idBase = `eff-${subjectKey}-${topic.replace(/\s+/g, "").toLowerCase()}-${String(i).padStart(2, "0")}`;

      // Alterne TF / QCM pour varier
      if (i % 2 === 1) {
        const statement =
          subjectKey === "pf"
            ? [
                "Le consentement éclairé est indispensable avant de débuter une méthode contraceptive.",
                "L’efficacité d’une méthode contraceptive dépend aussi de la bonne observance.",
                "La contraception d’urgence est plus efficace lorsqu’elle est prise tôt.",
                "Le préservatif protège aussi contre les IST.",
                "Une éducation sexuelle adaptée réduit les grossesses non désirées.",
              ]
            : [
                "Les leucorrhées peuvent être physiologiques ou pathologiques selon le contexte.",
                "Le dépistage du cancer du col de l’utérus améliore le pronostic.",
                "Une douleur pelvienne aiguë peut relever d’une urgence.",
                "Le suivi prénatal permet de dépister des complications.",
                "L’hygiène intime excessive peut déséquilibrer la flore vaginale.",
              ];

        const idx = clampIdx(i, statement.length);
        const answer = i % 4 !== 3; // quelques faux pour éviter 100% vrai
        bank.push(
          mkTf({
            id: idBase,
            level,
            subject: subjectLabel,
            topic,
            question: statement[idx],
            answer,
            explanation:
              subjectKey === "pf"
                ? "Vérifie l’information, le consentement, et l’adaptation au profil (âge, contexte, risques)."
                : "Toujours interpréter selon le contexte clinique, les signes associés et l’examen.",
          })
        );
      } else {
        const q =
          subjectKey === "pf"
            ? [
                {
                  question: "Quel objectif principal vise la planification familiale ?",
                  choices: [
                    "Espacer et planifier les naissances selon le choix du couple",
                    "Supprimer le suivi prénatal",
                    "Remplacer les consultations médicales",
                    "Éviter toute information sur la sexualité",
                  ],
                  answerIndex: 0,
                  explanation: "La planification familiale aide à choisir le moment et l’espacement des naissances.",
                },
                {
                  question: "Quel moyen est une méthode barrière ?",
                  choices: ["Préservatif", "Pilule", "DIU", "Implant"],
                  answerIndex: 0,
                  explanation: "Le préservatif est une méthode barrière et protège aussi des IST.",
                },
                {
                  question: "Quel élément est essentiel lors du conseil contraceptif ?",
                  choices: [
                    "Informer sur efficacité/effets secondaires",
                    "Imposer une méthode",
                    "Éviter les questions",
                    "Ne parler que du coût",
                  ],
                  answerIndex: 0,
                  explanation: "Le conseil doit être personnalisé et basé sur l’information claire.",
                },
                {
                  question: "Lequel est un signe d’alerte à orienter/évaluer rapidement sous contraception ?",
                  choices: ["Douleur thoracique brutale", "Sommeil normal", "Bonne humeur", "Appétit conservé"],
                  answerIndex: 0,
                  explanation: "Une douleur thoracique brutale peut évoquer un problème grave (selon contexte).",
                },
                {
                  question: "La contraception d’urgence est surtout indiquée après :",
                  choices: ["Rapport non protégé/échec de méthode", "Vaccination", "Repas copieux", "Sport"],
                  answerIndex: 0,
                  explanation: "Elle s’utilise après un risque de grossesse non désirée.",
                },
              ]
            : [
                {
                  question: "Quel examen est utilisé pour le dépistage du cancer du col ?",
                  choices: ["Frottis cervico-utérin", "Radiographie", "ECG", "Glycémie"],
                  answerIndex: 0,
                  explanation: "Le dépistage repose sur le frottis/HPV selon protocoles.",
                },
                {
                  question: "Une douleur pelvienne aiguë associée à malaise doit faire penser à :",
                  choices: ["Urgence gynécologique possible", "Simple fatigue toujours", "Aucun risque", "Signe normal"],
                  answerIndex: 0,
                  explanation: "Toujours évaluer rapidement une douleur aiguë avec signes de gravité.",
                },
                {
                  question: "Quel conseil d’hygiène intime est le plus adapté ?",
                  choices: ["Toilette douce, éviter excès", "Douches vaginales fréquentes", "Produits agressifs", "Antibiotiques systématiques"],
                  answerIndex: 0,
                  explanation: "L’excès de nettoyage peut perturber la flore et favoriser infections.",
                },
                {
                  question: "Quel signe peut orienter vers une infection génitale ?",
                  choices: ["Leucorrhées malodorantes + prurit", "Vision parfaite", "Cheveux longs", "Ongles courts"],
                  answerIndex: 0,
                  explanation: "Associer symptômes, examen, et tests si disponibles.",
                },
                {
                  question: "Le suivi prénatal vise notamment à :",
                  choices: ["Détecter précocement les complications", "Éviter toute consultation", "Remplacer l’accouchement", "Supprimer les examens"],
                  answerIndex: 0,
                  explanation: "Il permet dépistage, prévention et éducation sanitaire.",
                },
              ];

        const idx = clampIdx(i, q.length);
        const item = q[idx];
        bank.push(
          mkMcq({
            id: idBase,
            level,
            subject: subjectLabel,
            topic,
            question: item.question,
            choices: item.choices,
            answerIndex: item.answerIndex,
            explanation: item.explanation,
          })
        );
      }
    }
  }

  for (const s of SUBJECTS) {
    for (const x of TOPICS_WITH_COUNT) addBatch(s.key, s.label, x.topic, x.count);
  }
})();

// ============================================================
// Générateur: Pédiatrie
// 100 questions / sujet à partir du Sujet 6 (S6..S9)
// ============================================================
(function () {
  const bank = window.QUIZ_QUESTIONS_EFF;
  if (!Array.isArray(bank)) return;

  if (bank.some((q) => q && typeof q === "object" && String(q.id || "").startsWith("eff-ped-"))) return;

  const SUBJECT = "Pédiatrie";
  const LEVELS = ["Licence 3 INF/SAG-M", "AUXI 2 année"];
  const TOPICS_WITH_COUNT = [
    { topic: "Sujet 1", count: 60 },
    { topic: "Sujet 2", count: 60 },
    { topic: "Sujet 3", count: 60 },
    { topic: "Sujet 4", count: 60 },
    { topic: "Sujet 5", count: 60 },
    { topic: "Sujet 6", count: 100 },
    { topic: "Sujet 7", count: 100 },
    { topic: "Sujet 8", count: 100 },
    { topic: "Sujet 9", count: 100 },
  ];

  function mkMcq({ id, level, topic, question, choices, answerIndex, explanation }) {
    return { id, level, subject: SUBJECT, topic, type: "mcq", question, choices, answerIndex, explanation };
  }
  function mkTf({ id, level, topic, question, answer, explanation }) {
    return { id, level, subject: SUBJECT, topic, type: "tf", question, answer, explanation };
  }
  function clampIdx(n, len) {
    const x = n % len;
    return x < 0 ? x + len : x;
  }

  const TF_BANK = [
    "La fièvre chez le nourrisson doit être évaluée rapidement selon le contexte.",
    "La déshydratation chez l’enfant peut évoluer rapidement.",
    "Le lavage des mains réduit le risque d’infections chez l’enfant.",
    "Une détresse respiratoire chez l’enfant nécessite une évaluation urgente.",
    "La vaccination est un moyen de prévention efficace.",
    "La diarrhée aiguë peut entraîner une déshydratation.",
    "La surveillance du poids et de la croissance est importante en pédiatrie.",
    "Un enfant somnolent ou prostré peut présenter un signe de gravité.",
    "Une bonne hydratation est essentielle en cas de fièvre (selon avis/protocole).",
    "Les signes de lutte respiratoire sont des indicateurs de gravité.",
  ];

  const MCQ_BANK = [
    {
      question: "Quel signe peut orienter vers une déshydratation chez l’enfant ?",
      choices: ["Muqueuses sèches + soif", "Vision parfaite", "Appétit augmenté", "Sommeil normal"],
      answerIndex: 0,
      explanation: "La sécheresse des muqueuses et la soif orientent vers une déshydratation (selon contexte).",
    },
    {
      question: "En cas de détresse respiratoire, la priorité est de :",
      choices: ["Évaluer la respiration et SpO₂", "Attendre 24h", "Éviter l’examen", "Donner une sortie immédiate"],
      answerIndex: 0,
      explanation: "L’évaluation initiale guide la prise en charge (selon protocoles locaux).",
    },
    {
      question: "La prévention des infections en pédiatrie repose notamment sur :",
      choices: ["Hygiène des mains", "Aucune mesure", "Retarder les soins", "Supprimer l’eau potable"],
      answerIndex: 0,
      explanation: "L’hygiène des mains est une mesure essentielle.",
    },
    {
      question: "Quel élément est utile pour suivre la croissance ?",
      choices: ["Courbe de croissance", "Couleur des yeux", "Pointure", "Coiffure"],
      answerIndex: 0,
      explanation: "La courbe de croissance permet le suivi staturo-pondéral.",
    },
    {
      question: "La vaccination vise à :",
      choices: ["Prévenir certaines maladies", "Provoquer systématiquement une maladie", "Remplacer l’hygiène", "Supprimer le suivi"],
      answerIndex: 0,
      explanation: "La vaccination contribue à prévenir des infections spécifiques.",
    },
    {
      question: "En cas de diarrhée aiguë, un risque important est :",
      choices: ["Déshydratation", "Amélioration garantie", "Toujours bénin", "Aucun impact"],
      answerIndex: 0,
      explanation: "Les pertes peuvent provoquer une déshydratation rapidement chez l’enfant.",
    },
  ];

  function addTopic(topic, count) {
    for (let i = 1; i <= count; i++) {
      const level = LEVELS[(i - 1) % LEVELS.length];
      const id = `eff-ped-${topic.replace(/\s+/g, "").toLowerCase()}-${String(i).padStart(3, "0")}`;
      if (i % 2 === 1) {
        const idx = clampIdx(i, TF_BANK.length);
        const statement = TF_BANK[idx];
        const answer = i % 6 !== 0;
        bank.push(
          mkTf({
            id,
            level,
            topic,
            question: statement,
            answer,
            explanation: "Toujours interpréter selon le contexte clinique et les protocoles du service.",
          })
        );
      } else {
        const idx = clampIdx(i, MCQ_BANK.length);
        const item = MCQ_BANK[idx];
        bank.push(
          mkMcq({
            id,
            level,
            topic,
            question: item.question,
            choices: item.choices,
            answerIndex: item.answerIndex,
            explanation: item.explanation,
          })
        );
      }
    }
  }

  for (const x of TOPICS_WITH_COUNT) addTopic(x.topic, x.count);
})();

// ============================================================
// Générateur: Santé Publique
// 100 questions / sujet à partir du Sujet 6 (S6..S9)
// ============================================================
(function () {
  const bank = window.QUIZ_QUESTIONS_EFF;
  if (!Array.isArray(bank)) return;

  if (bank.some((q) => q && typeof q === "object" && String(q.id || "").startsWith("eff-sp-"))) return;

  const SUBJECT = "Santé Publique";
  const LEVELS = ["Licence 3 INF/SAG-M", "AUXI 2 année"];
  const TOPICS_WITH_COUNT = [
    { topic: "Sujet 1", count: 60 },
    { topic: "Sujet 2", count: 60 },
    { topic: "Sujet 3", count: 60 },
    { topic: "Sujet 4", count: 60 },
    { topic: "Sujet 5", count: 60 },
    { topic: "Sujet 6", count: 100 },
    { topic: "Sujet 7", count: 100 },
    { topic: "Sujet 8", count: 100 },
    { topic: "Sujet 9", count: 100 },
  ];

  function mkMcq({ id, level, topic, question, choices, answerIndex, explanation }) {
    return { id, level, subject: SUBJECT, topic, type: "mcq", question, choices, answerIndex, explanation };
  }
  function mkTf({ id, level, topic, question, answer, explanation }) {
    return { id, level, subject: SUBJECT, topic, type: "tf", question, answer, explanation };
  }
  function clampIdx(n, len) {
    const x = n % len;
    return x < 0 ? x + len : x;
  }

  const TF_BANK = [
    "La prévention primaire vise à éviter la survenue d’une maladie.",
    "Le dépistage est une action de prévention secondaire.",
    "Le lavage des mains est une mesure de santé publique.",
    "La vaccination contribue à l’immunité collective.",
    "L’accès à l’eau potable réduit les maladies hydriques.",
    "La surveillance épidémiologique aide à détecter les épidémies.",
    "L’éducation pour la santé peut modifier des comportements à risque.",
    "L’assainissement influence la santé de la population.",
    "Le tri des déchets médicaux réduit les risques.",
    "Les campagnes de sensibilisation améliorent la prévention (selon contexte).",
  ];

  const MCQ_BANK = [
    {
      question: "La prévention secondaire correspond surtout à :",
      choices: ["Dépistage précoce", "Traitement palliatif", "Chirurgie systématique", "Aucune action"],
      answerIndex: 0,
      explanation: "La prévention secondaire vise à détecter tôt pour traiter rapidement.",
    },
    {
      question: "Quel est un exemple de prévention primaire ?",
      choices: ["Vaccination", "Dépistage", "Rééducation", "Soins palliatifs"],
      answerIndex: 0,
      explanation: "La vaccination aide à prévenir l’apparition de certaines maladies.",
    },
    {
      question: "La surveillance épidémiologique sert à :",
      choices: ["Suivre l’évolution des maladies", "Remplacer les soins", "Supprimer les données", "Éviter les alertes"],
      answerIndex: 0,
      explanation: "Elle permet d’identifier tendances, flambées et besoins d’action.",
    },
    {
      question: "Quel élément réduit le risque de maladies hydriques ?",
      choices: ["Eau potable", "Eau stagnante", "Absence d’assainissement", "Déchets non traités"],
      answerIndex: 0,
      explanation: "L’eau potable et l’assainissement sont essentiels.",
    },
    {
      question: "Lequel est une mesure de lutte contre les IST ?",
      choices: ["Préservatif", "Tabac", "Sédentarité", "Sel"],
      answerIndex: 0,
      explanation: "Le préservatif réduit la transmission des IST.",
    },
    {
      question: "En hygiène hospitalière, une mesure clé est :",
      choices: ["Hygiène des mains", "Aucune désinfection", "Réutiliser sans stériliser", "Ignorer les précautions"],
      answerIndex: 0,
      explanation: "L’hygiène des mains réduit les infections associées aux soins.",
    },
  ];

  function addTopic(topic, count) {
    for (let i = 1; i <= count; i++) {
      const level = LEVELS[(i - 1) % LEVELS.length];
      const id = `eff-sp-${topic.replace(/\s+/g, "").toLowerCase()}-${String(i).padStart(3, "0")}`;
      if (i % 2 === 1) {
        const idx = clampIdx(i, TF_BANK.length);
        const statement = TF_BANK[idx];
        const answer = i % 7 !== 0;
        bank.push(
          mkTf({
            id,
            level,
            topic,
            question: statement,
            answer,
            explanation: "Toujours se référer aux définitions et aux stratégies de prévention.",
          })
        );
      } else {
        const idx = clampIdx(i, MCQ_BANK.length);
        const item = MCQ_BANK[idx];
        bank.push(
          mkMcq({
            id,
            level,
            topic,
            question: item.question,
            choices: item.choices,
            answerIndex: item.answerIndex,
            explanation: item.explanation,
          })
        );
      }
    }
  }

  for (const x of TOPICS_WITH_COUNT) addTopic(x.topic, x.count);
})();

// ============================================================
// Générateur: Médecine
// 100 questions / sujet à partir du Sujet 6 (S6..S9)
// ============================================================
(function () {
  const bank = window.QUIZ_QUESTIONS_EFF;
  if (!Array.isArray(bank)) return;

  if (bank.some((q) => q && typeof q === "object" && String(q.id || "").startsWith("eff-med-"))) return;

  const SUBJECT = "Médecine";
  const TOPICS = ["Sujet 1", "Sujet 2", "Sujet 3", "Sujet 4", "Sujet 5", "Sujet 6", "Sujet 7", "Sujet 8", "Sujet 9"];
  const LEVELS = ["Licence 3 INF/SAG-M", "AUXI 2 année"];

  function mkMcq({ id, level, topic, question, choices, answerIndex, explanation }) {
    return { id, level, subject: SUBJECT, topic, type: "mcq", question, choices, answerIndex, explanation };
  }
  function mkTf({ id, level, topic, question, answer, explanation }) {
    return { id, level, subject: SUBJECT, topic, type: "tf", question, answer, explanation };
  }
  function clampIdx(n, len) {
    const x = n % len;
    return x < 0 ? x + len : x;
  }

  const TF_BANK = [
    "La tension artérielle est une constante vitale.",
    "La fréquence respiratoire doit être comptée sur une minute si le rythme est irrégulier.",
    "Une hypoglycémie peut être une urgence.",
    "La fièvre est une élévation de la température corporelle au-delà de 38°C (selon contexte).",
    "La douleur thoracique brutale nécessite une évaluation rapide.",
    "La saturation en oxygène (SpO₂) aide à évaluer l’oxygénation.",
    "La déshydratation peut se manifester par des muqueuses sèches et une soif.",
    "La prise de constantes aide à orienter la gravité clinique.",
    "Le lavage des mains réduit le risque d’infections associées aux soins.",
    "Une confusion aiguë peut être le signe d’un trouble métabolique ou infectieux.",
  ];

  const MCQ_BANK = [
    {
      question: "Quel est l’objectif principal du triage à l’accueil ?",
      choices: ["Prioriser selon gravité", "Éviter les constantes", "Retarder la prise en charge", "Remplacer la consultation"],
      answerIndex: 0,
      explanation: "Le triage classe les patients selon l’urgence et la gravité.",
    },
    {
      question: "Lequel fait partie des constantes vitales ?",
      choices: ["Température", "Couleur des yeux", "Pointure", "Coiffure"],
      answerIndex: 0,
      explanation: "La température est une constante vitale.",
    },
    {
      question: "Quel signe peut orienter vers une hypovolémie ?",
      choices: ["Tachycardie", "Bradycardie stable", "Somnolence normale", "Cheveux brillants"],
      answerIndex: 0,
      explanation: "La tachycardie peut être un signe compensateur d’hypovolémie (selon contexte).",
    },
    {
      question: "En cas de dyspnée, la première action utile est souvent :",
      choices: ["Évaluer la respiration et SpO₂", "Donner la sortie", "Éviter l’examen", "Attendre 24h"],
      answerIndex: 0,
      explanation: "L’évaluation initiale (FR, SpO₂, signes de lutte) guide la conduite.",
    },
    {
      question: "Quel élément fait partie de l’évaluation de la douleur ?",
      choices: ["Intensité (échelle)", "Couleur des chaussures", "Taille du téléphone", "Nombre de poches"],
      answerIndex: 0,
      explanation: "L’évaluation standardisée (EVA/EN) aide au suivi.",
    },
    {
      question: "Une antibiothérapie est surtout indiquée en première intention pour :",
      choices: ["Infection bactérienne probable", "Infection virale simple", "Allergie", "Traumatisme fermé"],
      answerIndex: 0,
      explanation: "Les antibiotiques ciblent les bactéries, pas les virus.",
    },
    {
      question: "Quel conseil hygiéno-diététique est pertinent pour prévenir la déshydratation ?",
      choices: ["Boire régulièrement", "Éviter toute boisson", "Ne jamais se reposer", "Supprimer l’alimentation"],
      answerIndex: 0,
      explanation: "L’hydratation régulière est importante (adaptée à l’état clinique).",
    },
    {
      question: "Lequel est un signe de gravité potentiel lors d’une fièvre ?",
      choices: ["Altération de l’état général", "Sourire", "Appétit normal", "Sommeil habituel"],
      answerIndex: 0,
      explanation: "L’altération de l’état général peut être un signe de gravité selon contexte.",
    },
    {
      question: "En cas de vomissements, un risque important est :",
      choices: ["Déshydratation", "Amélioration garantie", "Hyperthermie certaine", "Toujours bénin"],
      answerIndex: 0,
      explanation: "Les pertes digestives peuvent entraîner déshydratation et troubles électrolytiques.",
    },
    {
      question: "Quel geste de sécurité est essentiel avant un médicament ?",
      choices: ["Vérifier identité/allergies", "Ne rien vérifier", "Donner au hasard", "Éviter la prescription"],
      answerIndex: 0,
      explanation: "Vérifier identité et allergies limite les erreurs et accidents.",
    },
  ];

  function addTopic(topic, count) {
    for (let i = 1; i <= count; i++) {
      const level = LEVELS[(i - 1) % LEVELS.length];
      const id = `eff-med-${topic.replace(/\s+/g, "").toLowerCase()}-${String(i).padStart(3, "0")}`;

      if (i % 2 === 1) {
        const idx = clampIdx(i, TF_BANK.length);
        const statement = TF_BANK[idx];
        const answer = i % 5 !== 0;
        bank.push(
          mkTf({
            id,
            level,
            topic,
            question: statement,
            answer,
            explanation: "Toujours interpréter selon le contexte clinique et les protocoles locaux.",
          })
        );
      } else {
        const idx = clampIdx(i, MCQ_BANK.length);
        const item = MCQ_BANK[idx];
        bank.push(
          mkMcq({
            id,
            level,
            topic,
            question: item.question,
            choices: item.choices,
            answerIndex: item.answerIndex,
            explanation: item.explanation,
          })
        );
      }
    }
  }

  for (const topic of TOPICS) addTopic(topic, 100);
})();

// ============================================================
// Générateur: QCM à réponses multiples (2-3 bonnes réponses)
// 30 questions / sujet (Sujet 1..9) pour les 6 matières EFF
// ============================================================
(function () {
  const bank = window.QUIZ_QUESTIONS_EFF;
  if (!Array.isArray(bank)) return;

  // Anti-duplication si le fichier est chargé plusieurs fois
  if (bank.some((q) => q && typeof q === "object" && String(q.id || "").startsWith("eff-multi-"))) return;

  const TOPICS = ["Sujet 1", "Sujet 2", "Sujet 3", "Sujet 4", "Sujet 5", "Sujet 6", "Sujet 7", "Sujet 8", "Sujet 9"];
  const LEVELS = ["Licence 3 INF/SAG-M", "AUXI 2 année"];
  const SUBJECTS = [
    { key: "ped", label: "Pédiatrie" },
    { key: "sp", label: "Santé Publique" },
    { key: "med", label: "Médecine" },
    { key: "chir", label: "Chirurgie" },
    { key: "pf", label: "Planning Famillial" },
    { key: "gy", label: "Gynécologie" },
  ];

  function clampIdx(n, len) {
    const x = n % len;
    return x < 0 ? x + len : x;
  }

  function mkMcqMulti({ id, level, subject, topic, question, choices, answerIndices, explanation }) {
    return { id, level, subject, topic, type: "mcq_multi", question, choices, answerIndices, explanation };
  }

  // Banque de gabarits (questions génériques, mais adaptées au domaine)
  const MULTI_TEMPLATES = {
    ped: [
      {
        question: "Chez l’enfant, quels signes peuvent orienter vers une détresse respiratoire ? (2-3 réponses)",
        choices: ["Tirage", "Battement des ailes du nez", "Cyanose", "Cheveux brillants", "Vision parfaite"],
        answerIndices: [0, 1, 2],
        explanation: "Les signes de lutte (tirage, battement des ailes du nez) et la cyanose sont des signes de gravité.",
      },
      {
        question: "Quels éléments font partie de la surveillance d’une déshydratation chez l’enfant ? (2-3 réponses)",
        choices: ["Diurèse", "Muqueuses sèches", "Pli cutané", "Couleur des yeux", "Pointure"],
        answerIndices: [0, 1, 2],
        explanation: "La diurèse, les muqueuses et l’élasticité cutanée sont classiquement surveillées (selon contexte).",
      },
      {
        question: "Mesures de prévention des infections en pédiatrie : (2-3 réponses)",
        choices: ["Hygiène des mains", "Vaccination selon calendrier", "Nettoyage/désinfection selon protocoles", "Ignorer l’isolement", "Partage d’objets personnels"],
        answerIndices: [0, 1, 2],
        explanation: "Hygiène des mains, vaccination et mesures d’hygiène réduisent les infections.",
      },
      {
        question: "Quels sont des signes d’alerte chez un nourrisson fébrile ? (2-3 réponses)",
        choices: ["Somnolence/prostration", "Refus de téter", "Convulsions", "Bonne humeur constante", "Appétit augmenté"],
        answerIndices: [0, 1, 2],
        explanation: "Somnolence, refus de téter et convulsions sont des signes d’alerte selon contexte clinique.",
      },
    ],
    sp: [
      {
        question: "La prévention primaire comprend : (2-3 réponses)",
        choices: ["Vaccination", "Éducation pour la santé", "Amélioration de l’accès à l’eau potable", "Dépistage", "Soins palliatifs"],
        answerIndices: [0, 1, 2],
        explanation: "Prévention primaire = éviter la survenue de la maladie (ex: vaccination, éducation, eau potable).",
      },
      {
        question: "Exemples de prévention secondaire : (2-3 réponses)",
        choices: ["Dépistage", "Diagnostic précoce", "Traitement précoce", "Lavage des mains", "Sport"],
        answerIndices: [0, 1, 2],
        explanation: "Prévention secondaire = dépister et intervenir tôt.",
      },
      {
        question: "Mesures essentielles en hygiène hospitalière : (2-3 réponses)",
        choices: ["Hygiène des mains", "Port d’EPI selon risque", "Tri des déchets", "Réutilisation sans stériliser", "Aucune désinfection"],
        answerIndices: [0, 1, 2],
        explanation: "Hygiène des mains, EPI et gestion des déchets font partie des mesures clés.",
      },
      {
        question: "Pour limiter les IST, on recommande : (2-3 réponses)",
        choices: ["Préservatif", "Dépistage", "Éducation/sensibilisation", "Partage d’aiguilles", "Automédication antibiotique"],
        answerIndices: [0, 1, 2],
        explanation: "Préservatif, dépistage et éducation réduisent la transmission (selon contextes).",
      },
    ],
    med: [
      {
        question: "Constantes vitales à surveiller en priorité : (2-3 réponses)",
        choices: ["TA", "FC", "FR", "Couleur des cheveux", "Pointure"],
        answerIndices: [0, 1, 2],
        explanation: "TA/FC/FR font partie des constantes essentielles.",
      },
      {
        question: "Signes pouvant orienter vers une hypovolémie : (2-3 réponses)",
        choices: ["Tachycardie", "Hypotension (selon contexte)", "Marbrures/pâleur", "Vision parfaite", "Bonne humeur"],
        answerIndices: [0, 1, 2],
        explanation: "Tachycardie, hypotension et signes périphériques peuvent évoquer une hypovolémie.",
      },
      {
        question: "Avant l’administration d’un médicament, il faut vérifier : (2-3 réponses)",
        choices: ["Identité du patient", "Allergies", "Dose/voie/heure (selon prescription)", "Couleur des chaussettes", "Nombre de poches"],
        answerIndices: [0, 1, 2],
        explanation: "Sécurité médicamenteuse: identité, allergies, et vérifications de la prescription.",
      },
      {
        question: "En cas de dyspnée, l’évaluation initiale comprend : (2-3 réponses)",
        choices: ["SpO₂", "FR", "Signes de lutte", "Coiffure", "Pointure"],
        answerIndices: [0, 1, 2],
        explanation: "SpO₂, FR et signes de lutte orientent la gravité et la conduite.",
      },
    ],
    chir: [
      {
        question: "Mesures de prévention des infections du site opératoire : (2-3 réponses)",
        choices: ["Asepsie", "Hygiène des mains", "Antisepsie cutanée", "Aucun protocole", "Ignorer le champ stérile"],
        answerIndices: [0, 1, 2],
        explanation: "Asepsie, hygiène des mains et antisepsie contribuent à réduire le risque infectieux.",
      },
      {
        question: "Surveillance postopératoire immédiate : (2-3 réponses)",
        choices: ["Constantes vitales", "Douleur", "Pansement/saignement", "Couleur des yeux", "Pointure"],
        answerIndices: [0, 1, 2],
        explanation: "Constantes, douleur et pansement sont des éléments majeurs de surveillance.",
      },
      {
        question: "Signes pouvant évoquer une hémorragie postopératoire : (2-3 réponses)",
        choices: ["Pâleur", "Tachycardie", "Pansement imbibé", "Bonne humeur", "Appétit augmenté"],
        answerIndices: [0, 1, 2],
        explanation: "Pâleur, tachycardie et saignement visible doivent alerter selon contexte.",
      },
      {
        question: "Avant un geste invasif, on réalise : (2-3 réponses)",
        choices: ["Hygiène des mains", "Matériel stérile/approprié", "Antisepsie", "Retirer les gants", "Ignorer les précautions"],
        answerIndices: [0, 1, 2],
        explanation: "Hygiène, matériel adapté et antisepsie sont essentiels.",
      },
    ],
    pf: [
      {
        question: "Lors du conseil contraceptif, il faut : (2-3 réponses)",
        choices: ["Informer sur efficacité", "Expliquer les effets secondaires", "Respecter le choix/consentement", "Imposer une méthode", "Éviter les questions"],
        answerIndices: [0, 1, 2],
        explanation: "Le conseil contraceptif doit être informatif et centré sur le consentement.",
      },
      {
        question: "La contraception d’urgence est indiquée après : (2-3 réponses)",
        choices: ["Rapport non protégé", "Échec de préservatif", "Oubli de pilule (selon cas)", "Vaccination", "Sport"],
        answerIndices: [0, 1, 2],
        explanation: "Elle est utilisée après un risque de grossesse non désirée.",
      },
      {
        question: "Le préservatif : (2-3 réponses)",
        choices: ["Est une méthode barrière", "Réduit le risque d’IST", "Dépend d’une bonne utilisation", "Remplace le consentement", "Supprime le suivi"],
        answerIndices: [0, 1, 2],
        explanation: "Le préservatif est barrière, protège des IST, et son efficacité dépend de l’usage.",
      },
      {
        question: "Objectifs de la planification familiale : (2-3 réponses)",
        choices: ["Espacer les naissances", "Réduire les grossesses non désirées", "Améliorer la santé maternelle et infantile", "Éviter l’information", "Supprimer les soins"],
        answerIndices: [0, 1, 2],
        explanation: "La planification familiale vise la santé et le choix éclairé.",
      },
    ],
    gy: [
      {
        question: "Signes pouvant orienter vers une infection génitale : (2-3 réponses)",
        choices: ["Prurit", "Leucorrhées malodorantes", "Brûlures", "Cheveux longs", "Vision parfaite"],
        answerIndices: [0, 1, 2],
        explanation: "Prurit, leucorrhées malodorantes et brûlures sont des signes fréquents (selon contexte).",
      },
      {
        question: "Mesures de dépistage/prévention en gynécologie : (2-3 réponses)",
        choices: ["Frottis/HPV selon protocole", "Information/éducation", "Consultation en cas de signes d’alerte", "Ignorer les symptômes", "Douches vaginales agressives"],
        answerIndices: [0, 1, 2],
        explanation: "Dépistage, éducation, et consultation en cas d’alerte sont essentiels.",
      },
      {
        question: "Devant une douleur pelvienne aiguë, on doit : (2-3 réponses)",
        choices: ["Évaluer rapidement", "Rechercher signes de gravité", "Orienter/alerter selon protocole", "Attendre 48h", "Ignorer"],
        answerIndices: [0, 1, 2],
        explanation: "Une douleur pelvienne aiguë peut relever d’une urgence selon contexte.",
      },
      {
        question: "Conseils d’hygiène intime adaptés : (2-3 réponses)",
        choices: ["Toilette douce", "Éviter produits agressifs", "Éviter excès de lavage", "Douches vaginales fréquentes", "Antibiotiques systématiques"],
        answerIndices: [0, 1, 2],
        explanation: "L’excès et les produits agressifs peuvent déséquilibrer la flore.",
      },
    ],
  };

  function topicKey(topic) {
    return String(topic).replace(/\s+/g, "").toLowerCase();
  }

  function addForSubject(subjectKey, subjectLabel) {
    const templates = MULTI_TEMPLATES[subjectKey] || [];
    if (templates.length === 0) return;

    for (const topic of TOPICS) {
      for (let i = 1; i <= 30; i++) {
        const level = LEVELS[(i - 1) % LEVELS.length];
        const t = templates[clampIdx(i, templates.length)];
        const id = `eff-multi-${subjectKey}-${topicKey(topic)}-${String(i).padStart(2, "0")}`;
        bank.push(
          mkMcqMulti({
            id,
            level,
            subject: subjectLabel,
            topic,
            question: t.question,
            choices: t.choices,
            answerIndices: t.answerIndices,
            explanation: t.explanation,
          })
        );
      }
    }
  }

  for (const s of SUBJECTS) addForSubject(s.key, s.label);
})();

// ============================================================
// Générateur: Chirurgie
// 100 questions / sujet à partir du Sujet 6 (S6..S9)
// ============================================================
(function () {
  const bank = window.QUIZ_QUESTIONS_EFF;
  if (!Array.isArray(bank)) return;

  if (bank.some((q) => q && typeof q === "object" && String(q.id || "").startsWith("eff-chir-"))) return;

  const SUBJECT = "Chirurgie";
  const TOPICS = ["Sujet 1", "Sujet 2", "Sujet 3", "Sujet 4", "Sujet 5", "Sujet 6", "Sujet 7", "Sujet 8", "Sujet 9"];
  const LEVELS = ["Licence 3 INF/SAG-M", "AUXI 2 année"];

  function mkMcq({ id, level, topic, question, choices, answerIndex, explanation }) {
    return { id, level, subject: SUBJECT, topic, type: "mcq", question, choices, answerIndex, explanation };
  }
  function mkTf({ id, level, topic, question, answer, explanation }) {
    return { id, level, subject: SUBJECT, topic, type: "tf", question, answer, explanation };
  }
  function clampIdx(n, len) {
    const x = n % len;
    return x < 0 ? x + len : x;
  }

  const TF_BANK = [
    "L’asepsie est essentielle pour réduire le risque d’infection du site opératoire.",
    "Le jeûne préopératoire dépend du type d’anesthésie et des protocoles.",
    "Une douleur intense brutale en postopératoire doit être évaluée rapidement.",
    "Le saignement actif d’un pansement nécessite une surveillance et une conduite adaptée.",
    "Le comptage des compresses au bloc contribue à la sécurité du patient.",
    "Un état de choc peut se manifester par hypotension et tachycardie (selon contexte).",
    "La surveillance des constantes est indispensable en postopératoire.",
    "Une rougeur, chaleur et douleur au niveau d’une cicatrice peuvent évoquer une infection.",
    "La mobilisation précoce peut réduire certains risques postopératoires (selon indication).",
    "Le respect des précautions standard diminue le risque de transmission croisée.",
  ];

  const MCQ_BANK = [
    {
      question: "Quel est l’objectif principal de l’asepsie au bloc opératoire ?",
      choices: ["Diminuer le risque infectieux", "Augmenter la douleur", "Retarder la cicatrisation", "Remplacer l’anesthésie"],
      answerIndex: 0,
      explanation: "L’asepsie réduit la contamination microbienne et donc le risque d’infection.",
    },
    {
      question: "En postopératoire immédiat, quel élément est prioritaire à surveiller ?",
      choices: ["Constantes vitales", "Couleur des chaussettes", "Coiffure", "Pointure"],
      answerIndex: 0,
      explanation: "La surveillance des constantes permet de dépister précocement une complication.",
    },
    {
      question: "Quel signe peut orienter vers une hémorragie postopératoire ?",
      choices: ["Pâleur + tachycardie", "Bonne humeur", "Sommeil normal", "Peau sèche seule"],
      answerIndex: 0,
      explanation: "Selon le contexte, pâleur et tachycardie peuvent évoquer une perte sanguine.",
    },
    {
      question: "Lors d’une douleur abdominale aiguë avec défense, la conduite générale est :",
      choices: ["Évaluer rapidement et alerter", "Attendre 48h", "Ignorer", "Donner une sortie immédiate"],
      answerIndex: 0,
      explanation: "Des signes péritonéaux nécessitent une évaluation urgente.",
    },
    {
      question: "Quel élément fait partie de la surveillance d’une cicatrice ?",
      choices: ["Rougeur, chaleur, écoulement", "Couleur des cheveux", "Taille du téléphone", "Nombre de poches"],
      answerIndex: 0,
      explanation: "Ces signes orientent vers inflammation/infection et complications locales.",
    },
    {
      question: "Le comptage des compresses sert surtout à :",
      choices: ["Éviter un corps étranger retenu", "Accélérer l’anesthésie", "Remplacer la stérilisation", "Changer le diagnostic"],
      answerIndex: 0,
      explanation: "Mesure de sécurité pour éviter une compresse oubliée.",
    },
    {
      question: "Quel est un risque de l’alitement prolongé (selon patient) ?",
      choices: ["Thrombose/complications", "Guérison garantie", "Zéro douleur", "Aucun impact"],
      answerIndex: 0,
      explanation: "La mobilisation/kiné (selon indication) aide à réduire certains risques.",
    },
    {
      question: "En cas de pansement imbibé de sang, la première action est :",
      choices: ["Évaluer, renforcer si besoin et alerter selon protocole", "Ignorer", "Le jeter sans évaluer", "Attendre le lendemain"],
      answerIndex: 0,
      explanation: "Il faut apprécier l’importance et agir selon protocole/consignes.",
    },
    {
      question: "Quel élément est essentiel avant un geste invasif ?",
      choices: ["Hygiène des mains + matériel adapté", "Aucune préparation", "Retirer les gants", "Éviter l’antisepsie"],
      answerIndex: 0,
      explanation: "Hygiène des mains et préparation du matériel réduisent les risques.",
    },
    {
      question: "Une fièvre postopératoire persistante peut évoquer :",
      choices: ["Une complication (selon délai) à évaluer", "Toujours normal", "Aucune cause", "Un signe esthétique"],
      answerIndex: 0,
      explanation: "La fièvre nécessite une analyse selon le délai postop et les signes associés.",
    },
  ];

  function addTopic(topic, count) {
    for (let i = 1; i <= count; i++) {
      const level = LEVELS[(i - 1) % LEVELS.length];
      const id = `eff-chir-${topic.replace(/\s+/g, "").toLowerCase()}-${String(i).padStart(3, "0")}`;

      if (i % 2 === 1) {
        const idx = clampIdx(i, TF_BANK.length);
        const statement = TF_BANK[idx];
        const answer = i % 6 !== 0;
        bank.push(
          mkTf({
            id,
            level,
            topic,
            question: statement,
            answer,
            explanation: "Toujours interpréter selon le contexte clinique et les protocoles du service.",
          })
        );
      } else {
        const idx = clampIdx(i, MCQ_BANK.length);
        const item = MCQ_BANK[idx];
        bank.push(
          mkMcq({
            id,
            level,
            topic,
            question: item.question,
            choices: item.choices,
            answerIndex: item.answerIndex,
            explanation: item.explanation,
          })
        );
      }
    }
  }

  for (const topic of TOPICS) addTopic(topic, 100);
})();

// ============================================================
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
    level: "Licence 3 INF/SAG-M",
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
    level: "AUXI 2 année",
    subject: "Médecine",
    topic: "Sujet 7",
    type: "tf",
    question: "Une hypoglycémie peut être une urgence.",
    answer: true,
    explanation: "Une hypoglycémie sévère peut nécessiter une prise en charge rapide.",
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
    const raw = safeText(subject).trim();
    const n = normalizeKey(raw);

    if (n.includes("pediatr")) return "Pédiatrie";
    if (n.includes("sante publique")) return "Santé Publique";
    if (n.includes("gynecolog")) return "Gynécologie";
    if (n.includes("planning")) return "Planning Famillial";
    if (n.includes("churig") || n.includes("chirurg")) return "Chirurgie";
    if (n.includes("medical") || n.includes("medecine") || n.includes("sémiologie") || n.includes("semiologie")) {
      return "Médecine";
    }
    return "";
  }

  function isAllowedLevel(level) {
    const n = normalizeKey(level);
    return n.includes("inf/sag-m") || n.includes("ide/sfm") || n.includes("auxi") || n.includes("auxiliaire");
  }

  function isAllowedTopic(topic) {
    const n = normalizeKey(topic);
    const m = n.match(/^sujet\s*([0-9]+)$/);
    if (!m) return false;
    const num = Number(m[1]);
    return num >= 1 && num <= 9;
  }

  const src = Array.isArray(window.QUIZ_QUESTIONS_EFF) ? window.QUIZ_QUESTIONS_EFF : [];

  window.QUIZ_QUESTIONS_DE = src
    .filter((q) => {
      if (!q || typeof q !== "object") return false;
      return isAllowedLevel(q.level) && isAllowedTopic(q.topic);
    })
    .map((q) => {
      const mappedSubject = mapSubjectToDE(q.subject);
      if (!mappedSubject) return null;
      return { ...q, subject: mappedSubject };
    })
    .filter(Boolean);
})();
