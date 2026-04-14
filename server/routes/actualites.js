const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// GET /api/actualites — accessible sans connexion (module Information / visiteur)
// Query params : categorie, q (mot-clé)
router.get('/', (req, res) => {
  const { categorie, q } = req.query;
  let query  = 'SELECT * FROM actualites WHERE visible = TRUE';
  const params = [];

  if (categorie) { query += ' AND categorie = ?'; params.push(categorie); }
  if (q)         { query += ' AND (titre LIKE ? OR contenu LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }

  query += ' ORDER BY created_at DESC';

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur.' });
    res.json(results);
  });
});

// GET /api/actualites/:id
router.get('/:id', (req, res) => {
  db.query(
    'SELECT * FROM actualites WHERE id = ? AND visible = TRUE',
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (results.length === 0) return res.status(404).json({ message: 'Actualité non trouvée.' });
      res.json(results[0]);
    }
  );
});

module.exports = router;
