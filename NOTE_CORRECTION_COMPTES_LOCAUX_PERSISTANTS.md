# Correction comptes créés localement / depuis le site

Cette version empêche la déconnexion automatique des comptes créés depuis l'interface administrateur après déploiement sur Render.

Corrections appliquées :

- `/api/check-session` ne considère plus automatiquement une session absente comme expirée.
- `/api/heartbeat` recrée/rafraîchit la session active si elle a disparu après redémarrage ou redéploiement du serveur.
- `/api/activity` ne bloque plus l'utilisateur si la ligne de session active a été perdue.
- La déconnexion reste possible uniquement dans ces cas :
  - l'utilisateur clique volontairement sur déconnexion ;
  - l'administrateur déconnecte le compte ;
  - le compte est suspendu ou supprimé.

Important : les comptes créés sur le site doivent être enregistrés dans la base PostgreSQL/Neon pour rester disponibles après déploiement. Cette version utilise `app_users` côté serveur pour cela.
