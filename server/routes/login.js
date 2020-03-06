const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {


    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                mensaje: `No existe el usuario con email: ${body.email}`
            });
        }
        let passworCorrecto = false;
        if (body.password) {
            passworCorrecto = bcrypt.compareSync(body.password, usuarioDB.password);
        }

        if (!passworCorrecto) {
            return res.status(500).json({
                ok: false,
                mensaje: `La contraseña del usuario con email: ${body.email} no es correcta`
            });
        }

        let token = jwt.sign({
                usuarioDB
            }, 'secret-prueba', // }, 'se_puede-poner-lo-que-se-quiera');
            { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuarioDB,
            token: token
        });

    });
});


module.exports = app;