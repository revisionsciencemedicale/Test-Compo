/* global window */
/**
 * Complément A2-Niveau moyen
 * Objectif: ajouter automatiquement des questions aux matières/sujets A2 qui existent
 * dans la liste officielle mais qui n'ont pas encore de questions.
 * Modèle: 6 sujets par matière, 50 questions par sujet, QCM + QCD.
 * QCD est encodé en type mcq_multi pour être compatible avec l'application.
 */
(function addA2NiveauMoyenComplementQuestions() {
  if (!Array.isArray(window.QUIZ_QUESTIONS_QUIZ)) return;

  const level = "A2-Niveau moyen";
  const subjectsByLevel = window.SUBJECTS_BY_LEVEL || {};
  const subjects = Array.isArray(subjectsByLevel[level]) ? subjectsByLevel[level] : [];
  const defaultTopics = ["Sujet 1", "Sujet 2", "Sujet 3", "Sujet 4", "Sujet 5", "Sujet 6"];
  const questionsPerTopic = 50;

  function txt(value) {
    return String(value == null ? "" : value).replace(/\s+/g, " ").trim();
  }

  function slugify(value) {
    return txt(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function same(a, b) {
    return txt(a).toLowerCase() === txt(b).toLowerCase();
  }

  const existingIds = new Set(window.QUIZ_QUESTIONS_QUIZ.map((q) => q && q.id).filter(Boolean));

  function topicHasQuestions(subject, topic) {
    return window.QUIZ_QUESTIONS_QUIZ.some((q) =>
      q && same(q.level, level) && same(q.subject, subject) && same(q.topic, topic)
    );
  }

  function pushUnique(q) {
    if (!q || !q.id || existingIds.has(q.id)) return;
    existingIds.add(q.id);
    window.QUIZ_QUESTIONS_QUIZ.push(q);
  }

  const contextes = [
    "l'accueil d'un patient présentant un signe d'alerte",
    "la surveillance clinique après un soin",
    "la préparation d'une séance d'éducation sanitaire",
    "la prévention d'une complication chez un patient fragile",
    "la transmission des données à l'équipe de soins",
    "l'application d'un protocole en service",
    "l'identification d'un risque infectieux",
    "la priorisation des actions devant une urgence simple",
    "l'accompagnement d'une famille inquiète",
    "la traçabilité d'un acte dans le dossier"
  ];

  const bonnesActions = [
    "Évaluer la situation, sécuriser le patient et alerter le référent si nécessaire",
    "Vérifier l'identité du patient et respecter le protocole avant tout soin",
    "Observer les signes cliniques, mesurer les constantes et transmettre les anomalies",
    "Expliquer simplement le soin au patient et rechercher son accord",
    "Utiliser une hygiène des mains correcte et préparer le matériel adapté",
    "Noter les informations utiles dans le dossier pour assurer la continuité des soins"
  ];

  const mauvaisesActions = [
    "Administrer un traitement non prescrit pour gagner du temps",
    "Ignorer les signes d'aggravation si le patient ne se plaint pas",
    "Réaliser le soin sans vérifier l'identité du patient",
    "Reporter la transmission d'une anomalie importante à la fin de la journée",
    "Utiliser du matériel non contrôlé ou non adapté",
    "Donner une information confuse sans vérifier la compréhension du patient"
  ];

  const themesParMotCle = [
    { key: /cardio|circul|tension|vasc/i, theme: "cardiovasculaire", signe: "douleur thoracique, dyspnée ou hypotension" },
    { key: /pédiatr|pcimne|néonat/i, theme: "pédiatrique", signe: "fièvre, refus de téter ou léthargie" },
    { key: /obst|gyn|postnat|ventouse|amiu|sonu/i, theme: "obstétrical", signe: "saignement, douleur intense ou fièvre" },
    { key: /psy|substance|adolescent|violence/i, theme: "psychosocial", signe: "agitation, isolement ou propos inquiétants" },
    { key: /hygiène|vaccin|injection|bio/i, theme: "prévention", signe: "risque d'infection ou de transmission croisée" },
    { key: /imagerie|radiologie|ophtal|orl|stomato/i, theme: "exploration spécialisée", signe: "douleur, trouble fonctionnel ou résultat anormal" },
    { key: /gériatr|palliatif/i, theme: "prise en charge de la personne vulnérable", signe: "douleur, confusion ou perte d'autonomie" },
    { key: /gestion|gouvernance|supervision|qualité|projet/i, theme: "organisation des soins", signe: "défaut de coordination ou rupture de continuité" }
  ];

  function profilSubject(subject) {
    for (const item of themesParMotCle) {
      if (item.key.test(subject)) return item;
    }
    return { theme: "soins infirmiers et obstétricaux", signe: "signe clinique inhabituel ou plainte du patient" };
  }

  function makeQCM(id, subject, topic, n) {
    const profil = profilSubject(subject);
    const contexte = contextes[(n + topic.length + subject.length) % contextes.length];
    const bonne = bonnesActions[n % bonnesActions.length];
    const distracteurs = [
      mauvaisesActions[n % mauvaisesActions.length],
      mauvaisesActions[(n + 2) % mauvaisesActions.length],
      mauvaisesActions[(n + 4) % mauvaisesActions.length]
    ];
    return {
      id,
      level,
      subject,
      topic,
      type: "mcq",
      question: "En " + subject + ", devant " + contexte + ", quelle conduite est la plus adaptée au niveau A2 ?",
      choices: [bonne, distracteurs[0], distracteurs[1], distracteurs[2]],
      answerIndex: 0,
      explanation: "Au niveau A2, la réponse attendue associe évaluation, sécurité, respect du protocole, communication et transmission. Le thème concerné est " + profil.theme + "."
    };
  }

  function makeQCD(id, subject, topic, n) {
    const profil = profilSubject(subject);
    const contexte = contextes[(n * 2 + subject.length) % contextes.length];
    return {
      id,
      level,
      subject,
      topic,
      type: "mcq_multi",
      question: "QCD - En " + subject + ", concernant " + contexte + ", quelles propositions sont exactes ?",
      choices: [
        "Rechercher les signes d'alerte comme " + profil.signe,
        "Respecter l'hygiène, la sécurité et la confidentialité du patient",
        "Transmettre rapidement une anomalie au responsable ou au référent",
        "Attendre systématiquement sans surveiller si le patient paraît calme",
        "Réaliser un acte hors compétence sans prescription ni protocole"
      ],
      answerIndices: [0, 1, 2],
      explanation: "Les propositions exactes sont celles qui renforcent la surveillance, la sécurité, l'hygiène, la confidentialité et la transmission. Les actes hors compétence ou l'absence de surveillance sont incorrects."
    };
  }

  let added = 0;
  const missingTopics = [];

  for (const subject of subjects) {
    const subjectTopics = window.SUJETS_PAR_MATIERE_QUIZ && Array.isArray(window.SUJETS_PAR_MATIERE_QUIZ[subject])
      ? window.SUJETS_PAR_MATIERE_QUIZ[subject]
      : defaultTopics;
    const topics = subjectTopics.length ? subjectTopics : defaultTopics;
    const subjectSlug = slugify(subject);

    for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
      const topic = topics[topicIndex];
      if (topicHasQuestions(subject, topic)) continue;
      missingTopics.push(subject + " / " + topic);

      for (let i = 1; i <= questionsPerTopic; i++) {
        const id = "a2-complement-" + subjectSlug + "-s" + (topicIndex + 1) + "-q" + i;
        // Environ 70% QCM et 30% QCD.
        const q = (i % 10 === 0 || i % 10 === 3 || i % 10 === 6)
          ? makeQCD(id, subject, topic, i)
          : makeQCM(id, subject, topic, i);
        pushUnique(q);
        added++;
      }
    }
  }

  window.A2_NIVEAU_MOYEN_COMPLEMENT_RAPPORT = {
    level,
    subjects: subjects.length,
    missingTopics: missingTopics.length,
    questionsAdded: added,
    questionsPerEmptyTopic: questionsPerTopic,
    types: "QCM + QCD"
  };
})();

