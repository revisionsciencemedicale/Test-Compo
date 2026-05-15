# Correction sauvegarde des comptes dans un fichier serveur

Cette version ajoute une sauvegarde serveur de secours pour les comptes créés depuis l'administration.

## Ce qui a été ajouté

- Création automatique d'un fichier privé `server-data/app_users_store.json` sur le serveur.
- Chaque compte créé depuis le bouton admin est sauvegardé dans ce fichier serveur.
- La recherche utilisateur affiche maintenant :
  - les comptes du fichier `codes.js`,
  - les comptes de la base PostgreSQL si elle est disponible,
  - les comptes sauvegardés dans `server-data/app_users_store.json`.
- Les actions administrateur suivantes sont également répercutées dans le fichier serveur :
  - suspension,
  - réactivation,
  - suppression,
  - modification du nom / téléphone / niveau.
- Si PostgreSQL n'est pas connecté, le site peut quand même créer et afficher les comptes via le fichier serveur local.
- Le fichier `server-data/app_users_store.json` est protégé : il n'est pas exposé publiquement par le serveur statique.

## Important

Sur Render ou certains hébergeurs gratuits, le disque peut être réinitialisé après un redémarrage ou un nouveau déploiement. Pour une conservation permanente partout, PostgreSQL reste recommandé. Cette correction ajoute néanmoins une sauvegarde serveur directe dans le fichier du site tant que l'espace serveur n'est pas effacé.
