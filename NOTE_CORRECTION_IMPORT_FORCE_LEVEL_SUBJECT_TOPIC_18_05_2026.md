# Correction import questions — application automatique du choix validé

Date : 18/05/2026

Correction appliquée dans `app.js` :

- Le bouton **Ajouter ces questions au choix validé** force maintenant systématiquement les champs :
  - `level`
  - `subject`
  - `topic`
  - `category`
- Cette correction s'applique aux questions importées depuis un fichier `.js/.json/.txt` et aux tableaux JavaScript collés manuellement.
- Le contenu de la zone de saisie est réécrit après validation avec les champs corrigés, pour voir directement que les questions sont bien rattachées au niveau, à la matière et au sujet choisis.
- Les imports acceptent aussi les formats :
  - `[...]`
  - `const questions = [...]`
  - `let questions = [...]`
  - `var questions = [...]`
  - `window.NOM = [...]`
- Chaque question importée reçoit un nouvel identifiant unique pour éviter qu'un ancien `id` du fichier importé bloque ou remplace mal les questions.
- Après import, les listes de **Commencer un quiz** sont actualisées avec le niveau, la matière et le sujet concernés.
