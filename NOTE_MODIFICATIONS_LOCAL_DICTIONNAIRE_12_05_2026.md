# Modifications du 12/05/2026

## Paramètres applicables en local
- Le serveur peut maintenant démarrer même sans `DATABASE_URL`.
- En mode local sans PostgreSQL, les paramètres administrateur sont enregistrés dans le navigateur via `localStorage`.
- Les paramètres sauvegardés localement s’appliquent immédiatement aux quiz pour faciliter les tests et vérifications.
- Un message indique clairement que le partage en ligne nécessite PostgreSQL/Render.

## Dictionnaire médical
- Toutes les définitions contenant encore `expression médicale` ont été remplacées par un genre : `nom masculin`, `nom féminin`, `expression masculine` ou `expression féminine` selon le terme.
- Les anciennes entrées qui ne commençaient pas par un genre/type ont été harmonisées.
- Ajout de 526 nouveaux mots et expressions ciblés en traumatologie, chirurgie digestive, cancérologie et urologie.
- Exemples ajoutés : Hémarthrose, Arthrite du genou, Pseudarthrose, Cal vicieux, Fracture ouverte, Syndrome des loges, Hémopéritoine, Cancer colorectal, Cancer de la prostate, Hématurie macroscopique, Rétention aiguë d’urine, Colique néphrétique, etc.
- Les doublons ont été évités par comparaison normalisée des termes.

## Gestion des quiz
- Les sous-boutons de Gestion des quiz affichent maintenant correctement leurs contenus séparés.
