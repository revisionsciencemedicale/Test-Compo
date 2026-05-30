# Fichier ajouté : questions.examen-fin-formation.manuel.js

Ce fichier sert à ajouter manuellement les questions de l'« Examen de Fin de Formation » sans toucher au gros fichier `questions.js`.

## Où ajouter les questions ?

Ouvre :

```txt
questions.examen-fin-formation.manuel.js
```

Ajoute les nouvelles questions dans le tableau :

```js
const MANUAL_EFF_QUESTIONS = [
  // AJOUTE TES QUESTIONS ICI
];
```

## Niveaux à utiliser

```js
level: "INF/SAG-M"
```

ou

```js
level: "AUXI"
```

## Important

Chaque question doit avoir un `id` unique.
Pour afficher la même question dans deux niveaux, duplique l'objet et change seulement `id` et `level`.
