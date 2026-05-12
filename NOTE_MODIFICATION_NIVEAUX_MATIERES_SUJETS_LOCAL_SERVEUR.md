# Modification niveaux / matières / sujets

Modifications effectuées dans **Paramètres administrateur > Gestion des quiz > Ajouter de nouvelles matières et de nouveaux sujets** :

- Ajout d’un bouton/liste **Niveau** avec un bouton **+** pour créer un nouveau niveau.
- Ajout d’un bloc **Matières** avec 3 sous-boutons :
  - **Liste des matières** : liste déroulante selon le niveau choisi + bouton **+** pour ajouter une matière.
  - **Retirer une matière** : liste déroulante selon le niveau choisi + bouton de retrait.
  - **Sujet** : liste déroulante des sujets selon le niveau et la matière + bouton **+** pour ajouter un sujet.
- Les modifications sont enregistrées dans `appSettings.customCatalog`.
- En ligne avec PostgreSQL/Render : les modifications sont sauvegardées via `/api/admin/save-settings`.
- En local sans base connectée : les modifications restent appliquées via `localStorage`, comme les autres paramètres locaux.
- Les niveaux/matières/sujets ajoutés sont intégrés aux listes utilisées au démarrage du quiz.
