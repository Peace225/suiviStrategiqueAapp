# 🏦 Système de Pilotage Stratégique (SPS) - BGFIBank

> Solution Full-Stack de suivi du temps et de pilotage de la performance basée sur les objectifs stratégiques du Groupe BGFIBank.



---

## 🚀 Présentation du Projet
Le **SPS** est une plateforme numérique conçue pour mesurer l'allocation du capital humain sur les piliers stratégiques de la banque (PNB, Expérience Client, Maîtrise des Risques). Elle permet une traçabilité totale des activités, de la saisie par l'agent à la validation hiérarchique.

## 🛠️ Stack Technique
- **Frontend :** React 18 (TypeScript), Tailwind CSS (Interface Premium), Vite.
- **Backend :** Node.js, Express, Firebase Admin SDK.
- **Base de Données :** Google Cloud Firestore (NoSQL).
- **Sécurité :** JWT (JSON Web Tokens), Firebase Auth, RBAC (Role-Based Access Control).
- **DevOps :** Docker, Docker-Compose, Git (Branching Model Pro).



## ✨ Fonctionnalités Clés
- **Chronomètre Temps Réel :** Calcul précis de la durée des tâches côté serveur pour garantir l'intégrité des données.
- **Validation Manager :** Flux d'approbation granulaire (Validation/Rejet avec commentaires) par département.
- **Reporting Stratégique :** Tableaux de bord analytiques calculant l'effort investi par Axe Stratégique.
- **Piste d'Audit :** Journalisation complète (Audit Logs) de toutes les actions sensibles (standard bancaire).

## 📦 Installation & Déploiement

### Pré-requis
- Node.js (v20+)
- Docker & Docker-Compose (optionnel)
- Un compte Firebase (Projet Configuré)

### Installation Locale
1. **Clonage du dépôt :**
   ```bash
   git clone [https://github.com/votre-nom/suivi-strategique-bgfi.git](https://github.com/votre-nom/suivi-strategique-bgfi.git)
   cd suivi-strategique-bgfi