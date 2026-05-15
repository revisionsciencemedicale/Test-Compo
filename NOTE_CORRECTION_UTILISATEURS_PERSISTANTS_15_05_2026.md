# Correction utilisateurs persistants — 15/05/2026

Problème corrigé : après plusieurs jours de déploiement, les boutons administrateur pouvaient afficher une liste vide alors que les comptes existaient.

Corrections appliquées :

1. **Rechercher utilisateur**
   - La liste affiche maintenant tous les comptes existants :
     - comptes présents dans `codes.js` ;
     - comptes créés depuis le site et enregistrés dans la base de données.
   - La recherche fonctionne sur l’identifiant, le nom, le prénom, le téléphone et les niveaux.

2. **Utilisateurs connectés en temps réel**
   - Les sessions restent affichées depuis la base lorsque le serveur répond.
   - Si le serveur répond mal ou lentement, le panneau utilise le dernier affichage sauvegardé dans le navigateur au lieu d’afficher directement une liste vide.

3. **Journal d’activité**
   - Le journal continue de charger les données de la base.
   - Un cache local de secours garde le dernier affichage disponible pour éviter un panneau vide en cas de lenteur ou coupure temporaire.

4. **Sauvegarde locale de secours**
   - Ajout de `quizRevision.adminCache.v1` dans `localStorage`.
   - À chaque chargement réussi du panneau admin, les utilisateurs, sessions et logs sont sauvegardés localement.

Fichiers modifiés :
- `app.js`
- `server.js`
