const db = require('./config/db');

const ejecutar = async () => {
    try {
        console.log("⏳ Conectando a Aiven y verificando TODAS las tablas...");

        // 1. Usuarios
        await db.promise().query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                correo VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Tabla 'usuarios' lista.");

        // 2. Reportes
        await db.promise().query(`
            CREATE TABLE IF NOT EXISTS reportes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                latitud DECIMAL(10, 8) NOT NULL,
                longitud DECIMAL(11, 8) NOT NULL,
                gravedad ENUM('Baja', 'Media', 'Alta') NOT NULL,
                descripcion TEXT NOT NULL,
                estado ENUM('pendiente', 'proceso', 'reparada') DEFAULT 'pendiente',
                usuario_id INT NULL,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
            )
        `);
        console.log("✅ Tabla 'reportes' lista.");

        // 3. Zonas
        await db.promise().query(`
            CREATE TABLE IF NOT EXISTS zonas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                codigo_postal VARCHAR(10) NOT NULL,
                estado_operacion ENUM('Activa', 'Mantenimiento', 'Inactiva') DEFAULT 'Activa'
            )
        `);
        console.log("✅ Tabla 'zonas' lista.");

        // 4. Técnicos
        await db.promise().query(`
            CREATE TABLE IF NOT EXISTS tecnicos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                especialidad VARCHAR(100) NOT NULL,
                disponibilidad ENUM('Disponible', 'Ocupado') DEFAULT 'Disponible'
            )
        `);
        console.log("✅ Tabla 'tecnicos' lista.");

        // 5. Estadísticas
        await db.promise().query(`
            CREATE TABLE IF NOT EXISTS estadisticas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                zona VARCHAR(100) NOT NULL,
                fugas_reparadas INT DEFAULT 0,
                tiempo_promedio_horas DECIMAL(5,2) NOT NULL
            )
        `);
        console.log("✅ Tabla 'estadisticas' lista.");

        console.log("¡TODO LISTO! Tu base de datos está al 100%.");
        process.exit(0);
    } catch (error) {
        console.error("Error al crear las tablas:", error);
        process.exit(1);
    }
};

ejecutar();