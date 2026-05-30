# Correction anti-ralentissement / anti-plantage

Modifications appliquées :
- Suppression du MutationObserver de l’interface dynamique pour éviter les boucles de rendu.
- Suppression des effets visuels lourds : arrière-plan radial fixe, color-mix répétés, animations sur toutes les cartes.
- Accordéons conservés en version légère.
- Thème selon niveau/matière conservé en version légère.
- Chargement du dictionnaire médical en différé : le gros fichier dictionnaire.medical.js n’est chargé que lorsqu’on ouvre le dictionnaire.

Objectif : garder l’interface dynamique sans surcharger l’ordinateur ni ralentir l’ouverture du site.
