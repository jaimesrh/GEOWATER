const db = require('../config/db');

const Zona = {
    getAll: async () => {
        const [rows] = await db.promise().query('SELECT * FROM zonas');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.promise().query('SELECT * FROM zonas WHERE id = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const [result] = await db.promise().query(
            'INSERT INTO zonas (nombre, codigo_postal, estado_operacion) VALUES (?, ?, ?)',
            [data.nombre, data.codigo_postal, data.estado_operacion || 'Activa']
        );
        return result.insertId;
    },
    update: async (id, data) => {
        const [result] = await db.promise().query(
            'UPDATE zonas SET nombre = ?, codigo_postal = ?, estado_operacion = ? WHERE id = ?',
            [data.nombre, data.codigo_postal, data.estado_operacion, id]
        );
        return result.affectedRows;
    },
    delete: async (id) => {
        const [result] = await db.promise().query('DELETE FROM zonas WHERE id = ?', [id]);
        return result.affectedRows;
    },
    // Endpoint extra: Obtener zonas en mantenimiento
    getEnMantenimiento: async () => {
        const [rows] = await db.promise().query("SELECT * FROM zonas WHERE estado_operacion = 'Mantenimiento'");
        return rows;
    }
};

module.exports = Zona;