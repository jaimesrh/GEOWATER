const Zona = require('../models/zonaModel');

const getAll = async (req, res) => res.json(await Zona.getAll());
const getById = async (req, res) => {
    const zona = await Zona.getById(req.params.id);
    zona ? res.json(zona) : res.status(404).json({ mensaje: "Zona no encontrada" });
};
const create = async (req, res) => {
    if (!req.body.nombre || !req.body.codigo_postal) return res.status(400).json({ mensaje: "Nombre y CP son obligatorios" });
    const id = await Zona.create(req.body);
    res.status(201).json({ mensaje: "Zona creada", id });
};
const update = async (req, res) => {
    const affected = await Zona.update(req.params.id, req.body);
    affected === 0 ? res.status(404).json({ mensaje: "Zona no existe" }) : res.json({ mensaje: "Zona actualizada" });
};
const deleteZona = async (req, res) => {
    const affected = await Zona.delete(req.params.id);
    affected === 0 ? res.status(404).json({ mensaje: "Zona no existe" }) : res.json({ mensaje: "Zona eliminada" });
};
const getEnMantenimiento = async (req, res) => res.json(await Zona.getEnMantenimiento());

module.exports = { getAll, getById, create, update, deleteZona, getEnMantenimiento };