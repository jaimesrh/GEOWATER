const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tecnicoController');
const verificarToken = require('../middlewares/authMiddleware');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.get('/filtro/disponibles', ctrl.getDisponibles); // Endpoint extra
router.post('/', verificarToken, ctrl.create);
router.put('/:id', verificarToken, ctrl.update);
router.delete('/:id', verificarToken, ctrl.deleteTecnico);
module.exports = router;