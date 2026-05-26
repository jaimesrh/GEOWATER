const db = require('../config/db');

const Estadistica = {
    getAll: async () => { const [rows] = await db.promise().query('SELECT * FROM estadisticas'); return rows; },
    getById: async (id) => { const [rows] = await db.promise().query('SELECT * FROM estadisticas WHERE id = ?', [id]); return rows[0]; },
    create: async (data) => {
        const [result] = await db.promise().query('INSERT INTO estadisticas (zona, fugas_reparadas, tiempo_promedio_horas) VALUES (?, ?, ?)', [data.zona, data.fugas_reparadas, data.tiempo_promedio_horas]);
        return result.insertId;
    },
    update: async (id, data) => {
        const [result] = await db.promise().query('UPDATE estadisticas SET zona = ?, fugas_reparadas = ?, tiempo_promedio_horas = ? WHERE id = ?', [data.zona, data.fugas_reparadas, data.tiempo_promedio_horas, id]);
        return result.affectedRows;
    },
    delete: async (id) => { const [result] = await db.promise().query('DELETE FROM estadisticas WHERE id = ?', [id]); return result.affectedRows; },
    getTopEficiencia: async () => { const [rows] = await db.promise().query("SELECT * FROM estadisticas ORDER BY tiempo_promedio_horas ASC LIMIT 3"); return rows; }
};
module.exports = Estadistica;