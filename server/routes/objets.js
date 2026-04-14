const express = require('express');
const router  = express.Router();
const {
  getObjets, getObjetById, createObjet, updateObjet,
  demanderSuppression, getHistorique, getCategories
} = require('../controllers/objetsController');
const { verifyToken, requireNiveau } = require('../middlewares/auth');

// Accessible à tous les connectés (simple+)
router.get('/categories',               verifyToken, getCategories);
router.get('/',                         verifyToken, getObjets);
router.get('/:id',                      verifyToken, getObjetById);
router.get('/:id/historique',           verifyToken, requireNiveau('avance'), getHistorique);

// Réservé aux utilisateurs complexes (avancé+)
router.post('/',                        verifyToken, requireNiveau('avance'), createObjet);
router.put('/:id',                      verifyToken, requireNiveau('avance'), updateObjet);
router.post('/:id/demande-suppression', verifyToken, requireNiveau('avance'), demanderSuppression);

module.exports = router;
