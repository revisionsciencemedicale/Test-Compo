# Correction listes déroulantes + rapidité — 30/05/2026

Corrections appliquées sans casser le code :

- Les listes déroulantes de `Commencer un quiz` sont forcées visibles et cliquables : niveau, matière, sujet.
- Ajout d’une sécurité si un compte local reste connecté sans configuration serveur : le niveau local A1 est utilisé par défaut pour éviter les menus vides.
- Les comptes retrouvés dans le cache administrateur sont réinjectés automatiquement dans `window.USERS` afin que leur niveau, matières et sujets restent disponibles localement.
- Les matières et sujets sont recalculés après changement du niveau ou de la matière.
- Optimisation de la banque de questions avec cache léger pour éviter de renormaliser toutes les questions à chaque affichage.
- Optimisation de la synthèse des questions : elle ne se recalcule pas inutilement quand son panneau est fermé.
- Le contrôle automatique de la synthèse est allégé pour rendre l’interface plus rapide.
