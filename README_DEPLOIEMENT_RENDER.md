# Mise en ligne Render + PostgreSQL

Cette version utilise PostgreSQL pour enregistrer :

- les sessions actives ;
- les connexions refusées quand un compte est déjà connecté ;
- l'historique des connexions et activités ;
- les appareils, navigateurs, heures et nombre de connexions par compte.

## Déploiement rapide avec `render.yaml`

1. Mets ce dossier sur GitHub.
2. Sur Render, clique **New +** puis **Blueprint**.
3. Choisis le dépôt GitHub.
4. Render détectera `render.yaml` et créera :
   - un Web Service Node.js ;
   - une base PostgreSQL ;
   - la variable `DATABASE_URL` automatiquement.
5. Clique **Apply** puis attends le déploiement.

## Déploiement manuel

1. Sur Render, crée une base **PostgreSQL**.
2. Crée un **Web Service** connecté au dépôt GitHub.
3. Configure :
   - Build Command : `npm install`
   - Start Command : `npm start`
4. Ajoute les variables d'environnement :
   - `DATABASE_URL` : l'External/Internal Database URL fournie par Render ;
   - `SESSION_TIMEOUT_MS` : `0` pour désactiver l’expiration automatique des sessions.

## Utilisation

Après mise en ligne, utilise uniquement l'URL Render, par exemple :

`https://ton-application.onrender.com`

Tu n'utiliseras plus `http://localhost:3000`, sauf pour tester sur ton ordinateur.

## Session unique par compte

Quand un compte est déjà connecté :

- la première session reste active ;
- une connexion depuis un autre téléphone, navigateur ou ordinateur est refusée ;
- l'événement est enregistré dans l'historique admin.

Les sessions ne sont plus libérées automatiquement pour inactivité. Elles restent actives jusqu’à une déconnexion volontaire ou une déconnexion forcée par un administrateur.

## Administration

Les administrateurs sont définis dans `codes.js` :

```js
window.ADMINS = ["tirbuce", "paterne", "brice"];
```

Dans l'interface admin, tu peux voir :

- les comptes actuellement en ligne ;
- l'heure de connexion ;
- la dernière activité ;
- l'appareil et le navigateur ;
- le nombre de connexions par compte ;
- l'historique détaillé.
