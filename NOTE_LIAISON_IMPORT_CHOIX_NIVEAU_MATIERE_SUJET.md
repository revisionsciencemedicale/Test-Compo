# Liaison entre choix Niveau/Matière/Sujet et import des questions

Modifications effectuées :

1. Dans **Ajouter de nouvelles matières et de nouveaux sujets**, la partie import est maintenant verrouillée au départ.
2. L’administrateur doit d’abord choisir :
   - le niveau ;
   - la matière ;
   - le sujet/thème.
3. Il doit ensuite cliquer sur **Valider ce choix pour l’import**.
4. Après validation, l’import de fichier `.js/.txt/.json` ou la saisie du tableau JavaScript devient disponible.
5. Lors de l’ajout, toutes les questions importées sont automatiquement rattachées au niveau, à la matière et au sujet validés.
6. Si le serveur est disponible, la sauvegarde se fait sur le serveur/la base.
7. Si le serveur n’est pas disponible, la sauvegarde se fait en local dans le navigateur pour faciliter les tests.

Cela évite qu’un fichier importé soit ajouté au mauvais niveau, à la mauvaise matière ou au mauvais sujet.
