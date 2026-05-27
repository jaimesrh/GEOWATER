const pool = require('../config/db');

const getInicio = async (req, res) => {
    try {
        const [results] = await pool.promise().query('SELECT COUNT(*) AS total FROM reportes');
        res.status(200).json({
            mensaje: 'Bienvenido al sistema',
            fecha: new Date().toISOString(),
            módulos: ['reportes', 'tecnicos'],
            resumen: {
                total_reportes: results[0].total
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
};

module.exports = { getInicio };
