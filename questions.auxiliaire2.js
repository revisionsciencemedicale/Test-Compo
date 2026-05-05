/**
 * Génère automatiquement les questions pour A2-Niveau moyen:
 * - 22 matières
 * - 6 sujets par matière
 * - 50 questions par sujet
 */
(function addAuxiliaire2Questions() {
  if (!Array.isArray(window.QUIZ_QUESTIONS_QUIZ)) return;

  const level = "A2-Niveau moyen";
  const subjects = [
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
    "Secourisme",
  ];
  const topics = ["Sujet 1", "Sujet 2", "Sujet 3", "Sujet 4", "Sujet 5", "Sujet 6"];
  const questionsPerTopic = 50;

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

  function makeTF(id, subject, topic) {
    return {
      id,
      level,
      subject,
      topic,
      type: "tf",
      question: "Le respect des protocoles améliore la sécurité et la qualité des soins.",
      answer: true,
      explanation:
        "Le respect des protocoles réduit les erreurs, améliore la qualité des soins et la sécurité des patients.",
    };
  }

  function makeMCQ(id, subject, topic) {
    return {
      id,
      level,
      subject,
      topic,
      type: "mcq",
      question: "Quelle est la meilleure conduite initiale devant un risque clinique ?",
      choices: [
        "Évaluer, sécuriser le patient et appliquer le protocole",
        "Attendre sans intervenir",
        "Administrer un traitement hors protocole",
        "Ignorer les signes d'alerte",
      ],
      answerIndex: 0,
      explanation:
        "La prise en charge correcte commence par l'évaluation, la sécurité du patient et l'application du protocole.",
    };
  }

  for (const subject of subjects) {
    const subjectSlug = slugify(subject);
    for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
      const topic = topics[topicIndex];
      for (let i = 1; i <= questionsPerTopic; i++) {
        const id = "a2-aux-" + subjectSlug + "-s" + (topicIndex + 1) + "-q" + i;
        const isTF = i % 2 === 0;
        pushUnique(isTF ? makeTF(id, subject, topic) : makeMCQ(id, subject, topic));
      }
    }
  }

  // Exemple manuel (non automatique) pour vous montrer le modèle:
  // Matière: Sémiologie médical / Sujet 7 / A2-Niveau moyen
  pushUnique({
    id: "a2-semiologie-s7-1",
    level: "A2-Niveau moyen",
    subject: "Sémiologie médical",
    topic: "Sujet 7",
    type: "mcq",
    question: "Quel signe oriente vers une détresse circulatoire ?",
    choices: [
      "Hypotension avec extrémités froides",
      "Appétit conservé",
      "Sommeil normal",
      "Fréquence cardiaque normale isolée",
    ],
    answerIndex: 0,
    explanation: "L'hypotension et les extrémités froides évoquent une perfusion insuffisante et une urgence potentielle.",
  });

  pushUnique({
    id: "a2-semiologie-s7-2",
    level: "A2-Niveau moyen",
    subject: "Sémiologie médical",
    topic: "Sujet 7",
    type: "tf",
    question: "Une altération de l'état de conscience doit être considérée comme un signe de gravité.",
    answer: true,
    explanation: "Toute baisse de vigilance peut traduire une urgence vitale et nécessite une évaluation rapide.",
  });

  pushUnique({
    id: "a2-semiologie-s7-3",
    level: "A2-Niveau moyen",
    subject: "Sémiologie médical",
    topic: "Sujet 7",
    type: "mcq",
    question: "Quel paramètre doit être surveillé en priorité chez un patient fébrile ?",
    choices: [
      "Température, fréquence respiratoire et état général",
      "Couleur des vêtements",
      "Préférence alimentaire",
      "Heure d'arrivée uniquement",
    ],
    answerIndex: 0,
    explanation:
      "Chez un patient fébrile, la surveillance des constantes et de l'état général aide à détecter rapidement une aggravation.",
  });

  // Deuxième exemple manuel sur une autre matière:
  // Matière: Anatomie physiologie / Sujet 7 / A2-Niveau moyen
  pushUnique({
    id: "a2-anatomie-s7-1",
    level: "A2-Niveau moyen",
    subject: "Anatomie physiologie",
    topic: "Sujet 7",
    type: "mcq",
    question: "Quel vaisseau transporte le sang oxygéné du cœur vers l'organisme ?",
    choices: ["L'aorte", "La veine cave", "L'artère pulmonaire", "La veine pulmonaire"],
    answerIndex: 0,
    explanation: "L'aorte est la principale artère systémique qui distribue le sang oxygéné.",
  });

  pushUnique({
    id: "a2-anatomie-s7-2",
    level: "A2-Niveau moyen",
    subject: "Anatomie physiologie",
    topic: "Sujet 7",
    type: "tf",
    question: "Les poumons participent aux échanges gazeux entre l'air et le sang.",
    answer: true,
    explanation: "Les alvéoles pulmonaires assurent les échanges d'oxygène et de dioxyde de carbone.",
  });

  pushUnique({
    id: "a2-anatomie-s7-3",
    level: "A2-Niveau moyen",
    subject: "Anatomie physiologie",
    topic: "Sujet 7",
    type: "mcq",
    question: "Quel est le rôle principal des plaquettes sanguines ?",
    choices: [
      "Participer à l'hémostase et à la coagulation",
      "Transporter l'oxygène",
      "Produire l'insuline",
      "Filtrer le sang",
    ],
    answerIndex: 0,
    explanation: "Les plaquettes interviennent dans la formation du clou plaquettaire et la coagulation.",
  });

  // Troisième exemple manuel sur une autre matière:
  // Matière: Hygiène hospitalière / Sujet 7 / A2-Niveau moyen
  pushUnique({
    id: "a2-hygienehosp-s7-1",
    level: "A2-Niveau moyen",
    subject: "Hygiène hospitalière",
    topic: "Sujet 7",
    type: "mcq",
    question: "Quel EPI est indiqué en cas de risque de projection de liquides biologiques ?",
    choices: [
      "Gants, masque et protection oculaire",
      "Aucun EPI",
      "Chaussures ouvertes uniquement",
      "Montre et bagues",
    ],
    answerIndex: 0,
    explanation:
      "En cas de risque de projection, il faut une protection adaptée incluant gants, masque et protection des yeux.",
  });

  pushUnique({
    id: "a2-hygienehosp-s7-2",
    level: "A2-Niveau moyen",
    subject: "Hygiène hospitalière",
    topic: "Sujet 7",
    type: "tf",
    question: "La désinfection du matériel réutilisable doit suivre un protocole validé.",
    answer: true,
    explanation:
      "Le traitement du matériel réutilisable suit une procédure standardisée pour éviter la transmission croisée.",
  });

  pushUnique({
    id: "a2-hygienehosp-s7-3",
    level: "A2-Niveau moyen",
    subject: "Hygiène hospitalière",
    topic: "Sujet 7",
    type: "mcq",
    question: "Quel est l'objectif du tri des déchets de soins ?",
    choices: [
      "Réduire les risques infectieux et protéger le personnel/environnement",
      "Mélanger tous les déchets",
      "Gagner du temps en évitant la séparation",
      "Éliminer sans identification",
    ],
    answerIndex: 0,
    explanation:
      "Le tri à la source limite les expositions et améliore la sécurité de la filière d'élimination des déchets.",
  });
})();

