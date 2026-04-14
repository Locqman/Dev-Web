-- Utilisateurs
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pseudo VARCHAR(50) UNIQUE NOT NULL,
  nom VARCHAR(50),
  prenom VARCHAR(50),
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  age INT,
  genre VARCHAR(20),
  date_naissance DATE,
  type_membre VARCHAR(50),    -- skieur, moniteur, pisteur, etc.
  photo_url VARCHAR(255),
  niveau ENUM('debutant','intermediaire','avance','expert') DEFAULT 'debutant',
  points FLOAT DEFAULT 0,
  nb_connexions INT DEFAULT 0,
  nb_actions INT DEFAULT 0,
  est_valide BOOLEAN DEFAULT FALSE,  -- validation email
  token_validation VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Catégories d'objets connectés
CREATE TABLE categories_objets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT
);

-- Objets connectés
CREATE TABLE objets_connectes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_unique VARCHAR(50) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  marque VARCHAR(100),
  type VARCHAR(50),
  etat ENUM('actif','inactif','maintenance') DEFAULT 'actif',
  connectivite VARCHAR(50),
  batterie INT,
  zone VARCHAR(100),           -- piste bleue, chalet A, etc.
  categorie_id INT,
  derniere_interaction TIMESTAMP,
  FOREIGN KEY (categorie_id) REFERENCES categories_objets(id)
);

-- Attributs dynamiques des objets (flexible)
CREATE TABLE attributs_objets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  objet_id INT NOT NULL,
  cle VARCHAR(100) NOT NULL,
  valeur VARCHAR(255),
  unite VARCHAR(20),
  FOREIGN KEY (objet_id) REFERENCES objets_connectes(id)
);

-- Historique des données des objets
CREATE TABLE historique_objets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  objet_id INT NOT NULL,
  cle VARCHAR(100),
  valeur VARCHAR(255),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (objet_id) REFERENCES objets_connectes(id)
);

-- Historique connexions utilisateurs
CREATE TABLE historique_connexions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  action VARCHAR(100),
  points_gagnes FLOAT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Services / outils
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  categorie VARCHAR(50),
  actif BOOLEAN DEFAULT TRUE
);
