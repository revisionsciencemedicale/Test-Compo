/**
 * Utilisateurs autorisés (connexion uniquement par nom d'utilisateur).
 * Ajoute ou modifie les utilisateurs selon tes besoins.
 */
window.USERS = {
  
  //ACCES ADMINISTRATEUR

  "tirbuce": { levels: "all"},
  "brice": {levels: "all" },
  "bbappia": { levels: "all" },
  "paterne": { levels: ["all"]},


//ACCES A1-Base Santé


//ACCES A2-Niveau moyen


//ACCES L1-Niveau Émergent

  "e": {
    levels: ["L1-Niveau Émergent"]
  },

  //ACCES L2-Niveau Ascendant


  "DAMFANL22644": { levels: ["L2-Niveau Ascendant"] },
  "KONAMOL27378": {levels: ["L2-Niveau Ascendant"]},
  "KAMBINL20052": {levels: ["L2-Niveau Ascendant"]},
  "BONRUSL28384": {levels: ["L2-Niveau Ascendant"]},
  "KOFMARL25613": { levels: ["L2-Niveau Ascendant"]},
  "NDINADL29738": {levels: ["L2-Niveau Ascendant"] },
  "KOUYAOL27276": {levels: ["L2-Niveau Ascendant"] },
  "TOUMAKL20169": {levels: ["L2-Niveau Ascendant"] },
  "OUAADJL25621": {levels: ["L2-Niveau Ascendant"] },
  "BASLUCL20850": {levels: ["L2-Niveau Ascendant"] },
  "ANGYOUL29170": {levels: ["L2-Niveau Ascendant"] },
  "KONSACL28441": {levels: ["L2-Niveau Ascendant"] },


  //ACCES L3-Niveau Accompli SF

  "FOFMARL33911": {levels: ["L3-Niveau Accompli SF"] },
  
  //ACCES L3-Niveau Accompli IDE

  


  // Ajoute ici les nouveaux utilisateurs
};

/**
 * Administrateurs : utilisateurs ayant accès à l'interface admin
 */
window.ADMINS = ["tirbuce", "paterne", "brice", "bbappia"]; // Liste des noms d'utilisateurs admin


