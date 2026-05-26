const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/estadisticaController');
const verificarToken = require('../middlewares/authMiddleware');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.get('/filtro/eficiencia', ctrl.getTopEficiencia); // Endpoint extra
router.post('/', verificarToken, ctrl.create);
router.put('/:id', verificarToken, ctrl.update);
router.delete('/:id', verificarToken, ctrl.deleteEst);
module.exports = router;