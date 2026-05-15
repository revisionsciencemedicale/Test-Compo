# Synchronisation des comptes avec GitHub

Cette version ajoute une sauvegarde serveur des comptes dans un fichier JSON du dépôt GitHub.

## Important
GitHub Pages seul ne peut pas enregistrer directement des comptes, car c'est un hébergement statique. Pour que la sauvegarde fonctionne, le site doit passer par le serveur Node.js fourni dans `server.js` (par exemple sur Render, Railway, VPS, etc.).

## Variables à ajouter sur le serveur
Dans les variables d'environnement de l'hébergeur :

```env
GITHUB_TOKEN=token_github_avec_droit_contents_read_write
GITHUB_REPO=utilisateur/nom-du-depot
GITHUB_BRANCH=main
GITHUB_USERS_PATH=server-data/app_users_store.json
```

## Fonctionnement
- Quand un compte est créé, modifié, suspendu, réactivé ou supprimé, le serveur met à jour `server-data/app_users_store.json`.
- Le fichier est ensuite envoyé automatiquement dans le dépôt GitHub.
- À chaque ouverture du panneau administrateur, le serveur relit périodiquement le fichier GitHub pour récupérer les comptes sauvegardés.
- Le navigateur conserve aussi un cache local pour éviter un affichage vide en cas de réseau faible.

## Sécurité
Ne jamais mettre `GITHUB_TOKEN` dans `index.html`, `app.js`, GitHub Pages ou le navigateur. Le token doit rester uniquement dans les variables d'environnement du serveur Node.js.
