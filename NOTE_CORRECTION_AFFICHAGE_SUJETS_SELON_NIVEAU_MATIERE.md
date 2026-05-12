# Correction affichage des sujets dans "Commencer un quiz"

Correction appliquée dans `app.js` :

- La liste déroulante **Sujet (thème)** est maintenant recalculée après le choix du **niveau** et de la **matière**.
- Les sujets sont récupérés selon :
  1. les questions du niveau sélectionné ;
  2. les sujets ajoutés dans l'administration ;
  3. le fichier `sujets.js` ;
  4. une liste de secours `Sujet 1` à `Sujet 5` si la matière autorisée n'a pas encore de questions.
- La correction s'applique aux comptes locaux et aux comptes créés en ligne.
- Les niveaux `INF/SAG-M` et `AUXI` restent réservés à l'Examen de fin de Formation.
