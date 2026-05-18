# Correction utilisateurs connectés / recherche utilisateur / déconnexion

Corrections appliquées :

1. **Utilisateurs connectés en temps réel**
   - Le panneau est maintenant rafraîchi depuis le serveur quand l'administrateur clique sur le sous-bouton **Utilisateurs connectés en temps réel**.
   - Le délai d'attente serveur a été augmenté pour éviter d'afficher une ancienne donnée vide quand Render/PostgreSQL répond lentement.

2. **Rechercher utilisateur**
   - Le panneau affiche les comptes provenant de `codes.js`, les comptes enregistrés dans PostgreSQL et les comptes sauvegardés dans `server-data/app_users_store.json`.
   - Le panneau est aussi rafraîchi depuis le serveur quand l'administrateur clique sur **Rechercher utilisateur**.

3. **Bouton Déconnexion**
   - Ajout d'un bouton **Déconnexion** devant **Suspendre** pour chaque compte dans **Rechercher utilisateur**.
   - Ce bouton appelle `/api/admin/force-logout` et déconnecte immédiatement la session active du compte ciblé.

4. **Indicateur en ligne / hors ligne**
   - Dans la recherche utilisateur, chaque compte affiche maintenant son état : **En ligne** ou **Hors ligne**.
