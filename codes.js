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

  "YAPACHL18103": {levels: ["L1-Niveau Émergent"] },
  "OUASALL13782": {levels: ["L1-Niveau Émergent"] },
  "SEKSONL13656": {levels: ["L1-Niveau Émergent"] },
  "GRASANL17380": {levels: ["L1-Niveau Émergent"] },





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
  "EKIRITL28681": {levels: ["L2-Niveau Ascendant"] },
  "ANGALIL27956": {levels: ["L2-Niveau Ascendant"] },
  "SERGUIL26978": {levels: ["L2-Niveau Ascendant"] },
  "MAKLOLL26421": {levels: ["L2-Niveau Ascendant"] },
  "SERANGL23587": {levels: ["L2-Niveau Ascendant"] },
  "OUADJEL27634": {levels: ["L2-Niveau Ascendant"] },
  "SORYOHL21179": {levels: ["L2-Niveau Ascendant"] },
  "KOUAKIL29836": {levels: ["L2-Niveau Ascendant"] },
  "NIATANL29711": {levels: ["L2-Niveau Ascendant"] },
  "ATSCHIL20821": {levels: ["L2-Niveau Ascendant"] },
  "KOUANGL27058": {levels: ["L2-Niveau Ascendant"] },
  "OUAMARL25853": {levels: ["L2-Niveau Ascendant"] },
  "NGUDEBL24301": {levels: ["L2-Niveau Ascendant"] },
  "KPIYOUL20707": {levels: ["L2-Niveau Ascendant"] },
  "YAPANGL21649": {levels: ["L2-Niveau Ascendant"] },
  "KONSARL25431": {levels: ["L2-Niveau Ascendant"] },
  "SONLOGL27307": {levels: ["L2-Niveau Ascendant"] },
  "TOUPENL28476": {levels: ["L2-Niveau Ascendant"] },
  "TIELOUL24531": {levels: ["L2-Niveau Ascendant"] },
  "BAKOUML22605": {levels: ["L2-Niveau Ascendant"] },
  "KOUAMAL28535": {levels: ["L2-Niveau Ascendant"] },
  "CAMSEKL24574": {levels: ["L2-Niveau Ascendant"] },
  "YAPASSL27613": {levels: ["L2-Niveau Ascendant"] },


  //ACCES L3-Niveau Accompli SF

  "FOFMARL33911": {levels: ["L3-Niveau Accompli SF"] },
  
  //ACCES L3-Niveau Accompli IDE

  


  // Ajoute ici les nouveaux utilisateurs
};



/**
 * Informations des comptes créés localement.
 *
 * Utilisation : ajoute ici manuellement l'identifiant local, le nom, le prénom
 * et le niveau de l'utilisateur. Lorsque cet utilisateur se connecte en local,
 * son nom et son prénom s'affichent dans l'entête à la place de « Étudiant(e) ».
 *
 * Exemple à compléter :
 * window.UTILISATEURS_LOCAUX_INFOS = {
 *   "etudiant1": { nom: "KOUASSI", prenom: "Brice", niveau: "A1-Base Santé" },
 *   "etudiant2": { nom: "KOFFI", prenom: "Ange", niveau: "L2-Niveau Ascendant" }
 * };
 */
window.UTILISATEURS_LOCAUX_INFOS = window.UTILISATEURS_LOCAUX_INFOS || {
  // Ajoute ici les comptes locaux dont tu veux afficher le nom et le prénom.

   //ACCES ADMINISTRATEUR

  "tirbuce": { nom: "BEDA", prenom: "TIRBUCE PATERNE", niveau:"all"},
  "brice": {nom: "APPIA", prenom: "BRICE BEDA", niveau: "all" },
  "bbappia": { nom: "BB", prenom: "APPIA", niveau: "all" },
  "paterne": { nom: "BEDA", prenom: "TIRBUCE PATERNE", niveau:"all"},


  "YAPACHL18103": {nom: "YAPI", prenom: "ACHY", niveau:"L1-Niveau Émergent" },
  "OUASALL13782": {nom: "OUATTARA", prenom: "SALIMANTA", niveau:"L1-Niveau Émergent" },
  "SEKSONL13656": {nom: "SEKA", prenom: "SONIA CHRISTELLE", niveau: "L1-Niveau Émergent"},
  "GRASANL17380": {nom: "GRAH", prenom: "SANDRINE BOUKA TATIANA", niveau: "L1-Niveau Émergent" },
  "DAMFANL22644": { nom: "DAMBELE", prenom: "FANTA", niveau: "L2-Niveau Ascendant" },
  "KONAMOL27378": {nom: "KONAN", prenom: "AMOIN ALBERTINE", niveau: "L2-Niveau Ascendant"},
  "KAMBINL20052": {nom: "KAMAGATE", prenom: "BINTOU", niveau: "L2-Niveau Ascendant"},
  "BONRUSL28384": {nom: "BONI", prenom: "RUSTEN EVA", niveau: "L2-Niveau Ascendant"},
  "KOFMARL25613": {nom: "BINDIE", prenom: "KOFFI MARIUS", niveau: "L2-Niveau Ascendant"},
  "NDINADL29738": {nom: "N'DIORE", prenom: "NADEGE", niveau: "L2-Niveau Ascendant"},
  "KOUYAOL27276": {nom: "KOUASSI", prenom: "YAO", niveau: "L2-Niveau Ascendant"},
  "TOUMAKL20169": {nom: "TOURE", prenom: "MAKOURA", niveau: "L2-Niveau Ascendant"},
  "OUAADJL25621": {nom: "OUATTARA", prenom: "ADJARATOU", niveau: "L2-Niveau Ascendant"},
  "BASLUCL20850": {nom: "BASSOLE", prenom: "LUCIEN", niveau: "L2-Niveau Ascendant"},
  "ANGYOUL29170": {nom: "ANGOUA", prenom: "YOUHOUA", niveau: "L2-Niveau Ascendant"},
  "KONSACL28441": {nom: "KONAN", prenom: "SACOUNDE", niveau: "L2-Niveau Ascendant"},
  "EKIRITL28681": {nom: "EKISSI", prenom: "RITA", niveau: "L2-Niveau Ascendant"},
  "ANGALIL27956": {nom: "ANGOUA", prenom: "ALICE", niveau: "L2-Niveau Ascendant"},
  "SERGUIL26978": {nom: "SEREKO", prenom: "GUIHI ANNICK CAROLLE", niveau: "L2-Niveau Ascendant"},
  "MAKLOLL26421": {nom: "MAKWALA", prenom: "LOLITA AKISSI", niveau: "L2-Niveau Ascendant"},
  "SERANGL23587": {nom: "SERI", prenom: "ANGE DEBORAH", niveau: "L2-Niveau Ascendant"},
  "OUADJEL27634": {nom: "OUATTARA", prenom: "DJENEBOU ORNELLA", niveau: "L2-Niveau Ascendant"},
  "SORYOHL21179": {nom: "SORO", prenom: "YOH SARAH HYACIMINE", niveau: "L2-Niveau Ascendant"},
  "KOUAKIL29836": {nom: "KOUADIO", prenom: "AKISSI BLEDJA ZAHAI EMILIENNE", niveau: "L2-Niveau Ascendant"},
  "NIATANL29711": {nom: "NIAMIEN", prenom: "TANOA MARINA", niveau: "L2-Niveau Ascendant"},
  "ATSCHIL20821": {nom: "ATSE", prenom: "CHIBROU PULCHERIE JOSIANE", niveau: "L2-Niveau Ascendant"},
  "KOUANGL27058": {nom: "KOUAO", prenom: "ANGE BENEDICTE", niveau: "L2-Niveau Ascendant"},
  "OUAMARL25853": {nom: "OUATTARA", prenom: "MARIAM MELISSA", niveau: "L2-Niveau Ascendant"},
  "NGUDEBL24301": {nom: "N'GUETTIA", prenom: "DEBORA", niveau: "L2-Niveau Ascendant"},
  "KPIYOUL20707": {nom: "KPIN", prenom: "YOUWA ADELE", niveau: "L2-Niveau Ascendant"},
  "YAPANGL21649": {nom: "YAPO", prenom: "ANGE SEDRIQUE", niveau: "L2-Niveau Ascendant"},
  "KONSARL25431": {nom: "KONE", prenom: "SARA ELSA NOURA", niveau: "L2-Niveau Ascendant"},
  "SONLOGL27307": {nom: "SONAN", prenom: "LOGBOCHI REBECCA", niveau: "L2-Niveau Ascendant"},
  "TOUPENL28476": {nom: "TOURE", prenom: "PENANGNOUFA MADELEINE", niveau: "L2-Niveau Ascendant"},
  "TIELOUL24531": {nom: "TIE", prenom: "LOU NANYE CHRISTELLE", niveau: "L2-Niveau Ascendant"},
  "BAKOUML22605": {nom: "BAKAYOKO", prenom: "OUMAR SOUMAILA", niveau: "L2-Niveau Ascendant"},
  "KOUAMAL28535": {nom: "KOUADIO", prenom: "AMAN KRA PAULINE", niveau: "L2-Niveau Ascendant"},
  "CAMSEKL24574": {nom: "CAMARA", prenom: "SEKOU", niveau: "L2-Niveau Ascendant"},
  "YAPASSL27613": {nom: "YAPO", prenom: "ASSEMIEN FABRICE", niveau: "L2-Niveau Ascendant"},

  "FOFMARL33911": {nom: "FOFANA", prenom: "MARIAM", niveau: "L3-Niveau Accompli SF" },
};

/**
 * Administrateurs : utilisateurs ayant accès à l'interface admin
 */
window.ADMINS = ["tirbuce", "paterne", "brice", "bbappia"]; // Liste des noms d'utilisateurs admin


