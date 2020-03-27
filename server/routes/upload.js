const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se selecciono ningun archivo'
            }
        });
    }

    // validar el tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Tipos permitidas ${tiposValidos}`,
                ext: extensionArchivo
            }
        });
    }
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let archivo = req.files.archivo;
    let extensionArchivo = archivo.name.split('.')[1];
    console.log(`Archivo a subir: ${archivo.name}`);
    console.log(`Extension archivo: ${extensionArchivo}`);

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Extensiones permitidas ${extensionesValidas}`,
                ext: extensionArchivo
            }
        });
    }
    // Cambiar el nombre al archivo
    // 123kj12h3k12h3k123-123.jpg
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${extensionArchivo}`;
    archivo.mv(`recursos/imagenes/${ tipo }/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Imagen cargada
        // if (tipo == 'usuarios') {
        //     imagensuario(id, res, nombreArchivo);
        // } else if (tipo == 'productos') {
        //     imagenProducto(id, res, nombreArchivo);
        // }
        switch (tipo) {
            case 'usuarios':
                imagensuario(id, res, nombreArchivo);
                break;
            case 'productos':
                imagenProducto(id, res, nombreArchivo);
                break;
            default:
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'EL tipo no corresponde'
                    }
                });
                break;
        }
    });
});

function imagensuario(id, res, nombreArcivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArcivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borraArchivo(nombreArcivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArcivo;

        usuarioDB.save((err, ususarioGuardado) => {
            res.json({
                usuario: ususarioGuardado,
                img: nombreArcivo
            });
        });
    });
}

function imagenProducto(id, res, nombreArcivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArcivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borraArchivo(nombreArcivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        borraArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArcivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado
            });
        });

    });
}


function borraArchivo(nombreImagen, tipo) {
    let pathUrl = path.resolve(__dirname, `../../recursos/imagenes/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl);
    }

}
module.exports = app;