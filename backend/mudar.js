require('./database.js');
const Paciente = require('./models/Paciente.js');
const fs = require('fs');

setTimeout(() => {
    let data = fs.readdirSync('patients');
    data.forEach(file => {
        let patients = fs.readFileSync(`patients/${file}`, { encoding: 'utf8' });
        let arr = JSON.parse(patients);
        arr.forEach(async pat => {
            await Paciente.findOneAndUpdate({ nombre: pat.name, numero: pat.number }, {
                fecha: new Date(pat.date)
            });
        });
    });
}, 2500);

        // await Paciente.create({
        //     tipoEstudio: pat.studyType,
        //     doctor: pat.doctor,
        //     nombre: pat.name,
        //     numero: pat.number,
        //     estudio: pat.study,
        //     obraSocial: pat.os,
        //     telefono: pat.tel,
        //     efectivo: pat.cash,
        //     tarjeta: pat.card,
        //     color: pat.color,
        //     color2: pat.color1
        // });