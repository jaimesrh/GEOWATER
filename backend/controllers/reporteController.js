const Reporte = require('../models/reporteModel');

// 1. Obtener todos
const getAll = async (req, res) => {
    try {
        const reportes = await Reporte.getAll();
        res.status(200).json(reportes);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los reportes" });
    }
};

// 2. Obtener por ID
const getById = async (req, res) => {
    try {
        const reporte = await Reporte.getById(req.params.id);
        if (!reporte) return res.status(404).json({ mensaje: "Reporte no encontrado" });
        res.status(200).json(reporte);
    } catch (error) {
        res.status(500).json({ error: "Error de servidor" });
    }
};

// 3. Crear (Validaciones de negocio requeridas)
const create = async (req, res) => {
    const { latitud, longitud, gravedad, descripcion } = req.body;
    
    // Validación: No permitir campos vacíos (Prueba de error 400)
    if (!latitud || !longitud || !gravedad || !descripcion) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios para crear el reporte" });
    }

    try {
        // req.usuario.id viene del token de quien inició sesión
        const usuario_id = req.usuario ? req.usuario.id : null; 
        const id = await Reporte.create({ latitud, longitud, gravedad, descripcion, usuario_id });
        res.status(201).json({ mensaje: "Reporte creado exitosamente", id });
    } catch (error) {
        res.status(500).json({ error: "Error al crear reporte" });
    }
};

// 4. Actualizar
const update = async (req, res) => {
    const { estado } = req.body;
    if (!estado) return res.status(400).json({ mensaje: "El estado es requerido" });

    try {
        const affected = await Reporte.update(req.params.id, estado);
        if (affected === 0) return res.status(404).json({ mensaje: "Reporte no existe" });
        res.status(200).json({ mensaje: "Estado del reporte actualizado" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar" });
    }
};

// 5. Eliminar
const deleteReporte = async (req, res) => {
    try {
        const affected = await Reporte.delete(req.params.id);
        if (affected === 0) return res.status(404).json({ mensaje: "Reporte no existe" });
        res.status(200).json({ mensaje: "Reporte eliminado permanentemente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
};

// 6. Endpoint Extra
const getByGravedad = async (req, res) => {
    try {
        const reportes = await Reporte.getByGravedad(req.params.nivel);
        res.status(200).json(reportes);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar" });
    }
};

module.exports = { getAll, getById, create, update, deleteReporte, getByGravedad };