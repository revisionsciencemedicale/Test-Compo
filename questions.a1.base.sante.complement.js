/* global window */
/**
 * Complément A1-Base Santé
 * Objectif: ajouter automatiquement des questions aux matières/sujets A1 qui existent
 * dans la liste des matières mais qui n'ont pas encore de questions.
 * Modèle utilisé: 6 sujets par matière, 50 questions par sujet, types QCM/Vrai-Faux.
 */
(function addA1BaseSanteComplementQuestions() {
  if (!Array.isArray(window.QUIZ_QUESTIONS_QUIZ)) return;

  const level = "A1-Base Santé";
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

  function makeMCQ(id, subject, topic, n) {
    const situations = [
      "l'évaluation initiale du patient",
      "la prévention des infections",
      "la surveillance des constantes",
      "la préparation du matériel",
      "la transmission à l'équipe",
      "l'éducation sanitaire",
      "la sécurité du soin",
      "l'orientation vers le référent",
      "la traçabilité dans le dossier",
      "le respect du protocole"
    ];
    const situation = situations[n % situations.length];
    return {
      id,
      level,
      subject,
      topic,
      type: "mcq",
      question: "Dans cette matière, quelle conduite est la plus correcte concernant " + situation + " ?",
      choices: [
        "Évaluer la situation, sécuriser le patient et appliquer le protocole",
        "Agir sans vérifier l'identité du patient",
        "Ignorer les signes d'alerte",
        "Reporter la transmission des informations importantes"
      ],
      answerIndex: 0,
      explanation: "La conduite attendue est d'évaluer, de sécuriser, d'appliquer le protocole et de transmettre les informations utiles."
    };
  }

  function makeTF(id, subject, topic, n) {
    const propositions = [
      "L'hygiène des mains réduit le risque de transmission croisée.",
      "La vérification de l'identité du patient est nécessaire avant un soin.",
      "Un signe de gravité doit être transmis rapidement au référent.",
      "La traçabilité permet d'assurer la continuité des soins.",
      "Le matériel doit être contrôlé avant son utilisation."
    ];
    return {
      id,
      level,
      subject,
      topic,
      type: "tf",
      question: propositions[n % propositions.length],
      answer: true,
      explanation: "Cette proposition correspond aux règles de base de sécurité, de qualité et de continuité des soins."
    };
  }

  let added = 0;
  for (const subject of subjects) {
    const subjectTopics = window.SUJETS_PAR_MATIERE_QUIZ && Array.isArray(window.SUJETS_PAR_MATIERE_QUIZ[subject])
      ? window.SUJETS_PAR_MATIERE_QUIZ[subject]
      : defaultTopics;
    const topics = subjectTopics.length ? subjectTopics : defaultTopics;
    const subjectSlug = slugify(subject);

    for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
      const topic = topics[topicIndex];
      if (topicHasQuestions(subject, topic)) continue;

      for (let i = 1; i <= questionsPerTopic; i++) {
        const id = "a1-base-complement-" + subjectSlug + "-s" + (topicIndex + 1) + "-q" + i;
        const q = i % 2 === 0
          ? makeTF(id, subject, topic, i)
          : makeMCQ(id, subject, topic, i);
        pushUnique(q);
        added++;
      }
    }
  }

  window.A1_BASE_SANTE_COMPLEMENT_RAPPORT = {
    level,
    subjects: subjects.length,
    questionsAdded: added,
    questionsPerEmptyTopic: questionsPerTopic
  };
})();

