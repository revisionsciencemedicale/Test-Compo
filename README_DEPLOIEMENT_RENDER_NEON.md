# Déploiement gratuit durable : Render + Neon PostgreSQL

Cette version est prévue pour :

- héberger l'application Node.js sur Render ;
- utiliser une base PostgreSQL Neon gratuite ;
- éviter la suppression automatique de la base Render gratuite après 30 jours ;
- empêcher deux appareils/navigateurs d'utiliser le même compte en même temps ;
- permettre à l'administrateur de voir les connexions, appareils, heures et compteurs.

## 1. Sites à utiliser

- GitHub : https://github.com
- Render : https://render.com
- Dashboard Render : https://dashboard.render.com
- Neon PostgreSQL : https://neon.com
- Console Neon : https://console.neon.tech

## 2. Créer la base PostgreSQL sur Neon

1. Va sur https://neon.com
2. Clique sur **Sign up** ou **Start for free**.
3. Connecte-toi, de préférence avec GitHub ou Google.
4. Clique sur **New Project**.
5. Donne un nom, par exemple : `revision-science-medicale`.
6. Choisis une région proche, par exemple Europe si disponible.
7. Crée le projet.
8. Dans le tableau de bord Neon, cherche **Connection string**.
9. Copie l'URL qui ressemble à ceci :

```text
postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require
```

Garde cette URL secrète. Elle donne accès à ta base de données.

## 3. Mettre le projet sur GitHub

1. Va sur https://github.com
2. Crée un nouveau dépôt, par exemple : `revision-science-medicale`
3. Décompresse cette archive ZIP.
4. Envoie tous les fichiers du dossier décompressé dans le dépôt GitHub.

Méthode simple :

1. Ouvre le dépôt GitHub.
2. Clique sur **Add file**.
3. Clique sur **Upload files**.
4. Glisse tous les fichiers du projet.
5. Clique sur **Commit changes**.

## 4. Déployer l'application sur Render

1. Va sur https://dashboard.render.com
2. Clique sur **New**.
3. Clique sur **Blueprint** si Render détecte `render.yaml`, ou **Web Service** si tu préfères configurer manuellement.
4. Connecte ton dépôt GitHub.
5. Sélectionne le dépôt du projet.
6. Vérifie les commandes :

```bash
npm install
```

et :

```bash
npm start
```

## 5. Ajouter DATABASE_URL dans Render

Dans ton service Render :

1. Va dans **Environment**.
2. Clique sur **Add Environment Variable**.
3. Ajoute :

```text
DATABASE_URL
```

4. Colle comme valeur l'URL copiée depuis Neon.
5. Ajoute aussi :

```text
PGSSLMODE=require
```

6. Clique sur **Save Changes**.
7. Clique sur **Manual Deploy** puis **Deploy latest commit**.

## 6. Ouvrir ton site

Quand le déploiement est terminé, Render donne un lien du type :

```text
https://revision-science-medicale.onrender.com
```

C'est ce lien qu'il faudra partager aux utilisateurs.

N'utilise plus `http://localhost:3000` sauf pour tester sur ton ordinateur.

## 7. Tester la session unique

1. Connecte-toi avec un compte sur un téléphone.
2. Essaie de te connecter avec le même compte sur un autre téléphone ou un autre navigateur.
3. La deuxième connexion doit être bloquée.
4. Déconnecte le premier appareil.
5. Réessaie sur le deuxième appareil.
6. La connexion doit maintenant être possible.

## 8. Voir les connexions côté administrateur

Connecte-toi avec un compte administrateur défini dans `codes.js`.

L'administrateur peut vérifier :

- les comptes connectés ;
- l'heure de connexion ;
- l'appareil ;
- le navigateur ;
- le nombre de connexions ;
- les tentatives bloquées.

## 9. Notes importantes

- Render gratuit peut se mettre en veille après une période d'inactivité. Le premier chargement peut donc être lent.
- Neon gratuit est plus adapté que la base gratuite Render pour garder les données plus longtemps.
- Ne partage jamais la variable `DATABASE_URL` publiquement.
- Ne mets jamais le mot de passe Neon dans GitHub directement.
