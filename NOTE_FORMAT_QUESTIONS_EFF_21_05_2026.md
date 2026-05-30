# Correction format questions EFF - 21/05/2026

Fichier corrigé : `questions.examen-fin-formation.manuel.js`

Modifications appliquées sans changer l'architecture du site :

- Les QCD / Vrai-Faux utilisent le format : `type: "tf"` avec `answer: true/false`.
- Les QCM à une seule bonne réponse utilisent le format : `type: "mcq"` avec `answerIndex`.
- Les QCM à plusieurs bonnes réponses utilisent le format : `type: "mcq_multi"` avec `answerIndices`.
- Correction de l'ancien champ incorrect `answerIndexes` en `answerIndices`.
- Ajout d'une fonction de normalisation dans le bloc manuel pour éviter qu'une nouvelle question mal écrite casse l'affichage.

Vérification effectuée :

```bash
node --check questions.examen-fin-formation.manuel.js
```

Résultat : aucune erreur de syntaxe détectée.
