# Correction comptes créés depuis le site + liaison des niveaux

Modifications apportées :

1. Les comptes créés directement depuis l’interface administrateur ne sont plus déconnectés automatiquement avec le message :
   « Votre session est expirée ou le compte est ouvert ailleurs. Vous allez être déconnecté. »

2. Le contrôle de session garde l’utilisateur connecté si le serveur répond lentement ou si la session n’est pas confirmée immédiatement.
   La déconnexion reste possible uniquement si :
   - l’utilisateur clique sur « Se déconnecter » ;
   - un administrateur force la déconnexion ;
   - le compte est supprimé ou suspendu selon les actions admin.

3. Après connexion d’un compte créé sur le site, ses niveaux sont chargés depuis la base de données et ajoutés à `window.USERS` côté navigateur.
   Ainsi, les matières et sujets correspondant aux niveaux cochés s’affichent correctement.

4. Les anciens libellés de niveau sont normalisés automatiquement :
   - `Auxiliaire 2 année` et `AUXI` → `A2-Niveau moyen`
   - `L3-Niveau Accompli INF/SFM` → `L3-Niveau Accompli INF`
   - `Licence 3 INF/SAG-M` et `INF/SAG-M` → `L3-Niveau Accompli SF`

5. Lors de la création d’un compte, le serveur enregistre uniquement les niveaux valides correspondant aux niveaux présents dans le fichier.

Après remplacement des fichiers, il faut redéployer sur Render pour appliquer la correction en ligne.
