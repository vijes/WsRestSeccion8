const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken } = require('../middlewares/autenticacion');
const { verificarRoleAdmin } = require('../middlewares/autenticacion');

const Usuario = require('../models/usuario');

const app = express();

// Servicios
app.get('/usuario', verificaToken, (req, res) => {

    // return res.json({
    //     usuario: req.usuario
    // });
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuariosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            };

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuariosDB,
                    numeroRegistros: conteo
                });
            });


        });

});

app.post('/usuario', [verificaToken, verificarRoleAdmin], (req, res) => {

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

app.put('/usuario/:idRes', [verificaToken, verificarRoleAdmin], (req, res) => {

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
            };
            res.json({
                ok: true,
                usuario: usuarioDB

            });

        });

});

/**
 * Metodo para eliminar registros
 */
app.delete('/usuario/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    // Borrado fisico
    Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                err: `Usuario no encontrado, id: ${id}`
            });
        };

        res.json({
            ok: true,
            usuarioEliminado
        });
    });

});

app.delete('/usuarioInactivar/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            usuarioDB
        });
    })
});
module.exports = app;