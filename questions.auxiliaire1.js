/**
 * Génère automatiquement les questions pour A1-Base Santé:
 * - 22 matières
 * - 6 sujets par matière
 * - 50 questions par sujet
 */
(function addAuxiliaire1Questions() {
  if (!Array.isArray(window.QUIZ_QUESTIONS_QUIZ)) return;

  const level = "A1-Base Santé";
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
        const id = "a1-aux-" + subjectSlug + "-s" + (topicIndex + 1) + "-q" + i;
        const isTF = i % 2 === 0;
        pushUnique(isTF ? makeTF(id, subject, topic) : makeMCQ(id, subject, topic));
      }
    }
  }

  // Exemple manuel (non automatique) pour vous montrer le modèle:
  // Matière: Sémiologie médical / Sujet 7 / A1-Base Santé
  pushUnique({
    id: "a1-semiologie-s7-1",
    level: "A1-Base Santé",
    subject: "Sémiologie médical",
    topic: "Sujet 7",
    type: "mcq",
    question: "Quel est le premier geste en présence d'un patient avec détresse respiratoire ?",
    choices: [
      "Évaluer les voies aériennes et la respiration",
      "Donner immédiatement un médicament sans évaluation",
      "Attendre 10 minutes avant d'agir",
      "Faire sortir le patient",
    ],
    answerIndex: 0,
    explanation: "La priorité est l'évaluation ABC, en commençant par les voies aériennes et la respiration.",
  });

  pushUnique({
    id: "a1-semiologie-s7-2",
    level: "A1-Base Santé",
    subject: "Sémiologie médical",
    topic: "Sujet 7",
    type: "tf",
    question: "Une fréquence respiratoire supérieure à 30/min chez l'adulte est un signe de gravité.",
    answer: true,
    explanation: "La tachypnée marquée peut indiquer une détresse respiratoire nécessitant une prise en charge rapide.",
  });

  pushUnique({
    id: "a1-semiologie-s7-3",
    level: "A1-Base Santé",
    subject: "Sémiologie médical",
    topic: "Sujet 7",
    type: "mcq",
    question: "Quel signe clinique évoque une mauvaise perfusion périphérique ?",
    choices: [
      "Temps de recoloration cutanée allongé",
      "Peau chaude et rose",
      "Pouls régulier à 80/min",
      "Saturation normale en oxygène",
    ],
    answerIndex: 0,
    explanation: "Un temps de recoloration allongé est un signe fréquent d'hypoperfusion périphérique.",
  });

  // Deuxième exemple manuel sur une autre matière:
  // Matière: Anatomie physiologie / Sujet 7 / A1-Base Santé
  pushUnique({
    id: "a1-anatomie-s7-1",
    level: "A1-Base Santé",
    subject: "Anatomie physiologie",
    topic: "Sujet 7",
    type: "mcq",
    question: "Quel organe est principalement responsable de la filtration du sang ?",
    choices: ["Le rein", "Le foie", "Le pancréas", "La rate"],
    answerIndex: 0,
    explanation: "Le rein filtre le sang et participe à l'élimination des déchets métaboliques.",
  });

  pushUnique({
    id: "a1-anatomie-s7-2",
    level: "A1-Base Santé",
    subject: "Anatomie physiologie",
    topic: "Sujet 7",
    type: "tf",
    question: "Le cœur possède quatre cavités.",
    answer: true,
    explanation: "Le cœur est composé de deux oreillettes et de deux ventricules.",
  });

  pushUnique({
    id: "a1-anatomie-s7-3",
    level: "A1-Base Santé",
    subject: "Anatomie physiologie",
    topic: "Sujet 7",
    type: "mcq",
    question: "Quelle est la fonction principale des globules rouges ?",
    choices: [
      "Transporter l'oxygène",
      "Produire les anticorps",
      "Coaguler le sang",
      "Détruire les bactéries",
    ],
    answerIndex: 0,
    explanation: "Les globules rouges transportent l'oxygène grâce à l'hémoglobine.",
  });

  // Troisième exemple manuel sur une autre matière:
  // Matière: Hygiène hospitalière / Sujet 7 / A1-Base Santé
  pushUnique({
    id: "a1-hygienehosp-s7-1",
    level: "A1-Base Santé",
    subject: "Hygiène hospitalière",
    topic: "Sujet 7",
    type: "mcq",
    question: "Quelle est la mesure la plus efficace pour prévenir les infections associées aux soins ?",
    choices: [
      "L'hygiène des mains aux moments recommandés",
      "Le port des bijoux",
      "Le partage du matériel sans désinfection",
      "L'absence de tri des déchets",
    ],
    answerIndex: 0,
    explanation: "L'hygiène des mains est la mesure prioritaire de prévention des infections nosocomiales.",
  });

  pushUnique({
    id: "a1-hygienehosp-s7-2",
    level: "A1-Base Santé",
    subject: "Hygiène hospitalière",
    topic: "Sujet 7",
    type: "tf",
    question: "Le port des gants ne remplace pas l'hygiène des mains.",
    answer: true,
    explanation:
      "Les gants sont une barrière complémentaire. L'hygiène des mains reste obligatoire avant et après leur utilisation.",
  });

  pushUnique({
    id: "a1-hygienehosp-s7-3",
    level: "A1-Base Santé",
    subject: "Hygiène hospitalière",
    topic: "Sujet 7",
    type: "mcq",
    question: "Dans quel contenant jette-t-on les objets piquants et tranchants ?",
    choices: [
      "Boîte de sécurité rigide dédiée",
      "Sac poubelle ordinaire",
      "Carton non fermé",
      "N'importe quel récipient",
    ],
    answerIndex: 0,
    explanation: "Les objets piquants/tranchants doivent être éliminés dans un collecteur sécurisé conforme.",
  });
})();

