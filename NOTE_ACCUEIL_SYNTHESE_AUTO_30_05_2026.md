# Correction interface — Accueil et synthèse automatique

Modifications appliquées sans casser le code existant :

- Ajout du bouton **Accueil** à côté du bouton **Se déconnecter** dans l'en-tête.
- Correction de la synthèse des questions : les thèmes vides ne sont plus comptés comme s'ils contenaient des questions.
- Sécurisation du lancement des groupes de synthèse : les questions sont retrouvées par identifiant et par signature de contenu, afin d'éviter les thèmes qui affichent un nombre de questions mais lancent un quiz vide.
- La synthèse lit aussi les questions ajoutées depuis l'administration et ignore les questions supprimées.
- Actualisation automatique de la synthèse lorsque les paramètres/questions sont mis à jour dans le navigateur.
- Les doublons restent exclus de l'affichage et du lancement du quiz.
