# 🎿 SkiConnect — Plateforme intelligente de station de ski

> Projet Développement Web — ING1 2025-2026 — CY Tech  
> Groupe : **Locqman · Benjamin · Oumar · Johan · Rayane**

---

## 📋 Description

SkiConnect est une plateforme numérique intelligente dédiée à la gestion d'une station de ski connectée. Elle centralise les données de 14 objets connectés (remontées mécaniques, canons à neige, capteurs météo, thermostats, caméras, etc.) et propose trois modules fonctionnels selon le niveau de l'utilisateur.

---

## 🛠️ Stack technique

| Côté | Technologie |
|------|-------------|
| Frontend | React.js + React Router + Recharts |
| Backend | Node.js + Express.js |
| Base de données | MySQL |
| Authentification | JWT + bcrypt |
| Versionnement | Git / GitHub |

---

## 📁 Structure du projet

```
Dev-Web/
├── client/          # Frontend React
│   ├── public/
│   └── src/
│       ├── components/    # Navbar, ProtectedRoute
│       ├── context/       # AuthContext (gestion auth globale)
│       ├── pages/
│       │   ├── Information/    # Module 1 — Visiteur
│       │   ├── Visualisation/  # Module 2 — Simple
│       │   └── Gestion/        # Module 3 — Complexe
│       ├── services/      # Appels API (axios)
│       └── styles/        # CSS global
├── server/          # Backend Express
│   ├── config/      # db.js (MySQL), mailer.js
│   ├── controllers/ # authController, usersController, objetsController
│   ├── middlewares/ # auth.js (JWT + niveau)
│   └── routes/      # auth, users, objets, services, actualites
└── database/
    ├── schema.sql   # Création des tables
    └── seed.sql     # Données de test réalistes
```

---

## 🚀 Installation et lancement

### Prérequis
- Node.js v18+
- MySQL 8.0
- Git

### 1 — Cloner le projet

```bash
git clone https://github.com/Locqman/Dev-Web.git
cd Dev-Web
```

### 2 — Importer la base de données

Ouvrez MySQL Workbench et exécutez dans l'ordre :
1. `database/schema.sql`
2. `database/seed.sql`

### 3 — Configurer le backend

Ouvrez `server/config/db.js` et modifiez vos identifiants MySQL :

```js
const db = mysql.createConnection({
  host:     'localhost',
  port:     3306,
  user:     'root',
  password: 'votre_mot_de_passe',
  database: 'skiconnect'
});
```

### 4 — Lancer le backend

```bash
cd server
npm install
node server.js
```

✅ Le serveur tourne sur `http://localhost:5000`

### 5 — Lancer le frontend

Dans un **nouveau terminal** :

```bash
cd client
npm install
npm start
```

✅ L'application s'ouvre sur `http://localhost:3000`

---

## 👤 Comptes de test

| Email | Mot de passe | Niveau |
|-------|-------------|--------|
| Créer un compte via /register | — | Débutant |

> Les comptes du seed.sql utilisent des hashs fictifs. Créez un nouveau compte via le formulaire d'inscription.

---

## 🏔️ Modules de la plateforme

### Module 1 — Information (Visiteur)
- Page d'accueil avec météo et chiffres clés
- Actualités et événements de la station
- Recherche avec 2 filtres (mot-clé + catégorie)
- Boutons d'inscription / connexion

### Module 2 — Visualisation (Simple : Débutant / Intermédiaire)
- Gestion du profil (public + privé)
- Consultation des profils membres
- Recherche d'objets connectés (4 filtres)
- Système de points automatique (+0,25 par connexion, +0,50 par consultation)
- Changement de niveau si assez de points

### Module 3 — Gestion (Complexe : Avancé / Expert)
- Tableau de bord avec statistiques globales
- Ajout et modification d'objets connectés
- Attributs dynamiques par objet
- Rapports avec graphiques (température, énergie, fréquentation)
- Demandes de suppression d'objets

---

## 🏆 Système de points et niveaux

| Niveau | Points requis | Accès |
|--------|--------------|-------|
| 🔵 Débutant | 0 pts | Modules 1 + 2 |
| 🟢 Intermédiaire | 3 pts | Modules 1 + 2 |
| 🟠 Avancé | 5 pts | Modules 1 + 2 + 3 |
| 🔴 Expert | 7 pts | Tous les modules |

**Gains de points :**
- Connexion : +0,25 point
- Consultation d'un objet : +0,50 point

---

## 👥 Répartition des tâches

| Membre | Responsabilités |
|--------|----------------|
| **Locqman** | Conception BDD, module Gestion, intégration générale |
| **Benjamin** | Données de test (seed.sql), module Gestion, rapport |
| **Oumar** | Backend Express, authentification JWT, API objets |
| **Johan** | Module Information, système de points, rapport |
| **Rayane** | Module Visualisation, profil, membres, graphiques |

---

## 📦 Objets connectés intégrés

- 🚡 Remontées mécaniques (télésiège, télécabine, téléski)
- ❄️ Canons à neige
- 🌡️ Stations météo
- 📷 Caméras de surveillance
- 🚨 Détecteurs d'avalanche
- 🌡️ Thermostats (refuges, chalets)
- 💡 Éclairage de pistes
- 🚪 Portiques d'accès
- 🖥️ Bornes de location

---

*SkiConnect — ING1 2025-2026 — CY Tech*
