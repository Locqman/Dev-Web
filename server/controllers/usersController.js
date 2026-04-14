const db = require('../config/db');

// GET /api/users/me — profil complet (privé) de l'utilisateur connecté
const getMyProfile = (req, res) => {
  db.query(
    'SELECT id, pseudo, nom, prenom, email, age, genre, date_naissance, type_membre, photo_url, niveau, points, nb_connexions, nb_actions FROM users WHERE id = ?',
    [req.user.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (results.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      res.json(results[0]);
    }
  );
};

// PUT /api/users/me — modifier son propre profil
const updateMyProfile = (req, res) => {
  const { pseudo, age, genre, date_naissance, type_membre, photo_url, nom, prenom, password } = req.body;

  // Champs modifiables
  let query  = 'UPDATE users SET pseudo=?, age=?, genre=?, date_naissance=?, type_membre=?, photo_url=?, nom=?, prenom=?';
  let params = [pseudo, age, genre, date_naissance, type_membre, photo_url, nom, prenom];

  const finalize = () => {
    query += ' WHERE id = ?';
    params.push(req.user.id);
    db.query(query, params, (err) => {
      if (err) return res.status(500).json({ message: 'Erreur lors de la mise à jour.' });
      res.json({ message: 'Profil mis à jour.' });
    });
  };

  if (password) {
    const bcrypt = require('bcrypt');
    bcrypt.hash(password, 10).then((hash) => {
      query += ', password_hash=?';
      params.push(hash);
      finalize();
    });
  } else {
    finalize();
  }
};

// GET /api/users — liste des membres (partie publique seulement)
const getAllUsers = (req, res) => {
  db.query(
    'SELECT id, pseudo, age, genre, type_membre, photo_url, niveau FROM users WHERE est_valide = TRUE',
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      res.json(results);
    }
  );
};

// GET /api/users/:id — profil public d'un membre
const getUserById = (req, res) => {
  db.query(
    'SELECT id, pseudo, age, genre, date_naissance, type_membre, photo_url, niveau FROM users WHERE id = ? AND est_valide = TRUE',
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (results.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      res.json(results[0]);
    }
  );
};

// PUT /api/users/niveau — l'utilisateur choisit de monter de niveau s'il a assez de points
const changerNiveau = (req, res) => {
  const { nouveau_niveau } = req.body;
  const niveauxRequis = { intermediaire: 3, avance: 5, expert: 7 };

  if (!niveauxRequis[nouveau_niveau]) {
    return res.status(400).json({ message: 'Niveau invalide.' });
  }

  db.query('SELECT points, niveau FROM users WHERE id = ?', [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur.' });

    const { points, niveau } = results[0];
    const ordreNiveaux = { debutant: 1, intermediaire: 2, avance: 3, expert: 4 };

    if (ordreNiveaux[nouveau_niveau] <= ordreNiveaux[niveau]) {
      return res.status(400).json({ message: 'Vous avez déjà ce niveau ou supérieur.' });
    }
    if (points < niveauxRequis[nouveau_niveau]) {
      return res.status(400).json({
        message: `Points insuffisants. Requis : ${niveauxRequis[nouveau_niveau]}, actuel : ${points}`
      });
    }

    db.query('UPDATE users SET niveau = ? WHERE id = ?', [nouveau_niveau, req.user.id], (err2) => {
      if (err2) return res.status(500).json({ message: 'Erreur serveur.' });
      res.json({ message: `Félicitations ! Vous êtes maintenant ${nouveau_niveau} 🎿` });
    });
  });
};

module.exports = { getMyProfile, updateMyProfile, getAllUsers, getUserById, changerNiveau };
