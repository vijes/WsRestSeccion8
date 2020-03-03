require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));

// Conexion para mongoose
mongoose.connect('mongodb://localhost:27017/cafe', (err, res) => {
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