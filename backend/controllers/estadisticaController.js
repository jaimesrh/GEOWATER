const Estadistica = require('../models/estadisticaModel');

const getAll = async (req, res) => res.json(await Estadistica.getAll());
const getById = async (req, res) => {
    const est = await Estadistica.getById(req.params.id);
    est ? res.json(est) : res.status(404).json({ mensaje: "Estadística no encontrada" });
};
const create = async (req, res) => {
    if (!req.body.zona || !req.body.tiempo_promedio_horas) return res.status(400).json({ mensaje: "Zona y tiempo son requeridos" });
    const id = await Estadistica.create(req.body);
    res.status(201).json({ mensaje: "Estadística creada", id });
};
const update = async (req, res) => {
    const affected = await Estadistica.update(req.params.id, req.body);
    affected === 0 ? res.status(404).json({ mensaje: "No existe" }) : res.json({ mensaje: "Actualizada" });
};
const deleteEst = async (req, res) => {
    const affected = await Estadistica.delete(req.params.id);
    affected === 0 ? res.status(404).json({ mensaje: "No existe" }) : res.json({ mensaje: "Eliminada" });
};
const getTopEficiencia = async (req, res) => res.json(await Estadistica.getTopEficiencia());

module.exports = { getAll, getById, create, update, deleteEst, getTopEficiencia };