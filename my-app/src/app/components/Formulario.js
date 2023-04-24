"use client";
import { useState, useEffect } from "react";
import { NumericFormat } from 'react-number-format';
import DoctorSelect from "./DoctorSelect.js";
import { socket } from "../layout.js";
import '../styles/formulario.css';

export default function Formulario({ changeEstudio, pacienteID, editarPaciente }) {

    const [paciente, setPaciente] = useState({
        tipoEstudio: 'radiografia',
        doctor: '',
        numero: '',
        nombre: '',
        estudio: '',
        obraSocial: '',
        telefono: '',
        efectivo: '0',
        tarjeta: '0'
    });

    const pacienteChangeHandler = (key, value) => setPaciente(prev => { return { ...prev, [key]: value } });

    const selectChange = e => {
        if (e.target.value === 'radiografia') {
            pacienteChangeHandler('doctor', '');
        }
        pacienteChangeHandler('tipoEstudio', e.target.value)
        changeEstudio(e.target.value);
    };

    const guardar = () => {
        if (paciente.tipoEstudio === 'ecografia' && paciente.doctor === '') {
            alert('FALTA DOCTOR');
        } else if (paciente.numero === '') {
            alert('FALTA NUMERO');
        } else if (paciente.nombre === '') {
            alert('FALTA NOMBRE');
        } else if (paciente.estudio === '') {
            alert('FALTA ESTUDIO');
        } else if (paciente.obraSocial === '') {
            alert('FALTA OBRA SOCIAL');
        } else if (paciente.telefono === '') {
            alert('FALTA TELEFONO');
        } else if (paciente.efectivo === '') {
            alert('FALTA EFECTIVO');
        } else if (paciente.tarjeta === '') {
            alert('FALTA TARJETA');
        } else {
            if (pacienteID === '') {
                socket.emit('req-guardar-paciente', paciente);
            } else {
                socket.emit('req-editar-paciente', paciente);
                editarPaciente('');
            }
            setPaciente(prev => {
                return {
                    tipoEstudio: prev.tipoEstudio,
                    doctor: '',
                    numero: '',
                    nombre: '',
                    estudio: '',
                    obraSocial: '',
                    telefono: '',
                    efectivo: '0',
                    tarjeta: '0'
                }
            });
        }
    };

    useEffect(() => {
        socket.on('res-numero', numero => setPaciente(prev => { return { ...prev, numero } }));
        socket.on('res-paciente-a-editar', pac => setPaciente(pac));
        if (pacienteID !== '') {
            socket.emit('req-paciente-a-editar', pacienteID);
        };
        socket.emit('req-numero');
        return () => {
            socket.off('res-numero');
            socket.off('res-paciente-a-editar');
        }
    }, [pacienteID]);

    return (
        <section className="form">
            <div className="form-section">
                <span>Tipo de Estudio:</span>
                <select value={paciente.tipoEstudio} onChange={(e) => selectChange(e)}>
                    <option value="radiografia">Radiografia</option>
                    <option value="ecografia">Ecografia</option>
                </select>
            </div>
            <DoctorSelect doctor={paciente.doctor} pacienteChangeHandler={pacienteChangeHandler} estudio={paciente.tipoEstudio} />
            <div className="form-section">
                <span>Nº:</span>
                <input autoComplete="off" value={paciente.numero} name="numero" onChange={e => pacienteChangeHandler(e.target.name, e.target.value)} />
            </div>
            <div className="form-section">
                <span>Nombre:</span>
                <input autoComplete="off" value={paciente.nombre} name="nombre" onChange={e => pacienteChangeHandler(e.target.name, e.target.value)} />
            </div>
            <div className="form-section">
                <span>Estudio:</span>
                <input autoComplete="off" value={paciente.estudio} name="estudio" onChange={e => pacienteChangeHandler(e.target.name, e.target.value)} />
            </div>
            <div className="form-section">
                <span>Obra Social:</span>
                <input autoComplete="off" value={paciente.obraSocial} name="obraSocial" onChange={e => pacienteChangeHandler(e.target.name, e.target.value)} />
            </div>
            <div className="form-section">
                <span>Telefono:</span>
                <input autoComplete="off" value={paciente.telefono} name="telefono" onChange={e => pacienteChangeHandler(e.target.name, e.target.value)} />
            </div>
            <div className="form-section">
                <span>Efectivo:</span>
                <NumericFormat decimalSeparator="," thousandSeparator="." onValueChange={e => pacienteChangeHandler('efectivo', e.floatValue)} value={paciente.efectivo} onKeyDown={e => { if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault() } }} />
            </div>
            <div className="form-section">
                <span>Tarjeta:</span>
                <NumericFormat decimalSeparator="," thousandSeparator="." onValueChange={e => pacienteChangeHandler('tarjeta', e.floatValue)} value={paciente.tarjeta} onKeyDown={e => { if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault() } }} />
            </div>
            <button onClick={guardar} className="guardar-button">
                {
                    pacienteID === '' ? 'GUARDAR' : 'EDITAR'
                }
            </button>
        </section >
    )
}