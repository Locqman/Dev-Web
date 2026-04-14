const express = require('express');
const router  = express.Router();
const { getMyProfile, updateMyProfile, getAllUsers, getUserById, changerNiveau } = require('../controllers/usersController');
const { verifyToken } = require('../middlewares/auth');

router.get('/',           verifyToken, getAllUsers);
router.get('/me',         verifyToken, getMyProfile);
router.put('/me',         verifyToken, updateMyProfile);
router.put('/me/niveau',  verifyToken, changerNiveau);
router.get('/:id',        verifyToken, getUserById);

module.exports = router;
