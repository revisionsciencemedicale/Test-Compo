# Correction affichage des sujets dans l'administration

Correction appliquée dans `app.js`.

## Problème corrigé
Dans la partie **Paramètres administrateur > Ajouter de nouvelles matières et de nouveaux sujets**, lorsque l'on clique sur le sous-bouton **Sujet**, la liste déroulante des sujets pouvait ne pas afficher les sujets attendus.

## Cause
La liste des sujets pouvait être calculée avec le niveau actuellement choisi dans **Commencer un quiz**, au lieu du niveau choisi dans l'espace d'administration.

## Correction
La liste déroulante **Sujet selon le niveau et la matière choisis** est maintenant alimentée avec :

- le niveau sélectionné dans l'administration ;
- la matière sélectionnée dans l'administration ;
- les sujets déjà enregistrés dans le catalogue personnalisé ;
- les sujets trouvés dans la banque de questions pour ce niveau et cette matière.

Quand on clique sur le sous-bouton **Sujet**, la liste est aussi recalculée automatiquement.
