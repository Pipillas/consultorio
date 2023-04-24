const mongoose = require('mongoose');
const { Schema } = mongoose;

const Gasto = new Schema({
    monto: {
        type: String,
    },
    descripcion: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Gasto', Gasto);