"use client"

import { useState, useEffect } from "react";
import { socket } from "../layout";
import { Pagination } from "@mui/material";
import '../../../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import '../styles/table.css';

const limit = 100;

export default function Home() {

    const [pacientes, setPacientes] = useState([]);
    const [tipoEstudio, setTipoEstudio] = useState('radiografia');
    const [textoBuscador, setTextoBuscador] = useState('');
    const [page, setPage] = useState(1);
    const [cantidadTotal, setCantidadTotal] = useState(0);

    const filtrar = e => setTextoBuscador(e.target.value);

    const cambiarPagina = (e, value) => setPage(value);

    useEffect(() => {
        socket.emit('req-pacientes', tipoEstudio, 'todos', textoBuscador, 1, limit);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tipoEstudio, textoBuscador]);

    useEffect(() => {
        socket.emit('req-pacientes', tipoEstudio, 'todos', textoBuscador, page, limit);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        socket.on('res-pacientes', (pacs, total) => {
            setPacientes(pacs);
            setCantidadTotal(total);
        });
        socket.on('res-cambio-paciente', () => {
            setTipoEstudio(prevTipo => {
                setTextoBuscador(prevBuscador => {
                    setPage(prevPage => {
                        socket.emit('req-pacientes', prevTipo, 'todos', prevBuscador, prevPage, limit);
                        return prevPage
                    });
                    return prevBuscador;
                })
                return prevTipo;
            });
        });
        return () => {
            socket.off('res-pacientes');
            socket.off('res-cambio-paciente');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main>
            <div className="paginacion">
                <select className="select-todos" value={tipoEstudio} onChange={e => setTipoEstudio(e.target.value)}>
                    <option value="radiografia">Radiografia</option>
                    <option value="ecografia">Ecografia</option>
                </select>
                <Pagination page={page} count={cantidadTotal} onChange={cambiarPagina} />
            </div>
            <div className='tabla-div'>
                <section className='section-filtrar'>
                    <input onChange={e => filtrar(e)}></input>
                </section>
                <table id="tablaDatos">
                    <thead>
                        <tr>
                            <th>FECHA</th>
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
                            <th>EFECTIVO</th>
                            <th>TARJETA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pacientes?.map((pac, index) => {
                                return (
                                    <tr key={index}>
                                        <td className={pac.color2}>{`${new Date(pac.fecha).toLocaleDateString()}`}</td>
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
                                        <td className={`efectivo ` + pac.color}>${pac.efectivo}</td>
                                        <td className={pac.color}>${pac.tarjeta}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </main>
    )
}