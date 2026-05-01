# Correction globale des questions répétées

Cette version ajoute `questions.normalisation.js`, chargé après toutes les banques de questions et avant `app.js`.

## Portée de la correction

La correction s’applique à l’ensemble des questions chargées dans l’application :

- banque Quiz normale ;
- banque EFF ;
- tous les niveaux ;
- toutes les matières ;
- tous les sujets.

## Principe appliqué

Le script repère les énoncés répétés, puis reformule chaque répétition avec un contexte propre : niveau, matière, sujet, situation d’application et angle de contrôle.

Les champs de correction existants sont conservés : `id`, `level`, `subject`, `topic`, `type`, `choices`, `answerIndex`, `answer`, `explanation`.

L’objectif est de supprimer les répétitions visibles sans casser la logique de correction existante.
