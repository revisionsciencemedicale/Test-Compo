# Correction matières/sujets non visibles dans « Commencer un quiz »

Correction appliquée le 18/05/2026.

## Problème corrigé
Quand une nouvelle matière ou un nouveau sujet était ajouté dans :
`Paramètres administrateur > Gestion des quiz > Ajouter de nouvelles matières et de nouveaux sujets`,
la modification pouvait rester seulement dans l'écran administrateur sans être enregistrée immédiatement.

De plus, pour certains niveaux avec liste de matières imposée comme A1, L1 ou L2, la partie
`Commencer un quiz` ignorait les matières personnalisées ajoutées par l'administrateur.

## Corrections effectuées
- Enregistrement automatique immédiat après ajout d'un niveau.
- Enregistrement automatique immédiat après ajout d'une matière.
- Enregistrement automatique immédiat après ajout d'un sujet.
- Enregistrement automatique après retrait d'une matière.
- Mise à jour immédiate de `Commencer un quiz` après modification.
- Les matières ajoutées par l'administrateur sont maintenant incluses même pour les niveaux ayant une liste officielle limitée.

## Résultat attendu
Après ajout dans l'administration, la matière ou le sujet doit apparaître directement dans
`Commencer un quiz`, sans attendre un autre bouton de sauvegarde.

En ligne, l'enregistrement se fait dans la base PostgreSQL via `/api/admin/save-settings`.
En local, l'enregistrement reste dans le navigateur via `localStorage`.
