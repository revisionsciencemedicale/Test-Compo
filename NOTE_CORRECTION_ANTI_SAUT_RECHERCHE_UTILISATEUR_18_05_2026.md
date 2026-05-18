# Correction anti-saut des questions et recherche utilisateur

Corrections appliquées :

1. Quiz : ajout d'une sécurité contre le double déclenchement des clics sur les réponses.
   - Un clic sur une proposition ne peut plus déclencher deux avances successives.
   - L'avance automatique vérifie que l'utilisateur est toujours sur la même question avant de passer à la suivante.
   - Les timers d'avance automatique précédents sont annulés avant d'en créer un nouveau.

2. Rechercher utilisateur : suppression du rechargement automatique du panneau au focus du champ.
   - Le champ reste saisissable.
   - Le texte saisi reste conservé pendant l'affichage du panneau.
   - La liste reste filtrée jusqu'à une autre recherche.

Aucune modification destructive n'a été faite sur les autres modules.
