const express = require('express');

let { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');
let Usuario = require('../models/usuario');

/**
 * Mostrar todas las categorias
 */
app.get('/categoria', (req, res) => {

    Categoria.find({}, (err, categoriasDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Ocurrio un erro al buscar los usuarios.',
                err
            });
        }

        res.json({
            ok: true,
            categorias: categoriasDB
        });
    });

});
/**
 * Mostrar todas la categoria por id
 */
app.get('/categoria/:id', (req, res) => {
    // Categoria.findById(....)
    res.json({
        ok: true,
        message: 'Metodo get categoria por id'
    });
});

/**
 * Cre nueva cateogira
 */
app.post('/categoria', (req, res) => {
    //  regresaar la nueva categoria
    // req.usuario._id

    let body = req.body;
    // Buscar usuario
    Usuario.find({ email: body.emailUsuario }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                message: 'No se encontro el usuario.',
                err
            });
        }

        let categoria = new Categoria();
        categoria.descripcion = body.descripcion;
        categoria.usuario = usuarioDB._id;

        // res.json({
        //     ok: true,
        //     id_asdUsuario: usuarioDB.nombre,
        //     message: 'Metodo post categorias..'
        // });

        categoria.save((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoriaDB
            });
        });

    });


});

/**
 * Actualizar informacion
 */
app.put('/categoria/:id', verificaToken, (req, res) => {

    res.json({
        ok: true,
        message: 'Metodo put categoria'
    });

});
/**
 * Actualizar informacion
 */
app.delete('/categoria/:id', (req, res) => {
    // solo un administrados puede borrar la categoria
    // Que se elimie el registro.
    // Categoria.findByAndRemove
    res.json({
        ok: true,
        message: 'Metodo delete categorias'
    });

});
// Crear en los servicios en postman con cada una de las opciones.

module.exports = app;