const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Mensaje para confirmar que jaló
db.getConnection((err, connection) => {
    if (err) console.error('❌ Error conectando a Aiven:', err.message);
    else {
        console.log('✅ Conectado a la base de datos MySQL en la nube');
        connection.release();
    }
});

module.exports = db;
