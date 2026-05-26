const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ mensaje: 'Acceso denegado. No se envio un token.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ mensaje: 'Formato invalido. Usa: Bearer <token>' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ mensaje: 'Token invalido o expirado' });
    }
};

module.exports = verificarToken;
