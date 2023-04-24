const mongoose = require('mongoose');
const { Schema } = mongoose;

const Ingreso = new Schema({
    monto: {
        type: String,
    },
    descripcion: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Ingreso', Ingreso);