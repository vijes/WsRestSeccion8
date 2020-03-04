const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

// Servicios
app.get('/usuario', function(req, res) {
    res.json('get usuario local');
});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }

        // el status 200 esta implicito por ende no es necesario enviarlo.
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:idRes', function(req, res) {

    let id = req.params.idRes;
    let body = _.pick(req.body, ['nombre',
        'email',
        'img',
        'role',
        'estado'
    ]);

    // Se puede hacer esto pero si son muchos campos no aplica asi
    // que mejor se utiliza underscore como se ve en la linea 43
    // delete body.password;
    // delete body.google;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true },
        (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioDB

            });

        });

});

app.delete('/usuario', function(req, res) {
    res.json('delete usuario');
});
module.exports = app;