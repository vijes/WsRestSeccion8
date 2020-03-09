const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Usuario = mongoose.model('Usuario');

const uniqueValidator = require('mongoose-unique-validator');


let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'Es requerida la descripcion de la categoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

categoriaSchema.plugin(
    uniqueValidator, {
        message: '{PATH} debe ser unico'
    }
);
module.exports = mongoose.model('Categoria', categoriaSchema);