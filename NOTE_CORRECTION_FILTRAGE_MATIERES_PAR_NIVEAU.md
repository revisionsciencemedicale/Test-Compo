# Correction filtrage des matières par niveau

Correction appliquée dans `app.js` :

- Les utilisateurs du niveau `A1-Base Santé` voient uniquement les matières liées à `A1-Base Santé`.
- Les utilisateurs du niveau `L1-Niveau Émergent` voient uniquement les matières liées à `L1-Niveau Émergent`.
- Les utilisateurs du niveau `L2-Niveau Ascendant` voient uniquement les matières liées à `L2-Niveau Ascendant`.
- Le filtrage est appliqué aux comptes créés localement et aux comptes créés sur le serveur, car il se base sur la configuration du compte connecté.
- Les sujets visibles sont aussi limités au niveau sélectionné pour éviter de mélanger les questions d’un autre niveau ayant la même matière.
- Les niveaux `INF/SAG-M` et `AUXI` restent exclus du bouton `Quiz` et réservés à `Examen de fin de Formation`.
