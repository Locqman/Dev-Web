-- ============================================================
--  SkiConnect — Station de ski intelligente
--  schema.sql — Création des tables
--  Stack : MySQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS skiconnect
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE skiconnect;

-- ------------------------------------------------------------
-- 1. UTILISATEURS
-- ------------------------------------------------------------
CREATE TABLE users (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  pseudo              VARCHAR(50)  UNIQUE NOT NULL,
  nom                 VARCHAR(50),
  prenom              VARCHAR(50),
  email               VARCHAR(100) UNIQUE NOT NULL,
  password_hash       VARCHAR(255) NOT NULL,
  age                 INT,
  genre               VARCHAR(20),
  date_naissance      DATE,
  -- type de membre spécifique à la station de ski
  type_membre         ENUM('skieur','moniteur','pisteur','technicien','responsable') DEFAULT 'skieur',
  photo_url           VARCHAR(255),
  -- système de niveaux
  niveau              ENUM('debutant','intermediaire','avance','expert') DEFAULT 'debutant',
  points              FLOAT        DEFAULT 0,
  nb_connexions       INT          DEFAULT 0,
  nb_actions          INT          DEFAULT 0,
  -- validation inscription par email
  est_valide          BOOLEAN      DEFAULT FALSE,
  token_validation    VARCHAR(255),
  created_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 2. CATÉGORIES D'OBJETS CONNECTÉS
-- ------------------------------------------------------------
CREATE TABLE categories_objets (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(100) NOT NULL,
  description TEXT,
  icone       VARCHAR(50)                        -- nom d'icône front (ex: "cable-car")
);

-- ------------------------------------------------------------
-- 3. OBJETS CONNECTÉS
-- ------------------------------------------------------------
CREATE TABLE objets_connectes (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  id_unique             VARCHAR(50)  UNIQUE NOT NULL,
  nom                   VARCHAR(100) NOT NULL,
  description           TEXT,
  marque                VARCHAR(100),
  type                  VARCHAR(50),
  etat                  ENUM('actif','inactif','maintenance') DEFAULT 'actif',
  connectivite          VARCHAR(50),              -- Wi-Fi, LoRa, Zigbee…
  batterie              INT,                       -- % batterie (NULL si sur secteur)
  zone                  VARCHAR(100),              -- Piste Bleue 1, Chalet A, Sommet…
  categorie_id          INT,
  derniere_interaction  TIMESTAMP,
  created_at            TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categorie_id) REFERENCES categories_objets(id) ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- 4. ATTRIBUTS DYNAMIQUES DES OBJETS
--    (permet d'avoir des champs spécifiques à chaque type d'objet)
-- ------------------------------------------------------------
CREATE TABLE attributs_objets (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  objet_id  INT          NOT NULL,
  cle       VARCHAR(100) NOT NULL,               -- ex: "temperature_actuelle"
  valeur    VARCHAR(255),                         -- ex: "21"
  unite     VARCHAR(20),                          -- ex: "°C"
  FOREIGN KEY (objet_id) REFERENCES objets_connectes(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 5. HISTORIQUE DES DONNÉES DES OBJETS
--    (séries temporelles pour graphiques et rapports)
-- ------------------------------------------------------------
CREATE TABLE historique_objets (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  objet_id  INT          NOT NULL,
  cle       VARCHAR(100) NOT NULL,
  valeur    VARCHAR(255),
  timestamp TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (objet_id) REFERENCES objets_connectes(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 6. SERVICES / OUTILS PROPOSÉS PAR LA PLATEFORME
-- ------------------------------------------------------------
CREATE TABLE services (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(100) NOT NULL,
  description TEXT,
  categorie   VARCHAR(50),                        -- transport, securite, energie…
  actif       BOOLEAN      DEFAULT TRUE,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- 7. ASSOCIATION OBJETS ↔ SERVICES
-- ------------------------------------------------------------
CREATE TABLE objets_services (
  objet_id    INT NOT NULL,
  service_id  INT NOT NULL,
  PRIMARY KEY (objet_id, service_id),
  FOREIGN KEY (objet_id)   REFERENCES objets_connectes(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id)         ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 8. HISTORIQUE DES CONNEXIONS & ACTIONS UTILISATEURS
--    (pour le calcul de points et les stats admin)
-- ------------------------------------------------------------
CREATE TABLE historique_connexions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT          NOT NULL,
  type_action   VARCHAR(100),                     -- 'connexion', 'consultation_objet', etc.
  detail        VARCHAR(255),                     -- ex: id ou nom de l'objet consulté
  points_gagnes FLOAT        DEFAULT 0,
  timestamp     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 9. DEMANDES DE SUPPRESSION D'OBJETS
--    (un complexe demande, l'admin valide)
-- ------------------------------------------------------------
CREATE TABLE demandes_suppression (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  objet_id    INT          NOT NULL,
  user_id     INT          NOT NULL,
  motif       TEXT,
  statut      ENUM('en_attente','approuvee','refusee') DEFAULT 'en_attente',
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (objet_id) REFERENCES objets_connectes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)  REFERENCES users(id)            ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- 10. ACTUALITÉS / ÉVÉNEMENTS (module Information)
-- ------------------------------------------------------------
CREATE TABLE actualites (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  titre       VARCHAR(200) NOT NULL,
  contenu     TEXT,
  categorie   VARCHAR(50),                        -- evenement, alerte, meteo, info
  image_url   VARCHAR(255),
  visible     BOOLEAN      DEFAULT TRUE,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
