const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const db     = require('../config/db');
const { sendValidationEmail } = require('../config/mailer');
const { JWT_SECRET }          = require('../middlewares/auth');

// POST /api/auth/register
const register = (req, res) => {
  const { pseudo, nom, prenom, email, password, age, genre, date_naissance, type_membre } = req.body;

  if (!pseudo || !email || !password) {
    return res.status(400).json({ message: 'Pseudo, email et mot de passe requis.' });
  }

  // Vérifier si email ou pseudo déjà utilisé
  db.query(
    'SELECT id FROM users WHERE email = ? OR pseudo = ?',
    [email, pseudo],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (results.length > 0) {
        return res.status(409).json({ message: 'Email ou pseudo déjà utilisé.' });
      }

      try {
        const password_hash    = await bcrypt.hash(password, 10);
        const token_validation = crypto.randomBytes(32).toString('hex');

        db.query(
          `INSERT INTO users 
           (pseudo, nom, prenom, email, password_hash, age, genre, date_naissance, type_membre, token_validation)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [pseudo, nom, prenom, email, password_hash, age, genre, date_naissance, type_membre || 'skieur', token_validation],
          async (err2, result) => {
            if (err2) return res.status(500).json({ message: 'Erreur lors de la création du compte.' });

            // Envoi du mail de validation
            try {
              await sendValidationEmail(email, pseudo, token_validation);
            } catch (mailErr) {
              console.error('Erreur envoi mail :', mailErr.message);
              // On ne bloque pas l'inscription si le mail échoue
            }

            res.status(201).json({
              message: 'Inscription réussie ! Vérifiez votre email pour valider votre compte.'
            });
          }
        );
      } catch (e) {
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    }
  );
};

// GET /api/auth/validate/:token
const validateEmail = (req, res) => {
  const { token } = req.params;

  db.query(
    'SELECT id FROM users WHERE token_validation = ? AND est_valide = FALSE',
    [token],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (results.length === 0) {
        return res.status(400).json({ message: 'Lien invalide ou déjà utilisé.' });
      }

      db.query(
        'UPDATE users SET est_valide = TRUE, token_validation = NULL WHERE id = ?',
        [results[0].id],
        (err2) => {
          if (err2) return res.status(500).json({ message: 'Erreur serveur.' });
          res.json({ message: 'Compte validé avec succès ! Vous pouvez vous connecter.' });
        }
      );
    }
  );
};

// POST /api/auth/login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis.' });
  }

  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (results.length === 0) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
      }

      const user = results[0];

      if (!user.est_valide) {
        return res.status(403).json({ message: 'Compte non validé. Vérifiez votre email.' });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
      }

      // Mise à jour points et nb_connexions
      const pointsConnexion = 0.25;
      db.query(
        'UPDATE users SET nb_connexions = nb_connexions + 1, points = points + ? WHERE id = ?',
        [pointsConnexion, user.id]
      );
      db.query(
        'INSERT INTO historique_connexions (user_id, type_action, points_gagnes) VALUES (?, "connexion", ?)',
        [user.id, pointsConnexion]
      );

      // Vérifier si le niveau doit monter automatiquement
      const nouveauNiveau = calculerNiveau(user.points + pointsConnexion);
      if (nouveauNiveau !== user.niveau) {
        db.query('UPDATE users SET niveau = ? WHERE id = ?', [nouveauNiveau, user.id]);
        user.niveau = nouveauNiveau;
      }

      const token = jwt.sign(
        { id: user.id, pseudo: user.pseudo, niveau: user.niveau },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Connexion réussie.',
        token,
        user: {
          id:          user.id,
          pseudo:      user.pseudo,
          nom:         user.nom,
          prenom:      user.prenom,
          email:       user.email,
          niveau:      user.niveau,
          points:      user.points + pointsConnexion,
          type_membre: user.type_membre,
          photo_url:   user.photo_url
        }
      });
    }
  );
};

// Calcul automatique du niveau selon les points
const calculerNiveau = (points) => {
  if (points >= 7)  return 'expert';
  if (points >= 5)  return 'avance';
  if (points >= 3)  return 'intermediaire';
  return 'debutant';
};

module.exports = { register, login, validateEmail };
