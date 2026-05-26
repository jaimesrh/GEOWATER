const db = require('../config/db');

const Auth = {
    findByEmail: (correo, callback) => {
        // Usamos "correo" para que coincida con tu tabla real
        db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], callback);
    },
    createUser: (data, callback) => {
        db.query('INSERT INTO usuarios SET ?', [data], callback);
    }
};





module.exports = Auth;


























