"use client"
import { useEffect, useState } from 'react';
import { socket } from '../layout';
import { NumericFormat } from 'react-number-format';
import '../../../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import '../styles/table.css';

const stringFecha = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${(new Date().getDate()).toString().padStart(2, '0')}`

export default function Table({ tipoEstudio, params, editarPaciente }) {

    const [pacientes, setPacientes] = useState([]);
    const [fecha, setFecha] = useState(stringFecha);
    const [sumaTotal, setSumaTotal] = useState(0);
    const [textoBuscador, setTextoBuscador] = useState('');
    const [filas, setFilas] = useState(0);
    const [cambio, setCambio] = useState(false);

    const borrarPaciente = (nombre, id) => {
        if (window.confirm(`¿Estas seguro que quieres borrar a ${nombre}?`)) {
            socket.emit('req-borrar-paciente', id);
        }
    };

    const filtrar = e => setTextoBuscador(e.target.value);

    useEffect(() => {
        socket.emit('req-pacientes', tipoEstudio, fecha, textoBuscador);
    }, [tipoEstudio, fecha, textoBuscador, cambio]);

    useEffect(() => {
        let suma = 0;
        pacientes.forEach(pac => {
            suma += parseFloat(pac.efectivo);
        });
        setSumaTotal(suma);
        setFilas(pacientes.length);
    }, [pacientes]);

    useEffect(() => {
        socket.on('res-pacientes', pacs => setPacientes(pacs));
        socket.on('res-cambio-paciente', () => setCambio(prev => !prev));
        return () => {
            socket.off('res-pacientes');
            socket.off('res-cambio-paciente');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='tabla-div'>
            <section className="section-fecha">
                <input autoComplete='off' value={fecha} onChange={e => setFecha(e.target.value)} type="date"></input>
            </section>
            <section className='section-filtrar'>
                <input onChange={e => filtrar(e)}></input>
            </section>
            <table id="tablaDatos">
                <thead>
                    <tr>
                        <th style={{ backgroundColor: '#92aba0', color: 'black' }} colSpan={3}>{filas}</th>
                        <th>HORA</th>
                        <th>Nº</th>
                        {
                            tipoEstudio === 'radiografia'
                                ? <></>
                                : <th>DOCTOR</th>
                        }
                        <th>NOMBRE</th>
                        <th>ESTUDIO</th>
                        <th>OBRA SOCIAL</th>
                        <th>TELEFONO</th>
                        <th style={{ whiteSpace: 'pre-line' }}>
                            <NumericFormat prefix={`EFECTIVO \n$`} displayType="text" value={sumaTotal} decimalSeparator="," thousandSeparator="." />
                        </th>
                        <th>TARJETA</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        pacientes?.map((pac, index) => {
                            return (
                                <tr key={index}>
                                    <td onClick={() => {
                                        socket.emit('req-cambiar-color', pac._id, '');
                                        socket.emit('req-cambiar-color2', pac._id, '');
                                    }} className="tecnicos"></td>
                                    <td onClick={() => socket.emit('req-cambiar-color2', pac._id, 'tomografia')} className="tecnicos tomografia"></td>
                                    <td onClick={() => socket.emit('req-cambiar-color2', pac._id, 'cefalometria')} className="tecnicos cefalometria"></td>
                                    <td className={pac.color2}>{`${(new Date(pac.fecha).getHours()).toString().padStart(2, '0')}:${(new Date(pac.fecha).getMinutes()).toString().padStart(2, '0')}`}</td>
                                    <td className={pac.color2}>{pac.numero}</td>
                                    {
                                        tipoEstudio === 'radiografia'
                                            ? <></>
                                            : <td className={pac.color}>{pac.doctor}</td>
                                    }
                                    <td className={pac.color}>{pac.nombre}</td>
                                    <td className={pac.color}>{pac.estudio}</td>
                                    <td className={pac.color}>{pac.obraSocial}</td>
                                    <td className={pac.color}>{pac.telefono}</td>
                                    <td className={`efectivo ` + pac.color}>
                                        <NumericFormat prefix='$' displayType="text" value={pac.efectivo} decimalSeparator="," thousandSeparator="." />
                                    </td>
                                    <td className={pac.color}>
                                        <NumericFormat prefix='$' displayType="text" value={pac.tarjeta} decimalSeparator="," thousandSeparator="." />
                                    </td>
                                    {
                                        params
                                            ? <></>
                                            : <>
                                                <td onClick={() => editarPaciente(pac._id)} className='boton-tabla'><i className="bi bi-pencil"></i></td>
                                                <td onClick={() => borrarPaciente(pac.nombre, pac._id)} className='boton-tabla'><i className="bi bi-trash3"></i></td>
                                            </>
                                    }
                                    <td onClick={() => socket.emit('req-cambiar-color', pac._id, 'carmen')} className='tecnicos carmen'></td>
                                    <td onClick={() => socket.emit('req-cambiar-color', pac._id, 'alicia')} className='tecnicos alicia'></td>
                                    <td onClick={() => socket.emit('req-cambiar-color', pac._id, 'soledad')} className='tecnicos soledad'></td>
                                    <td onClick={() => socket.emit('req-cambiar-color', pac._id, 'noelia')} className='tecnicos noelia'></td>
                                    <td onClick={() => socket.emit('req-cambiar-color', pac._id, 'damian')} className='tecnicos damian'></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}