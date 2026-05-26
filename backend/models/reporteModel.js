const db = require('../config/db');

const Reporte = {
    // 1. Obtener todos los registros (getAll)
    getAll: async () => {
        const [rows] = await db.promise().query('SELECT * FROM reportes ORDER BY fecha_creacion DESC');
        return rows;
    },

    // 2. Obtener por ID (getById) con prepared statements (?)
    getById: async (id) => {
        const [rows] = await db.promise().query('SELECT * FROM reportes WHERE id = ?', [id]);
        return rows[0];
    },

    // 3. Crear nuevo reporte (create)
    create: async (data) => {
        const [result] = await db.promise().query(
            'INSERT INTO reportes (latitud, longitud, gravedad, descripcion, usuario_id) VALUES (?, ?, ?, ?, ?)',
            [data.latitud, data.longitud, data.gravedad, data.descripcion, data.usuario_id]
        );
        return result.insertId;
    },

    // 4. Actualizar estado (update)
    update: async (id, estado) => {
        const [result] = await db.promise().query(
            'UPDATE reportes SET estado = ? WHERE id = ?',
            [estado, id]
        );
        return result.affectedRows;
    },

    // 5. Eliminar (delete)
    delete: async (id) => {
        const [result] = await db.promise().query('DELETE FROM reportes WHERE id = ?', [id]);
        return result.affectedRows;
    },

    // 6. ENDPOINT EXTRA DE NEGOCIO: Filtrar reportes por gravedad
    getByGravedad: async (gravedad) => {
        const [rows] = await db.promise().query('SELECT * FROM reportes WHERE gravedad = ? ORDER BY fecha_creacion DESC', [gravedad]);
        return rows;
    }
};

module.exports = Reporte;