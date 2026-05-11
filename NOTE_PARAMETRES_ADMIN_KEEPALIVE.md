# Modifications ajoutées

## Bouton Paramètres administrateur
- Le bouton **⚙️ Paramètres** est visible uniquement pour les administrateurs déclarés dans `window.ADMINS`.
- L’espace contient :
  - Paramètres généraux
  - Gestion des comptes/utilisateurs
  - Tableau de bord
  - Journal d’activité
  - Gestion des quiz
  - Gestion des essais gratuits
  - Paramètres techniques

## Création automatique de compte
Le nom d’utilisateur est généré avec :
- 3 premières lettres du nom
- 3 premières lettres du premier prénom
- 2 premiers caractères du niveau
- 4 derniers chiffres du numéro

Exemple : `KOUJEAL10886`.

Les comptes créés depuis le site sont enregistrés dans PostgreSQL, table `app_users`.

## Fonctions actives côté serveur
- Créer compte
- Suspendre compte
- Réactiver compte
- Supprimer compte
- Rechercher utilisateur
- Déconnecter un utilisateur
- Déconnecter tous les appareils sauf l’administrateur connecté
- Voir utilisateurs connectés en temps réel
- Voir journal d’activité
- Enregistrer les paramètres globaux dans PostgreSQL, table `app_settings`

## Garder le serveur actif automatiquement
Une fonction keep-alive a été ajoutée dans `server.js`.

Pour l’activer sur Render, ajoute cette variable d’environnement :

```txt
PUBLIC_URL=https://ton-site.onrender.com
```

Exemple :

```txt
PUBLIC_URL=https://test-compo.onrender.com
```

Le serveur fera ensuite un ping automatique vers `/api/health` environ toutes les 10 minutes pendant qu’il est actif.

Important : sur l’offre gratuite Render, un serveur déjà endormi ne peut pas se réveiller lui-même. Pour un maintien plus fiable, il faut utiliser un service externe gratuit de ping/monitoring ou passer à une offre payante.
