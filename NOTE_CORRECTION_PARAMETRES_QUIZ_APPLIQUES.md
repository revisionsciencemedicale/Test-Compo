# Correction — paramètres administrateur appliqués aux quiz

Modifications effectuées dans `app.js` :

- Les paramètres enregistrés par l’administrateur sont maintenant appliqués immédiatement au moteur du quiz.
- `Mélanger les questions` agit sur l’ordre des questions au lancement du quiz.
- `Mélanger les réponses` agit sur l’ordre des propositions.
- `Afficher correction immédiatement` affiche la bonne réponse et l’explication après le choix de l’utilisateur.
- `Afficher note finale` masque ou affiche la note finale selon le choix de l’administrateur.
- `Points négatifs` applique ou retire la pénalité des mauvaises réponses.
- `Mode QPQ activé/désactivé` : activé = passage automatique question par question ; désactivé = bouton Suivant manuel.
- `Photo obligatoire avant quiz` oblige l’utilisateur à prendre/choisir une photo avant de commencer.
- `Gestion tentatives de tricherie`, `Anti changement d’onglet`, `Anti copier/coller`, `Nombre maximal d’avertissements`, `Pénalité automatique` et `Soumission automatique` sont reliés au quiz.
- Les tentatives de tricherie sont affichées à la fin du quiz avec l’heure et le motif.
- `Recevoir notification/appel` enregistre une notification dans le journal d’activité administrateur. Un vrai appel téléphonique automatique n’est pas possible depuis un simple navigateur sans service externe.
- `Anti capture d’écran` bloque la sélection/copie visuelle du contenu du quiz autant que possible côté navigateur, mais aucun navigateur web ne permet de bloquer totalement une capture d’écran système.

Après déploiement sur Render, ouvrir l’espace administrateur, cocher les paramètres voulus, cliquer sur **Enregistrer les paramètres quiz**, puis lancer un quiz pour vérifier.
