const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const { verifyToken } = require('../middlewares/auth');

// GET /api/services — liste des services (accessible à tous les connectés)
router.get('/', verifyToken, (req, res) => {
  db.query('SELECT * FROM services WHERE actif = TRUE ORDER BY nom', (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur.' });
    res.json(results);
  });
});

// GET /api/services/:id — détail d'un service + objets associés
router.get('/:id', verifyToken, (req, res) => {
  db.query('SELECT * FROM services WHERE id = ?', [req.params.id], (err, services) => {
    if (err || services.length === 0) return res.status(404).json({ message: 'Service non trouvé.' });

    db.query(
      `SELECT o.id, o.nom, o.etat, o.zone, o.type
       FROM objets_connectes o
       JOIN objets_services os ON o.id = os.objet_id
       WHERE os.service_id = ?`,
      [req.params.id],
      (err2, objets) => {
        if (err2) return res.status(500).json({ message: 'Erreur serveur.' });
        res.json({ ...services[0], objets });
      }
    );
  });
});

module.exports = router;
