const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reporteController');
const verificarToken = require('../middlewares/authMiddleware');

// Rutas Públicas (Lectura)
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.get('/gravedad/:nivel', ctrl.getByGravedad); // Endpoint Extra

// Rutas Protegidas (Solo pueden usar con Token)
router.post('/', verificarToken, ctrl.create);
router.put('/:id', verificarToken, ctrl.update);
router.delete('/:id', verificarToken, ctrl.deleteReporte);

module.exports = router;