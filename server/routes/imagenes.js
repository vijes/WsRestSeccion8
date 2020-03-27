const express = require('express');
const fs = require('fs');
const path = require('path');

const { verificarTokenUrl } = require('../middlewares/autenticacion');
let app = express();

app.get('/imagen/:tipo/:img', verificarTokenUrl, (req, res) => {

    let tipo = req.params.tipo;
    let nombreImagen = req.params.img;

    let pathUrl = path.resolve(__dirname, `../../recursos/imagenes/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathUrl)) {
        res.sendFile(pathUrl);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/original.jpg');
        res.sendFile(noImagePath);
    }

});

module.exports = app;