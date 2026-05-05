# Session unique + déconnexion administrateur

Cette version garde la possibilité pour les administrateurs de déconnecter un utilisateur depuis le site, et bloque aussi la connexion du même compte sur deux appareils ou deux navigateurs différents.

## Fonctionnement

- Une seule session active est autorisée par identifiant.
- Si le compte est déjà connecté ailleurs, une nouvelle tentative reçoit un refus.
- Le même appareil et le même navigateur peuvent rouvrir le site sans se reconnecter.
- Si l'administrateur clique sur Déconnecter, la session active est supprimée côté serveur et révoquée.
- Le navigateur de l'utilisateur vérifie régulièrement sa session et se déconnecte automatiquement si l'admin l'a révoquée.

## Important

Après avoir mis cette version sur GitHub, redéployez sur Render avec la même variable `DATABASE_URL`.
