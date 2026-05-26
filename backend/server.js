const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Pool de conexiones (Eficiencia de Ingeniería)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middlewares
app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const inicioRoutes = require('./routes/inicio');
app.use('/api/inicio', inicioRoutes);

// Rutas de Módulos CRUD
app.use('/api/reportes', require('./routes/reportes'));
app.use('/api/zonas', require('./routes/zonas'));


app.use('/api/tecnicos', require('./routes/tecnicos'));
app.use('/api/estadisticas', require('./routes/estadisticas'));



// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Backend Impecable corriendo en puerto ${PORT}`);
});





