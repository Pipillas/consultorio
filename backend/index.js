require('./database.js');
const fs = require('fs');
const Paciente = require('./models/Paciente.js');
const { Server } = require('socket.io');
const Gasto = require('./models/Gasto.js');
const Ingreso = require('./models/Ingreso.js');
const io = new Server(4000, {
    cors: {
        origin: "*",
    }
});

io.on('connection', (socket) => {
    socket.on('req-guardar-paciente', async paciente => {
        paciente = {
            ...paciente,
            fecha: new Date(),
        }
        await Paciente.create(paciente);
        io.emit('res-cambio-paciente');
        if (paciente.numero >= '999') {
            fs.writeFileSync('numero.txt', '0');
        } else {
            fs.writeFileSync('numero.txt', (parseInt(paciente.numero) + 1).toString());
        }
        io.emit('res-numero', fs.readFileSync('numero.txt', { encoding: 'utf-8' }));
        io.emit('res-cambio-caja');
    });
    socket.on('req-pacientes', async (tipoEstudio, fechaString, texto, page, limit) => {
        if (fechaString === 'todos') {
            const query = {
                tipoEstudio,
                $or: [
                    { tipoEstudio: { $regex: texto, $options: 'i' } },
                    { doctor: { $regex: texto, $options: 'i' } },
                    { nombre: { $regex: texto, $options: 'i' } },
                    { numero: { $regex: texto, $options: 'i' } },
                    { estudio: { $regex: texto, $options: 'i' } },
                    { obraSocial: { $regex: texto, $options: 'i' } },
                    { telefono: { $regex: texto, $options: 'i' } },
                    { efectivo: { $regex: texto, $options: 'i' } },
                    { tarjeta: { $regex: texto, $options: 'i' } },
                    { color: { $regex: texto, $options: 'i' } },
                    { color2: { $regex: texto, $options: 'i' } },
                ]
            };
            const pacientes = await Paciente.find(query).sort({ fecha: -1 }).limit(limit).skip((page - 1) * limit);
            const cantidadTotal = await Paciente.find(query).count();
            socket.emit('res-pacientes', pacientes, Math.ceil(cantidadTotal / limit));
        } else if (fechaString) {
            const fecha = new Date(fechaString);
            const query = {
                tipoEstudio,
                fecha: {
                    $gte: fecha,
                    $lt: new Date(fecha.getTime() + 24 * 60 * 60 * 1000)
                },
                $or: [
                    { tipoEstudio: { $regex: texto, $options: 'i' } },
                    { doctor: { $regex: texto, $options: 'i' } },
                    { nombre: { $regex: texto, $options: 'i' } },
                    { numero: { $regex: texto, $options: 'i' } },
                    { estudio: { $regex: texto, $options: 'i' } },
                    { obraSocial: { $regex: texto, $options: 'i' } },
                    { telefono: { $regex: texto, $options: 'i' } },
                    { efectivo: { $regex: texto, $options: 'i' } },
                    { tarjeta: { $regex: texto, $options: 'i' } },
                    { color: { $regex: texto, $options: 'i' } },
                    { color2: { $regex: texto, $options: 'i' } },
                ]
            };
            const pacientes = await Paciente.find(query).sort({ fecha: -1 });
            socket.emit('res-pacientes', pacientes);
        };
    });
    socket.on('req-borrar-paciente', async id => {
        await Paciente.findByIdAndDelete(id);
        io.emit('res-cambio-paciente');
        io.emit('res-cambio-caja');
    });
    socket.on('req-paciente-a-editar', async id => {
        const paciente = await Paciente.findById(id);
        socket.emit('res-paciente-a-editar', paciente);
    });
    socket.on('req-editar-paciente', async paciente => {
        await Paciente.findByIdAndUpdate(paciente._id, paciente);
        io.emit('res-cambio-paciente');
        io.emit('res-cambio-caja');
    });
    socket.on('req-cambiar-color', async (id, color) => {
        await Paciente.findByIdAndUpdate(id, { color });
        io.emit('res-cambio-paciente');
    });
    socket.on('req-cambiar-color2', async (id, color2) => {
        await Paciente.findByIdAndUpdate(id, { color2 });
        io.emit('res-cambio-paciente');
    });
    socket.on('req-numero', () => socket.emit('res-numero', fs.readFileSync('numero.txt', { encoding: 'utf-8' })));
    socket.on('req-caja', async fechaString => {
        const fecha = new Date(fechaString);
        const query = {
            fecha: {
                $gte: fecha,
                $lt: new Date(fecha.getTime() + 24 * 60 * 60 * 1000)
            }
        };
        const sumaEfectivo = await Paciente.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: { $toDouble: "$efectivo" } } } }
        ]);
        const sumaIngresos = await Ingreso.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: { $toDouble: "$monto" } } } }
        ]);
        const sumaGastos = await Gasto.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: { $toDouble: "$monto" } } } }
        ]);
        const totalEfectivo = sumaEfectivo.length > 0 ? sumaEfectivo[0].total : 0;
        const totalIngresos = sumaIngresos.length > 0 ? sumaIngresos[0].total : 0;
        const totalGastos = sumaGastos.length > 0 ? sumaGastos[0].total : 0;
        const ingresos = await Ingreso.find(query).sort({ fecha: -1 });
        const gastos = await Gasto.find(query).sort({ fecha: -1 });
        socket.emit('res-caja', totalEfectivo, totalIngresos, totalGastos, ingresos, gastos);
    });
    socket.on('req-gasto', async (monto, descripcion) => {
        await Gasto.create({
            monto,
            descripcion
        });
        io.emit('res-cambio-caja');
    });
    socket.on('req-ingreso', async (monto, descripcion) => {
        await Ingreso.create({
            monto,
            descripcion
        });
        io.emit('res-cambio-caja');
    });
});