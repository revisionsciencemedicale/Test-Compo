# Quiz Révision (site web simple)

Un petit site de quiz **hors-ligne** (HTML/CSS/JavaScript) pour réviser entre étudiants.

## Lancer le site

1. Ouvre le dossier `quiz-revision`
2. Double-clique sur `index.html` (ou clic droit → Ouvrir avec → Chrome/Firefox/Edge)

## Ajouter / modifier des questions

Ouvre `questions.js` et modifie le tableau `window.QUIZ_QUESTIONS`.

### Exemple QCM

```js
{
  id: "mon-id-1",
  category: "Ma matière",
  type: "mcq",
  question: "Ma question ?",
  choices: ["A", "B", "C", "D"],
  answerIndex: 2,
  explanation: "Pourquoi la réponse est C (optionnel).",
}
```

### Exemple Vrai/Faux

```js
{
  id: "mon-id-2",
  category: "Ma matière",
  type: "tf",
  question: "Vrai ou faux : ...",
  answer: true,
  explanation: "Explication (optionnel).",
}
```

## Fichiers

- `index.html` : page du site
- `style.css` : design
- `questions.js` : banque de questions
- `app.js` : logique du quiz

## Publication / déploiement

Ce projet est un site statique (HTML/CSS/JS) et peut être publié facilement. Voici quelques méthodes courantes :

1. **GitHub Pages** (gratuit) :
   - Crée un dépôt GitHub et pousse tout le contenu du dossier `quiz-revision`.
   - Dans les paramètres du dépôt (`Settings > Pages`), choisis la branche `main` (ou `master`) et le dossier `/ (root)`.
   - Le site sera accessible à l’URL `https://<ton-utilisateur>.github.io/<nom-du-repo>/` quelques minutes plus tard.

2. **Netlify / Vercel / Surge** : ces services proposent un déploiement en un clic ou via l’interface CLI. Il suffit de lier le dépôt GitHub et de déployer, ou de faire
   ```bash
   npm install --global surge
   surge ./ quiz-revision.surge.sh
   ```
   (pour Surge, par exemple).

3. **Hébergement simple** : téléverse les fichiers sur n’importe quel serveur web (FTP, SFTP, etc.). Le site fonctionne hors ligne aussi.

> 📌 Astuce : si tu utilises GitHub, ajoute un `.gitignore` pour exclure les fichiers temporaires ou les secrets, puis crée un commit initial et pousse-le.

Ces étapes te permettront de rendre ton quiz accessible sur Internet pour tes camarades.

## Démarrage avec serveur et base de données

Cette version contient un serveur Node.js et une base de données locale `database.json`.

### Lancer l'application

1. Installer Node.js 18 ou supérieur.
2. Ouvrir un terminal dans ce dossier.
3. Lancer :

```bash
npm start
```

4. Ouvrir dans le navigateur :

```text
http://localhost:3000
```

### Sécurité de connexion ajoutée

- Un même identifiant ne peut avoir qu'une seule session active à la fois.
- Si le compte est déjà connecté sur un autre appareil ou navigateur, la nouvelle connexion est refusée.
- Les sessions expirent automatiquement après environ 2 minutes sans activité serveur.
- Les administrateurs peuvent voir :
  - les comptes actuellement en ligne ;
  - l'heure de connexion et la dernière activité ;
  - l'appareil et le navigateur ;
  - le nombre de connexions par identifiant ;
  - l'historique détaillé des connexions, refus et activités.

### Fichiers importants

- `server.js` : serveur HTTP et API backend.
- `database.json` : base de données locale persistante.
- `codes.js` : liste des utilisateurs et administrateurs.
- `app.js` : application front-end connectée au serveur.
