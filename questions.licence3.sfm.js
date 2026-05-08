/**
 * Génère automatiquement les questions de L3-Niveau Accompli SF:
 * - 34 matières
 * - 6 sujets par matière
 * - 50 questions par sujet
 */
(function addLicence3SFMQuestions() {
  if (!Array.isArray(window.QUIZ_QUESTIONS_QUIZ)) return;

  const level = "L3-Niveau Accompli SF";
  const subjects = [
    "Pathologies gynécologiques III",
    "Pathologies obstétricales III",
    "Hygiène menstruelle",
    "Violences Basées sur Genre / Encadrement (Egalité - Equité)",
    "Santé sexuelle et reproductive des adolescents et des jeunes / Planification Familiale / IST / VIH-SIDA",
    "Imagerie médicale",
    "Documents normatifs",
    "Gestion des catastrophes",
    "Gouvernance et Organisation du Système de Santé Communautaire",
    "Organisation d’une séance de Vaccination / Sécurité des injections",
    "Psychiatrie",
    "Pédiatrie (PCIMNE)",
    "Soins obstétricaux et néonataux d’urgence de base (SONUB)",
    "Soins obstétricaux et néonataux d’urgence complets (SONUC)",
    "Présentation de cas cliniques",
    "Processus de mise en Stages",
    "Stage en soins infirmiers et Obstétricaux",
    "Droit administratif / Responsabilité médicale",
    "Sécurité sociale",
    "Fonction publique",
    "Supervision / Suivi - Evaluation",
    "Gestion Hospitalière / Rédaction Administrative",
    "Entrepreneuriat / Gestion de la qualité",
    "Soins infirmiers obstétricaux et néonataux",
    "Consultation Postnatale (CPoN)",
    "Ventouse obstétricale",
    "Aspiration Manuelle Intra-Utérine (AMIU) / Soins Post Avortement",
    "Prise en charge des substances psychoactives",
    "Gériatrie",
    "Soins palliatifs",
    "Analyse des données qualitatives et quantitatives",
    "Rédaction de Mémoire",
    "Stages en soins infirmiers et obstétricaux + Rapport",
    "Stage communautaire + Rapport",
  ];
  const topics = ["Sujet 1", "Sujet 2", "Sujet 3", "Sujet 4", "Sujet 5", "Sujet 6"];
  const questionsPerTopic = 50;
  const prefix = "l3sfm26";

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
      question: "La bonne application des protocoles améliore la sécurité et la qualité des soins.",
      answer: true,
      explanation:
        "L'application standardisée des protocoles réduit les erreurs et améliore la qualité des soins obstétricaux, néonataux et infirmiers.",
    };
  }

  function makeMCQ(id, subject, topic) {
    return {
      id,
      level,
      subject,
      topic,
      type: "mcq",
      question: "Quelle est la meilleure conduite initiale devant un risque clinique en pratique SFM ?",
      choices: [
        "Évaluer la situation, sécuriser la patiente/le patient et suivre le protocole",
        "Attendre sans intervenir",
        "Donner un traitement hors protocole",
        "Ignorer les signes d'alerte",
      ],
      answerIndex: 0,
      explanation:
        "La priorité est l'évaluation clinique, la sécurité et l'application du protocole de prise en charge.",
    };
  }

  for (const subject of subjects) {
    const subjectSlug = slugify(subject);
    for (let topicIndex = 0; topicIndex < topics.length; topicIndex++) {
      const topic = topics[topicIndex];
      for (let i = 1; i <= questionsPerTopic; i++) {
        const id = prefix + "-" + subjectSlug + "-s" + (topicIndex + 1) + "-q" + i;
        const isTF = i % 2 === 0;
        pushUnique(isTF ? makeTF(id, subject, topic) : makeMCQ(id, subject, topic));
      }
    }
  }
})();
