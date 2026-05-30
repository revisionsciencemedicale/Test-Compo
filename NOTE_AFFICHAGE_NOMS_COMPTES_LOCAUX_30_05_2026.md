# Affichage des noms pour les comptes locaux

Ajout d'un bloc `window.UTILISATEURS_LOCAUX_INFOS` dans `codes.js`.

Pour afficher le nom et le prénom d'un compte créé localement, complète ce bloc ainsi :

```js
window.UTILISATEURS_LOCAUX_INFOS = {
  "etudiant1": { nom: "KOUASSI", prenom: "Brice", niveau: "A1-Base Santé" }
};
```

Après connexion avec l'identifiant local, l'entête affiche automatiquement :

- le nom et prénom de l'utilisateur ;
- son niveau.

La logique existante des comptes en ligne, des comptes administrateur et des comptes déjà créés est conservée.
