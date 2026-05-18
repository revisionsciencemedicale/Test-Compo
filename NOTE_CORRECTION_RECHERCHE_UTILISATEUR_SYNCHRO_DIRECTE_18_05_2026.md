# Correction directe — Rechercher utilisateur et comptes connectés

Corrections appliquées directement dans les fichiers :

- Ajout de l’API `/api/admin/all-users` dans `server.js`.
- Cette API fusionne les comptes venant de :
  - `codes.js`
  - PostgreSQL `app_users`
  - `server-data/app_users_store.json`
- La recherche utilisateur recharge maintenant cette liste complète depuis le serveur.
- Ajout d’un bouton `Actualiser les comptes` dans `Rechercher utilisateur`.
- Les utilisateurs connectés sont lus depuis `active_sessions`.
- Après création d’un compte, la liste est rechargée depuis le serveur.
- Correction du risque de doublon entre PostgreSQL, JSON serveur et anciens comptes.

Résultat attendu :

- Les anciens comptes s’affichent.
- Les nouveaux comptes créés sur le site s’affichent.
- Les comptes sauvegardés localement côté serveur s’affichent.
- Le bouton Déconnexion reste disponible devant Suspendre.
- L’état En ligne/Hors ligne est récupéré depuis le serveur.
