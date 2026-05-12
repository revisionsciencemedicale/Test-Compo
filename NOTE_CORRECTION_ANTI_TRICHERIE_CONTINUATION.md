# Correction anti-tricherie — continuation du quiz

Modifications appliquées :

- Le bouton **Anti changement d’onglet ou réduction** ne soumet plus automatiquement le quiz dès l’ouverture.
- La détection commence seulement après le début effectif du quiz, avec une petite marge pour éviter les faux positifs.
- Si une tentative est détectée, l’élève peut continuer le quiz.
- Les réponses données après la première tentative détectée ne sont plus prises en compte dans la note.
- Le résultat affiche le motif de la tentative de tricherie.
- Même principe appliqué à :
  - Recevoir notification/appel
  - Anti capture d’écran
  - Anti copier/coller

Note technique : un navigateur web ne peut pas bloquer toutes les captures d’écran du système, mais la touche Impr. écran et les actions de copie/collage détectables sont gérées.
