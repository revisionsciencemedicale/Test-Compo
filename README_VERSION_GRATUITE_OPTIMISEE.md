# Version gratuite optimisée : Render + Neon PostgreSQL

Cette version est prévue pour fonctionner sans paiement tant que tu restes dans les limites gratuites de Render et Neon.

## Ce qui a été amélioré

- Base de données PostgreSQL externe via Neon avec `DATABASE_URL`.
- Session unique par compte : un même identifiant ne peut pas être utilisé sur deux appareils ou navigateurs en même temps.
- Journal admin des connexions : heure, appareil, navigateur, plateforme, IP, refus de connexion.
- Protection contre les tentatives abusives de connexion : limite de tentatives par IP.
- En-têtes de sécurité HTTP ajoutés.
- Délai de session plus réaliste : 10 minutes sans activité avant expiration.
- Endpoint admin pour déconnecter manuellement un utilisateur bloqué : `/api/admin/force-logout`.
- Endpoint de nettoyage admin : `/api/admin/clear-expired`.

## Variables Render à configurer

Dans Render > ton Web Service > Environment :

```text
DATABASE_URL=postgresql://...neon.tech/...?...sslmode=require
NODE_ENV=production
SESSION_TIMEOUT_MS=0
PGSSLMODE=require
LOGIN_RATE_LIMIT_MAX=30
LOGIN_RATE_LIMIT_WINDOW_MS=900000
```

## Commandes Render

```bash
npm install
npm start
```

## Test après déploiement

1. Ouvre ton lien Render : `https://ton-site.onrender.com`.
2. Connecte-toi avec un identifiant.
3. Ouvre un autre navigateur ou téléphone.
4. Essaie le même identifiant : la connexion doit être refusée.
5. Connecte-toi avec un compte admin pour voir les journaux.

## Important

Le plan gratuit Render peut mettre l’application en veille après inactivité. Neon garde la base PostgreSQL séparée, donc les données ne dépendent pas du redémarrage Render.
