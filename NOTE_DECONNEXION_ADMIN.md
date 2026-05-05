# Correction : déconnexion forcée par administrateur

Cette version ajoute une déconnexion forcée fiable côté serveur.

## Fonctionnement

- L'administrateur ouvre l'espace **Admin**.
- Dans **Comptes actuellement en ligne**, il clique sur **Déconnecter**.
- Le serveur supprime la session active de l'utilisateur et révoque son jeton de session.
- Le navigateur de l'utilisateur vérifie la session toutes les 5 secondes via `/api/check-session`.
- Si la session a été révoquée, le navigateur supprime `localStorage` / `sessionStorage` et renvoie l'utilisateur vers la connexion.

## Important après déploiement

Après avoir remplacé les fichiers sur GitHub / Render, il faut redéployer le site.
La base Neon/PostgreSQL créera automatiquement les tables nécessaires :

- `active_sessions`
- `login_logs`
- `revoked_sessions`
- `force_logout_requests`

## Test conseillé

1. Connecte un compte étudiant dans un autre navigateur ou téléphone.
2. Connecte-toi avec un compte admin.
3. Va dans **Admin**.
4. Clique sur **Déconnecter** devant le compte étudiant.
5. Dans les 5 secondes, le compte étudiant doit être renvoyé à l'écran de connexion.
