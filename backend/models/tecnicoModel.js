const db = require('../config/db');

const Tecnico = {
    getAll: async () => { const [rows] = await db.promise().query('SELECT * FROM tecnicos'); return rows; },
    getById: async (id) => { const [rows] = await db.promise().query('SELECT * FROM tecnicos WHERE id = ?', [id]); return rows[0]; },
    create: async (data) => {
        const [result] = await db.promise().query('INSERT INTO tecnicos (nombre, especialidad, disponibilidad) VALUES (?, ?, ?)', [data.nombre, data.especialidad, data.disponibilidad || 'Disponible']);
        return result.insertId;
    },
    update: async (id, data) => {
        const [result] = await db.promise().query('UPDATE tecnicos SET nombre = ?, especialidad = ?, disponibilidad = ? WHERE id = ?', [data.nombre, data.especialidad, data.disponibilidad, id]);
        return result.affectedRows;
    },
    delete: async (id) => { const [result] = await db.promise().query('DELETE FROM tecnicos WHERE id = ?', [id]); return result.affectedRows; },
    getDisponibles: async () => { const [rows] = await db.promise().query("SELECT * FROM tecnicos WHERE disponibilidad = 'Disponible'"); return rows; }
};
module.exports = Tecnico;