# Correction - suppression des doublons de questions

Modifications appliquées sans casser le code :

- les doublons de questions sont retirés de la banque utilisée par le site ;
- la correction fonctionne pour les questions ajoutées manuellement dans les fichiers ;
- la correction fonctionne aussi pour les questions ajoutées depuis l'administration ;
- une même question répétée dans le même niveau n'apparaît plus plusieurs fois ;
- les questions d'autres niveaux sont conservées afin de ne pas vider les comptes des autres utilisateurs ;
- la rapidité du site est conservée grâce au cache déjà présent.
