# Correction : sessions sans expiration automatique

Modification effectuée : les sessions en ligne ne sont plus supprimées automatiquement après inactivité serveur.

## Comportement actuel

- Une session reste active même après plusieurs minutes/heures/jours sans activité.
- L'utilisateur reste connecté sur le même appareil/navigateur.
- La session est supprimée uniquement lorsque :
  - l'utilisateur clique sur **Se déconnecter** ;
  - un administrateur force la déconnexion depuis l'interface admin.

## Fichiers modifiés

- `server.js` : désactivation de la suppression automatique des sessions inactives.
- `.env.example` : `SESSION_TIMEOUT_MS=0`.
- `render.yaml` : `SESSION_TIMEOUT_MS` défini à `0`.

## Important sur Render

Après le redéploiement, vérifie dans Render > Environment que la variable `SESSION_TIMEOUT_MS` vaut bien `0` ou supprime-la. Le code serveur n'expire plus les sessions automatiquement.
