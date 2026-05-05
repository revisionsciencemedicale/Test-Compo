/**
 * Génère automatiquement les questions de L3-Niveau Accompli INF:
 * - 36 matières
 * - 6 sujets par matière
 * - 50 questions par sujet
 */
(function addLicence3IDEQuestions() {
  if (!Array.isArray(window.QUIZ_QUESTIONS_QUIZ)) return;

  const level = "L3-Niveau Accompli INF";
  const subjects = [
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
    "Surveillances thérapeutiques 1",
    "Surveillance thérapeutique 2",
    "Droit administratif",
    "Mise en œuvre et évaluation d’un projet de soins infirmiers",
    "Entreprenariat / Gestion de la qualité",
    "Soins infirmiers spécialisés en médecine",
    "Soins palliatifs",
    "Soins infirmiers spécialisés en chirurgie",
    "Supervision / Suivi - Evaluation",
    "Gestion Hospitalière",
    "Analyse des données quantitatives et qualitatives",
  ];
  const topics = ["Sujet 1", "Sujet 2", "Sujet 3", "Sujet 4", "Sujet 5", "Sujet 6"];
  const questionsPerTopic = 50;
  const prefix = "l3ide26";

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const existingIds = new Set(window.QUIZ_QUESTIONS_QUIZ.map((q) => q && q.id).filter(Boolean));

  function pushUnique(q) {
    if (!q || !q.id || existingIds.has(q.id)) return;
    existingIds.add(q.id);
    window.QUIZ_QUESTIONS_QUIZ.push(q);
  }

  function makeTF(id, subject, topic, index) {
    return {
      id,
      level,
      subject,
      topic,
      type: "tf",
      question: "La bonne application des protocoles améliore la sécurité et la qualité des soins.",
      answer: true,
      explanation:
        "L'application standardisée des protocoles réduit les erreurs et améliore la qualité des soins infirmiers.",
    };
  }

  function makeMCQ(id, subject, topic, index) {
    return {
      id,
      level,
      subject,
      topic,
      type: "mcq",
      question: "Quelle est la meilleure conduite infirmière initiale devant un risque clinique ?",
      choices: [
        "Évaluer la situation, sécuriser le patient et suivre le protocole",
        "Attendre sans intervenir",
        "Donner un traitement hors protocole",
        "Ignorer les signes d'alerte",
      ],
      answerIndex: 0,
      explanation:
        "La priorité est l'évaluation clinique, la sécurité du patient et l'application du protocole de prise en charge.",
    };
  }

  for (const subject of subjects) {
    const subjectSlug = slugify(subject);
    for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
      const topic = topics[topicIndex];
      for (let i = 1; i <= questionsPerTopic; i++) {
        const id = prefix + "-" + subjectSlug + "-s" + (topicIndex + 1) + "-q" + i;
        const isTF = i % 2 === 0;
        pushUnique(isTF ? makeTF(id, subject, topic, i) : makeMCQ(id, subject, topic, i));
      }
    }
  }
})();

