const express = require('express');
const Usuario = require('../models/usuario');

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
        password: body.password,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
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
    /*
        if (body.nombre === undefined) {
            res.status(400).json({
                ok: false,
                mensaje: "El nombre es requerido"
            });
        } else {

            res.json({
                usuario: body
            });
        }
    */
});

app.put('/usuario/:idRes', function(req, res) {

    let id = req.params.idRes;

    let body = req.body;
    Usuario.findByIdAndUpdate(id, body, { new: true },
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