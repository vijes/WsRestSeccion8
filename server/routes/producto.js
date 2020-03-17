const express = require('express');
const _ = require('underscore');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

/**
 * Obtener productos
 */
app.get('/producto', verificaToken, (req, res) => {
    /**
     * trae todos los productos
     * populate con usuario y categoria
     * paginado
     */
    let limite = req.query.limite || 100;
    limite = Number(limite);
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({})
        .sort('descripcion')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al crear el usuario',
                    err
                });
            }
            if (!productosDB) {
                return res.status(501).json({
                    ok: false,
                    err: {
                        message: 'No se encontraron productos'
                    }
                });
            }
            res.json({
                ok: true,
                productos: productosDB
            });
        });
});

// ===========================
//  Buscar productos
// ===========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');
    console.log('buscar poductos por ' + regex);
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        })


});

/**
 * Obtener producto por ID
 */
app.get('/producto/:id', verificaToken, (req, res) => {
    /**
     * trae todos los productos
     * populate con usuario y categoria
     * paginado
     */

    let idRes = req.params.id;

    Producto.findById(idRes)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre, email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: `Error al buscar productos por el id ${idRes}`,
                    err
                });
            }
            if (!productoDB) {
                return res.status(501).json({
                    ok: false,
                    err: {
                        message: `No se encontro un producto con el id ${idRes}`
                    }
                });
            }
            return res.json({
                ok: true,
                producto: productoDB
            });
        });
});

/**
 * Crear un nuevo producto
 */
app.post('/producto/', verificaToken, (req, res) => {
    /**
     * grabar el usaurio 
     * gravar la categoria del listado
     */
    let body = req.body;
    let productoCrear = new Producto();

    productoCrear.nombre = body.nombreProducto;
    productoCrear.precioUni = body.precioUnitarioProducto;
    productoCrear.descripcion = body.descripcionProducto;
    productoCrear.categoria = body.idCategoria;
    productoCrear.usuario = req.usuario._id;

    productoCrear.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear el producto',
                err
            });
        }

        res.status(201).json({
            ok: true,
            message: 'Producto creado con exito',
            productoDB
        });
    });
});

/**
 * Actualizar un nuevo producto
 */
app.put('/producto/:id', (req, res) => {
    /**
     * grabar el usaurio 
     * gravar la categoria del listado
     */
    let body = req.body;
    let idRes = req.params.id;

    let productoActualizar = _.pick(body, [
        'nombre',
        'precioUni',
        'descripcion',
        'categoria'
    ]);

    Producto.findByIdAndUpdate(idRes, productoActualizar, { new: true, runValidators: true }, (err, productoActualizadoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al actualizar el producto',
                err
            });
        }
        if (!productoActualizadoDB) {
            return res.status(500).json({
                ok: false,
                message: 'No se encontro un producto para actualizar'
            });
        }
        return res.json({
            ok: true,
            message: 'Se actualizo con exito',
            producto: productoActualizadoDB
        });
    });
});

/**
 * borrar un nuevo producto
 */
app.delete('/producto/:id', verificaToken, (req, res) => {
    /**
     * actualiza el estado a false
     */
    let idRes = req.params.id;

    Producto.findByIdAndUpdate(idRes, { estado: false }, { new: true }, (err, productoEliminadoDB) => {
        if (err) return validarError(err);
        if (!productoEliminadoDB) {
            return res.status(500).json({
                ok: false,
                message: 'No se encontro el producto a eliminar'
            });
        }
        return res.json({
            ok: true,
            message: 'Producto eliminado',
            productoEliminado: productoEliminadoDB

        });
    });
});

validarError = (err) => {
    return res.status(400).json({
        ok: false,
        message: 'Error al actualizar el producto',
        err
    });
}

module.exports = app;