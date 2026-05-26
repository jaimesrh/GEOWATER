const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/zonaController');
const verificarToken = require('../middlewares/authMiddleware');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.get('/filtro/mantenimiento', ctrl.getEnMantenimiento);

// Protegidas
router.post('/', verificarToken, ctrl.create);
router.put('/:id', verificarToken, ctrl.update);
router.delete('/:id', verificarToken, ctrl.deleteZona);

module.exports = router;