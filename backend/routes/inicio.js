const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/inicioController');
const verificarToken = require('../middlewares/authMiddleware'); 

router.get('/', verificarToken, ctrl.getInicio);

module.exports = router;