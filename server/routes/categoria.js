const express = require('express');

let { verificaToken, verificarRoleAdmin } = require('../middlewares/autenticacion');

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

        Usuario.populate(categoriasDB, { path: 'usuario' }, (err, categoriasDB) => {
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
});
/**
 * Mostrar todas la categoria por id
 */
app.get('/categoria/:id', (req, res) => {
    // Categoria.findById(....)
    let id = req.params.id;
    console.log(`id obtenido: ${id}`);

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Ocurrio un erro al buscar los usuarios.',
                err
            });
        }

        Usuario.populate(categoriaDB, { path: 'usuario' }, (err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Ocurrio un erro al buscar los usuarios.',
                    err
                });
            }

            if (!categoriaDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: `No se encontro registros para el id recibido ${id}`,
                    }
                });
            }
            return res.json({
                ok: true,
                categoria: categoriaDB
            });
        });
    });
});

/**
 * Cre nueva cateogira
 */
app.post('/categoria', verificaToken, (req, res) => {
    //  regresaar la nueva categoria
    // req.usuario._id

    let body = req.body;
    // Buscar usuario
    Usuario.findOne({ email: body.emailUsuario }, (err, usuarioDB) => {
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
        categoria.usuario = usuarioDB.id;

        categoria.save((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                message: 'Usuario creado exitosamente',
                categoriaDB
            });
        });

    });


});

/**
 * Actualizar informacion
 */
app.put('/categoria/:id', verificaToken, (req, res) => {

    let idActualizar = req.params.id;
    let descripcion = req.body.descripcion;

    Categoria.findByIdAndUpdate(idActualizar, { descripcion: descripcion }, { new: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            message: 'Categoria actualizada con exito',
            categoria: categoriaDB
        });
    });

});
/**
 * Actualizar informacion
 */
app.delete('/categoria/:id', [verificaToken, verificarRoleAdmin], (req, res) => {
    // solo un administrados puede borrar la categoria
    // Que se elimie el registro.
    // Categoria.findByAndRemove

    let idRes = req.params.id;

    Categoria.findByIdAndRemove(idRes, (err, categoriaEliminada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!categoriaEliminada) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No se encontro categoria para eliminar'
                }
            });
        }
        return res.json({
            ok: true,
            message: 'Se elimino con exito',
            categoriaEliminada
        });
    });
});
// Crear en los servicios en postman con cada una de las opciones.

module.exports = app;