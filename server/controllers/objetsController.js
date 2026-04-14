const db = require('../config/db');

// Ajouter des points pour une action utilisateur
const ajouterPoints = (userId, typeAction, detail = null) => {
  const pointsAction = 0.50;
  db.query(
    'UPDATE users SET nb_actions = nb_actions + 1, points = points + ? WHERE id = ?',
    [pointsAction, userId]
  );
  db.query(
    'INSERT INTO historique_connexions (user_id, type_action, detail, points_gagnes) VALUES (?, ?, ?, ?)',
    [userId, typeAction, detail, pointsAction]
  );
};

// GET /api/objets — liste avec filtres
// Query params : type, etat, zone, marque, q (mot-clé)
const getObjets = (req, res) => {
  const { type, etat, zone, marque, q, categorie_id } = req.query;

  let query  = `
    SELECT o.*, c.nom AS categorie_nom
    FROM objets_connectes o
    LEFT JOIN categories_objets c ON o.categorie_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (q) {
    query += ' AND (o.nom LIKE ? OR o.description LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }
  if (type)         { query += ' AND o.type = ?';         params.push(type); }
  if (etat)         { query += ' AND o.etat = ?';         params.push(etat); }
  if (zone)         { query += ' AND o.zone LIKE ?';      params.push(`%${zone}%`); }
  if (marque)       { query += ' AND o.marque LIKE ?';    params.push(`%${marque}%`); }
  if (categorie_id) { query += ' AND o.categorie_id = ?'; params.push(categorie_id); }

  query += ' ORDER BY o.nom ASC';

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur.' });
    res.json(results);
  });
};

// GET /api/objets/:id — détail d'un objet + ses attributs
const getObjetById = (req, res) => {
  const objet_id = req.params.id;

  db.query(
    `SELECT o.*, c.nom AS categorie_nom
     FROM objets_connectes o
     LEFT JOIN categories_objets c ON o.categorie_id = c.id
     WHERE o.id = ?`,
    [objet_id],
    (err, objets) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      if (objets.length === 0) return res.status(404).json({ message: 'Objet non trouvé.' });

      db.query(
        'SELECT cle, valeur, unite FROM attributs_objets WHERE objet_id = ?',
        [objet_id],
        (err2, attributs) => {
          if (err2) return res.status(500).json({ message: 'Erreur serveur.' });

          // Ajouter des points si utilisateur connecté
          if (req.user) {
            ajouterPoints(req.user.id, 'consultation_objet', objets[0].nom);
          }

          res.json({ ...objets[0], attributs });
        }
      );
    }
  );
};

// POST /api/objets — ajouter un objet (complexe+)
const createObjet = (req, res) => {
  const { id_unique, nom, description, marque, type, connectivite, batterie, zone, categorie_id, attributs } = req.body;

  if (!id_unique || !nom) {
    return res.status(400).json({ message: 'id_unique et nom sont requis.' });
  }

  db.query(
    `INSERT INTO objets_connectes (id_unique, nom, description, marque, type, connectivite, batterie, zone, categorie_id, derniere_interaction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [id_unique, nom, description, marque, type, connectivite, batterie, zone, categorie_id],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Cet id_unique existe déjà.' });
        return res.status(500).json({ message: 'Erreur lors de la création.' });
      }

      const newId = result.insertId;

      // Insérer les attributs dynamiques si fournis
      if (attributs && attributs.length > 0) {
        const values = attributs.map(a => [newId, a.cle, a.valeur, a.unite]);
        db.query('INSERT INTO attributs_objets (objet_id, cle, valeur, unite) VALUES ?', [values]);
      }

      ajouterPoints(req.user.id, 'creation_objet', nom);
      res.status(201).json({ message: 'Objet créé.', id: newId });
    }
  );
};

// PUT /api/objets/:id — modifier un objet (complexe+)
const updateObjet = (req, res) => {
  const { nom, description, marque, type, etat, connectivite, batterie, zone, categorie_id, attributs } = req.body;

  db.query(
    `UPDATE objets_connectes
     SET nom=?, description=?, marque=?, type=?, etat=?, connectivite=?, batterie=?, zone=?, categorie_id=?, derniere_interaction=NOW()
     WHERE id = ?`,
    [nom, description, marque, type, etat, connectivite, batterie, zone, categorie_id, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Erreur lors de la mise à jour.' });

      // Mettre à jour les attributs si fournis
      if (attributs && attributs.length > 0) {
        db.query('DELETE FROM attributs_objets WHERE objet_id = ?', [req.params.id], () => {
          const values = attributs.map(a => [req.params.id, a.cle, a.valeur, a.unite]);
          db.query('INSERT INTO attributs_objets (objet_id, cle, valeur, unite) VALUES ?', [values]);
        });
      }

      ajouterPoints(req.user.id, 'modification_objet', nom);
      res.json({ message: 'Objet mis à jour.' });
    }
  );
};

// POST /api/objets/:id/demande-suppression — demande (complexe)
const demanderSuppression = (req, res) => {
  const { motif } = req.body;
  db.query(
    'INSERT INTO demandes_suppression (objet_id, user_id, motif) VALUES (?, ?, ?)',
    [req.params.id, req.user.id, motif],
    (err) => {
      if (err) return res.status(500).json({ message: 'Erreur serveur.' });
      res.json({ message: 'Demande de suppression envoyée à l\'administrateur.' });
    }
  );
};

// GET /api/objets/:id/historique — historique des données d'un objet
const getHistorique = (req, res) => {
  const { cle, limit } = req.query;
  let query  = 'SELECT cle, valeur, timestamp FROM historique_objets WHERE objet_id = ?';
  const params = [req.params.id];

  if (cle) { query += ' AND cle = ?'; params.push(cle); }
  query += ' ORDER BY timestamp DESC';
  if (limit) { query += ' LIMIT ?'; params.push(parseInt(limit)); }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur.' });
    res.json(results);
  });
};

// GET /api/objets/categories — liste des catégories
const getCategories = (req, res) => {
  db.query('SELECT * FROM categories_objets ORDER BY nom', (err, results) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur.' });
    res.json(results);
  });
};

module.exports = {
  getObjets, getObjetById, createObjet, updateObjet,
  demanderSuppression, getHistorique, getCategories
};
