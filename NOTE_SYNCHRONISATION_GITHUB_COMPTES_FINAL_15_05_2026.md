# Synchronisation GitHub finale des comptes

Cette version sauvegarde les comptes créés depuis l'administration dans le fichier GitHub :

`server-data/app_users_store.json`

## Fonctionnement

- Quand un compte est créé, modifié, suspendu, réactivé ou supprimé, le serveur met à jour le fichier local `server-data/app_users_store.json`.
- Si les variables GitHub sont configurées sur le serveur, ce fichier est automatiquement envoyé dans le dépôt GitHub.
- À chaque démarrage du serveur et lors des visites/API, le serveur vérifie GitHub périodiquement pour récupérer la dernière version des comptes.
- Dans l'administration, onglet **Technique**, trois boutons ont été ajoutés :
  - **Récupérer les comptes depuis GitHub**
  - **Envoyer les comptes vers GitHub**
  - **Vérifier la configuration GitHub**

## Variables d'environnement à mettre sur Render ou ton serveur Node.js

```env
GITHUB_TOKEN=ton_token_github
GITHUB_REPO=ton_nom_utilisateur/nom_du_depot
GITHUB_BRANCH=main
GITHUB_USERS_PATH=server-data/app_users_store.json
```

Important : ne mets jamais le token GitHub dans `app.js`, `index.html` ou un fichier public du site.

## Attention GitHub Pages

GitHub Pages seul ne peut pas modifier un fichier JSON, car c'est un hébergement statique. Pour que la sauvegarde fonctionne, le site doit passer par le serveur Node.js fourni dans ce ZIP, par exemple sur Render.
