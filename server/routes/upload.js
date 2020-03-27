const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// default options
app.use(fileUpload());

app.put('/upload', function(req, res) {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se selecciono ningun archivo'
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
    archivo.mv(`recursos/imagenes/${archivo.name}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Se subio correctamente el archivo'
        });
    });
});

module.exports = app;