const mongoose = require('mongoose');
const { Schema } = mongoose;

const Paciente = new Schema({
    tipoEstudio: {
        type: String,
    },
    doctor: {
        type: String,
    },
    nombre: {
        type: String,
    },
    numero: {
        type: String,
    },
    estudio: {
        type: String
    },
    obraSocial: {
        type: String
    },
    telefono: {
        type: String
    },
    efectivo: {
        type: String
    },
    tarjeta: {
        type: String
    },
    color: {
        type: String
    },
    color2: {
        type: String
    },
    fecha: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Paciente', Paciente);