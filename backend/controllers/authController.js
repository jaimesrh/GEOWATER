const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Auth = require('../models/authModel');
require('dotenv').config();

const registro = (req, res) => {
    const { nombre, email, password } = req.body;
    
    if (!nombre || !email || !password) {
        return res.status(400).json({ mensaje: 'Nombre, email y password son requeridos' });
    }

    Auth.findByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            return res.status(400).json({ mensaje: 'Este email ya está registrado' });
        }

        const passwordEncriptada = bcrypt.hashSync(password, 10);
        
        Auth.createUser({ nombre, correo: email, password: passwordEncriptada }, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ mensaje: 'Usuario registrado correctamente', id: result.insertId });
        });
    });
};

const login = (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ mensaje: 'Email y password son requeridos' });
    }

    Auth.findByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        const usuario = results[0];
        const passwordCorrecta = bcrypt.compareSync(password, usuario.password);
        
        if (!passwordCorrecta) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.correo, nombre: usuario.nombre },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
        );

        res.json({
            mensaje: 'Login exitoso',
            token,
            nombre: usuario.nombre  // ← CORRECCIÓN: agregar nombre para el navbar
        });
    });
};

module.exports = { registro, login };
