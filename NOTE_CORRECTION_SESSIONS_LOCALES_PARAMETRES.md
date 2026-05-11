# Correction sessions locales + Paramètres administrateur

Modifications appliquées :

1. Les comptes créés localement ou directement depuis le site ne sont plus déconnectés automatiquement lorsque la session serveur n'est pas retrouvée.
   - Le site garde l'accès local.
   - Seule une déconnexion forcée par un administrateur peut couper la session.

2. Le message « Chargement des paramètres administrateur... » a été supprimé.
   - Le menu Paramètres reste affiché pendant les actions.
   - Les actions ne provoquent plus de rechargement complet de la page.
   - Les données sont rafraîchies rapidement en arrière-plan après création, suppression, suspension, renommage ou déconnexion.

3. Une protection a été ajoutée pour empêcher les boutons du panneau administrateur de soumettre/recharger la page par erreur.

Après remplacement des fichiers, redéployer le projet sur Render.
