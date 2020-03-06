require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.use(require('./routes/index'));

// Conexion para mongoose
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log('Base de datos online....');

        }
    });


// Puerto del servidor.
app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);

});