const jwt = require('jsonwebtoken');

const JWT_SECRET = 'skiconnect_secret_2025'; // simple pour projet école

// Vérifie que l'utilisateur est connecté
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Token manquant, accès refusé.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, pseudo, niveau }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide ou expiré.' });
  }
};

// Vérifie un niveau minimum requis
const requireNiveau = (niveauMin) => {
  const ordre = { debutant: 1, intermediaire: 2, avance: 3, expert: 4 };
  return (req, res, next) => {
    const niveauUser = req.user?.niveau;
    if (!niveauUser || ordre[niveauUser] < ordre[niveauMin]) {
      return res.status(403).json({
        message: `Niveau insuffisant. Requis : ${niveauMin}, actuel : ${niveauUser}`
      });
    }
    next();
  };
};

module.exports = { verifyToken, requireNiveau, JWT_SECRET };
