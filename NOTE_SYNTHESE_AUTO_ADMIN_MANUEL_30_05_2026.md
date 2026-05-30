# Correction synthèse automatique — administration et ajout manuel

Modifications appliquées sans casser le code existant :

- La synthèse des questions écoute maintenant les changements des paramètres d'administration (`quizRevision.appSettings.v1`).
- Après ajout, import, modification ou suppression de questions dans l'administration, la synthèse est rafraîchie automatiquement.
- La synthèse prend aussi en compte les questions ajoutées manuellement dans les tableaux JavaScript (`QUIZ_QUESTIONS`, `QUIZ_QUESTIONS_QUIZ`, `QUIZ_QUESTIONS_DE`).
- Une fonction globale `window.QDASH_REFRESH_SYNTHESIS()` est disponible si un ajout manuel externe veut forcer l'actualisation.
- Un contrôle automatique vérifie régulièrement si la banque de questions a changé, puis recalcule les thèmes et les groupes sans doublons.
