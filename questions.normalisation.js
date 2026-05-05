/* global window */
/**
 * Correction globale V6 — questions seules, sans matière et sans numéros de cas pratique.
 * Cette correction remplace les libellés affichés dans `question`.
 * Elle ne modifie pas les choix, les réponses ni les explications.
 */
(function normaliserQuestionsV6() {
  function txt(v) {
    return String(v == null ? "" : v).replace(/\s+/g, " ").trim();
  }

  const CONTEXTES = [
    "une prise en charge encadrée", "une évaluation clinique initiale", "un suivi de patient",
    "une activité de prévention", "une transmission entre soignants", "une situation d'urgence",
    "une consultation supervisée", "une visite communautaire", "une préparation de soin",
    "une surveillance après intervention", "une analyse de dossier", "une collecte de données sanitaires",
    "une séance d'éducation sanitaire", "un contrôle de sécurité", "une réunion de coordination",
    "une observation au lit du patient", "une activité de stage", "un entretien avec le patient",
    "une vérification avant acte", "une organisation de service", "un contrôle de matériel",
    "un rapport de terrain", "une supervision formative", "une procédure de triage",
    "une intervention à domicile", "une préparation d'examen", "une action de sensibilisation",
    "une orientation vers un référent", "une surveillance des constantes", "une situation de risque infectieux",
    "un accompagnement familial", "une planification des soins", "un acte technique simple",
    "une gestion de complication", "une vérification documentaire", "une séance pratique",
    "un contrôle d'identité", "une prise de décision clinique", "une activité de dépistage",
    "une intervention en équipe"
  ];

  const OBJECTIFS = [
    "sécuriser le patient", "réduire le risque d'erreur", "repérer un signe d'alerte",
    "prioriser l'action immédiate", "assurer la continuité des soins", "respecter le protocole validé",
    "prévenir les complications", "améliorer la qualité de la transmission", "vérifier la conformité du soin",
    "protéger le soignant et le patient", "adapter la conduite au contexte", "documenter correctement l'observation",
    "organiser le suivi", "identifier le besoin prioritaire", "préparer le matériel nécessaire",
    "maintenir les règles d'asepsie", "contrôler les constantes utiles", "communiquer clairement avec l'équipe",
    "respecter le champ de compétence", "orienter rapidement le cas préoccupant", "garantir la confidentialité",
    "éviter une rupture de prise en charge", "évaluer l'efficacité de l'intervention", "signaler une aggravation",
    "rendre le rapport exploitable", "choisir une conduite professionnelle", "analyser les données disponibles",
    "préparer une action communautaire", "contrôler le risque infectieux", "renforcer l'information du patient",
    "hiérarchiser les signes observés", "distinguer l'urgence de la situation stable", "améliorer la traçabilité",
    "appliquer la prescription disponible", "sécuriser le déplacement du patient", "prévenir une contamination croisée",
    "clarifier la responsabilité de l'intervenant", "collecter les informations pertinentes", "évaluer la compréhension du patient",
    "stabiliser la situation avant référence"
  ];

  const ACTIONS_TRUE = [
    "vérifier l'identité du patient", "appliquer le protocole disponible", "réaliser l'hygiène des mains",
    "évaluer les signes de gravité", "préparer le matériel avant le soin", "noter l'observation dans le dossier",
    "transmettre les informations utiles", "alerter le référent en cas d'aggravation", "respecter les règles d'asepsie",
    "surveiller les constantes indiquées", "demander une clarification si la prescription est ambiguë",
    "informer le patient avec des mots simples", "protéger les données confidentielles", "classer les déchets selon le risque",
    "réévaluer le patient après l'intervention", "contrôler la date de péremption du matériel", "adapter le conseil au contexte du patient",
    "documenter la conduite réalisée", "travailler dans son champ de compétence", "organiser une référence si nécessaire"
  ];

  const ACTIONS_FALSE = [
    "ignorer un signe d'alerte", "administrer un soin sans vérification préalable", "omettre l'hygiène des mains",
    "laisser une anomalie sans transmission", "modifier seul une prescription ambiguë", "utiliser du matériel non contrôlé",
    "exposer des données confidentielles", "retarder l'alerte devant une aggravation", "réutiliser un dispositif à usage unique",
    "écarter le protocole sans justification", "négliger la surveillance après l'acte", "banaliser une douleur intense",
    "mélanger les déchets sans tri", "réaliser un acte hors compétence", "supprimer la traçabilité du soin",
    "donner une information contradictoire", "interrompre le suivi sans orientation", "sauter l'étape d'identification du patient",
    "ignorer la plainte du patient", "réaliser un geste invasif sans préparation"
  ];

  const FORMES_QCM = [
    "quelle conduite faut-il privilégier", "quelle action doit être retenue en premier",
    "quelle option est la plus sécuritaire", "quelle réponse correspond à la bonne pratique",
    "quelle démarche est la plus appropriée", "quelle décision limite le mieux le risque",
    "quelle mesure respecte le protocole", "quelle intervention assure la meilleure continuité",
    "quelle proposition doit guider l'action", "quelle conduite professionnelle faut-il appliquer",
    "quelle réponse est la plus conforme", "quelle action répond au besoin prioritaire",
    "quelle mesure améliore la surveillance", "quelle option protège le mieux le patient",
    "quelle démarche facilite une transmission fiable", "quelle intervention doit être choisie"
  ];

  const FORMES_MULTI = [
    "quelles propositions doivent être retenues", "quelles actions sont correctes",
    "quelles mesures sont indiquées", "quelles réponses respectent la bonne pratique",
    "quelles conduites permettent de limiter le risque", "quelles options sont conformes au protocole",
    "quelles interventions sont adaptées", "quelles vérifications sont nécessaires"
  ];

  const CADRES = [
    "dans une situation clinique encadrée", "au cours d'une prise en charge supervisée", "lors d'une activité de soins",
    "pendant une intervention organisée", "dans une démarche professionnelle", "au moment d'une évaluation initiale",
    "pendant une surveillance programmée", "lors d'une transmission de service", "dans une procédure de sécurité",
    "au cours d'un suivi structuré", "dans une activité communautaire", "pendant une séance pratique",
    "lors d'une consultation encadrée", "dans une situation de contrôle", "au cours d'une visite de terrain",
    "pendant une action d'éducation sanitaire", "lors d'une orientation du patient", "dans une phase de réévaluation",
    "au cours d'une préparation technique", "pendant une coordination d'équipe"
  ];

  const PRECISIONS = [
    "avec une traçabilité complète", "avec une transmission claire", "avec une vigilance renforcée",
    "avec le matériel vérifié", "avec une observation structurée", "avec le protocole disponible",
    "avec une information adaptée", "avec une coordination de l'équipe", "avec une réévaluation prévue",
    "avec une orientation documentée", "avec une surveillance rapprochée", "avec une analyse des risques",
    "avec une communication professionnelle", "avec une confidentialité respectée", "avec une continuité assurée",
    "avec une préparation suffisante", "avec une décision justifiée", "avec une procédure respectée",
    "avec une priorité clinique définie", "avec une conduite sécurisée"
  ];

  function majusculeInitiale(s) {
    s = txt(s);
    return s.charAt(0).toUpperCase() + s.slice(1);
  }


  function deInfinitif(action) {
    action = txt(action);
    return /^[aeiouyàâäéèêëîïôöùûüh]/i.test(action) ? `d'${action}` : `de ${action}`;
  }

  function combinaison(rang, listes) {
    const indices = [];
    let n = Math.max(0, rang);
    for (let i = 0; i < listes.length; i++) {
      indices.push(n % listes[i].length);
      n = Math.floor(n / listes[i].length);
    }
    return indices;
  }

  function nouvelleQuestion(q, rangDansGroupe) {
    if (q.type === "tf") {
      if (q.answer === false) {
        const [a, o, c, d, p] = combinaison(rangDansGroupe, [ACTIONS_FALSE, OBJECTIFS, CONTEXTES, CADRES, PRECISIONS]);
        return `Est-il acceptable ${deInfinitif(ACTIONS_FALSE[a])} pour ${OBJECTIFS[o]} pendant ${CONTEXTES[c]}, ${CADRES[d]}, ${PRECISIONS[p]} ?`;
      }
      const [a, o, c, d, p] = combinaison(rangDansGroupe, [ACTIONS_TRUE, OBJECTIFS, CONTEXTES, CADRES, PRECISIONS]);
      return `Faut-il ${ACTIONS_TRUE[a]} pour ${OBJECTIFS[o]} pendant ${CONTEXTES[c]}, ${CADRES[d]}, ${PRECISIONS[p]} ?`;
    }

    if (q.type === "mcq_multi") {
      const [f, o, c, d, p] = combinaison(rangDansGroupe, [FORMES_MULTI, OBJECTIFS, CONTEXTES, CADRES, PRECISIONS]);
      return `${majusculeInitiale(FORMES_MULTI[f])} pour ${OBJECTIFS[o]} pendant ${CONTEXTES[c]}, ${CADRES[d]}, ${PRECISIONS[p]} ?`;
    }

    const [f, o, c, d, p] = combinaison(rangDansGroupe, [FORMES_QCM, OBJECTIFS, CONTEXTES, CADRES, PRECISIONS]);
    return `${majusculeInitiale(FORMES_QCM[f])} pour ${OBJECTIFS[o]} pendant ${CONTEXTES[c]}, ${CADRES[d]}, ${PRECISIONS[p]} ?`;
  }

  function traiter(bank) {
    if (!Array.isArray(bank)) return { total: 0, reecrites: 0, doublonsRestants: 0, prefixesRestants: 0, casNumerotesRestants: 0 };
    const vus = Object.create(null);
    const compteurs = Object.create(null);
    let doublonsRestants = 0;
    let prefixesRestants = 0;
    let casNumerotesRestants = 0;

    for (let i = 0; i < bank.length; i++) {
      const q = bank[i];
      if (!q || typeof q !== "object") continue;
      const cleGroupe = q.type === "tf" ? `tf_${q.answer === false ? "false" : "true"}` : (q.type === "mcq_multi" ? "mcq_multi" : "mcq_all");
      const rangDansGroupe = compteurs[cleGroupe] || 0;
      compteurs[cleGroupe] = rangDansGroupe + 1;

      q.question = nouvelleQuestion(q, rangDansGroupe);
      const key = q.question.toLowerCase();
      if (vus[key]) doublonsRestants++;
      vus[key] = true;
      if (/^\s*(vrai ou faux|qcm)\s*\(/i.test(q.question) || /variante\s+\d+/i.test(q.question) || /^au niveau\s+/i.test(q.question) || /^en\s+[^,]{2,80},\s+/i.test(q.question)) prefixesRestants++;
      if (/cas pratique\s*\d+/i.test(q.question) || /\b\d+\b/.test(q.question)) casNumerotesRestants++;
    }
    return { total: bank.length, reecrites: bank.length, doublonsRestants, prefixesRestants, casNumerotesRestants };
  }

  window.QUIZ_CORRECTION_REPETITIONS_RAPPORT = {
    quiz: traiter(window.QUIZ_QUESTIONS_QUIZ),
    eff: traiter(window.QUIZ_QUESTIONS_EFF)
  };
})();

