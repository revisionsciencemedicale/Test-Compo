# Correction sous-boutons Essais gratuits et Technique

Modification effectuée dans `app.js` :

- Ajout/correction de la fermeture du panneau **Gestion des quiz** avant les panneaux principaux **Essais gratuits** et **Technique**.
- Le bouton **Essais gratuits** affiche maintenant le sous-bouton **Gestion des essais gratuits**.
- Au clic sur **Gestion des essais gratuits**, les champs suivants s’affichent :
  - Nombre de questions gratuites
  - Durée du test gratuit (minutes)
  - Nombre maximal d’essais
- Le bouton **Technique** affiche maintenant le sous-bouton **Paramètres techniques**.
- Au clic sur **Paramètres techniques**, les cases à cocher suivantes s’affichent :
  - Sauvegarde automatique
  - Synchronisation serveur
  - Garder le serveur actif automatiquement

Cause corrigée : les panneaux `trial` et `tech` étaient imbriqués dans le panneau `quiz`, ce qui empêchait leur affichage correct.
