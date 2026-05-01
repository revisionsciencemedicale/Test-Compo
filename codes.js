/**
 * Utilisateurs autorisés (connexion uniquement par nom d'utilisateur).
 * Ajoute ou modifie les utilisateurs selon tes besoins.
 */
window.USERS = {
  "tirbuce": {
    levels: "all"
  },
  "etudiant1": {
    levels: ["L1-Niveau Émergent"]
  },
  "etudiant2": {
    levels: ["L2-Niveau Ascendant"]
  },
  "paterne": {
    levels: ["L1-Niveau Émergent", "L2-Niveau Ascendant"]
  },
  "brice": {
    levels: "all"
  },
  "NDINADL29738": {
    levels: ["L2-Niveau Ascendant"]
  },
  "KONAMOL27378": {
    levels: ["L2-Niveau Ascendant"]}


  // Ajoute ici les nouveaux utilisateurs
};

/**
 * Administrateurs : utilisateurs ayant accès à l'interface admin
 */
window.ADMINS = ["tirbuce", "paterne"]; // Liste des noms d'utilisateurs admin
window.ADMINS = ["brice"]; // Liste des noms d'utilisateurs admin

