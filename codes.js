/**
 * Utilisateurs autorisés (connexion uniquement par nom d'utilisateur).
 * Ajoute ou modifie les utilisateurs selon tes besoins.
 */
window.USERS = {
  "tirbuce": {
    levels: "all"
  },
  "etudiant1": {
    levels: ["Licence 1 IDE/SFM"]
  },
  "etudiant2": {
    levels: ["Licence 2 IDE/SFM"]
  },
  "paterne": {
    levels: ["Licence 1 IDE/SFM", "Licence 2 IDE/SFM"]
  },
  "brice": {
    levels: "all"
  }


  // Ajoute ici les nouveaux utilisateurs
};

/**
 * Administrateurs : utilisateurs ayant accès à l'interface admin
 */
window.ADMINS = ["tirbuce", "paterne"]; // Liste des noms d'utilisateurs admin
window.ADMINS = ["brice"]; // Liste des noms d'utilisateurs admin

