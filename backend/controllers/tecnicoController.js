const Tecnico = require('../models/tecnicoModel');

const getAll = async (req, res) => res.json(await Tecnico.getAll());
const getById = async (req, res) => {
    const tecnico = await Tecnico.getById(req.params.id);
    tecnico ? res.json(tecnico) : res.status(404).json({ mensaje: "Técnico no encontrado" });
};
const create = async (req, res) => {
    if (!req.body.nombre || !req.body.especialidad) return res.status(400).json({ mensaje: "Nombre y especialidad requeridos" });
    const id = await Tecnico.create(req.body);
    res.status(201).json({ mensaje: "Técnico creado", id });
};
const update = async (req, res) => {
    const affected = await Tecnico.update(req.params.id, req.body);
    affected === 0 ? res.status(404).json({ mensaje: "No existe" }) : res.json({ mensaje: "Actualizado" });
};
const deleteTecnico = async (req, res) => {
    const affected = await Tecnico.delete(req.params.id);
    affected === 0 ? res.status(404).json({ mensaje: "No existe" }) : res.json({ mensaje: "Eliminado" });
};
const getDisponibles = async (req, res) => res.json(await Tecnico.getDisponibles());

module.exports = { getAll, getById, create, update, deleteTecnico, getDisponibles };