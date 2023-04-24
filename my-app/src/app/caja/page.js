"use client"
import { useEffect, useState } from "react";
import { socket } from "../layout";
import { NumericFormat } from 'react-number-format';
import '../styles/caja.css';

const stringFecha = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${(new Date().getDate()).toString().padStart(2, '0')}`

export default function Home() {

    const [efectivo, setEfectivo] = useState(0);
    const [ingresos, setIngresos] = useState(0);
    const [gastos, setGastos] = useState(0);
    const [total, setTotal] = useState(0);
    const [fecha, setFecha] = useState(stringFecha);
    const [ingresosData, setIngresosData] = useState([]);
    const [gastosData, setGastosData] = useState([]);

    useEffect(() => {
        socket.emit('req-caja', fecha)
    }, [fecha]);

    useEffect(() => {
        setTotal(3000 + efectivo + ingresos - gastos)
    }, [efectivo, ingresos, gastos]);

    useEffect(() => {
        socket.on('res-caja', (efe, ing, gas, ingData, gasData) => {
            setEfectivo(efe);
            setIngresos(ing);
            setGastos(gas);
            setIngresosData(ingData);
            setGastosData(gasData);
        });
        socket.on('res-cambio-caja', () => {
            setFecha(prevFecha => {
                socket.emit('req-caja', fecha);
                return prevFecha;
            });
        })
        return () => {
            socket.off('res-caja');
            socket.off('res-cambio-caja');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <section className="section-fecha">
                <input autoComplete='off' value={fecha} onChange={e => setFecha(e.target.value)} type="date"></input>
            </section>
            <div className="tablas-caja">
                <table className="tabla-caja">
                    <thead>
                        <tr>
                            <th colSpan={2}>TOTAL</th>
                        </tr>
                        <tr>
                            <th>CAMBIO INICIAL</th>
                            <td>+3.000</td>
                        </tr>
                        <tr>
                            <th>EFECTIVO TOTAL</th>
                            <td>
                                <NumericFormat prefix="+" displayType="text" value={efectivo} decimalSeparator="," thousandSeparator="." />
                            </td>
                        </tr>
                        <tr>
                            <th>INGRESOS</th>
                            <td>
                                <NumericFormat prefix="+" displayType="text" value={ingresos} decimalSeparator="," thousandSeparator="." />
                            </td>
                        </tr>
                        <tr>
                            <th>GASTOS</th>
                            <td>
                                <NumericFormat allowNegative={false} prefix="-" displayType="text" value={gastos} decimalSeparator="," thousandSeparator="." />
                            </td>
                        </tr>
                        <tr>
                            <th>TOTAL</th>
                            <td>
                                <NumericFormat prefix="$" displayType="text" value={total} decimalSeparator="," thousandSeparator="." />
                            </td>
                        </tr>
                    </thead>
                </table>
                <table className="tabla-caja">
                    <thead>
                        <tr>
                            <th colSpan={3}>INGRESOS</th>
                        </tr>
                        <tr>
                            <th>HORA</th>
                            <th>DESCRIPCION</th>
                            <th>MONTO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ingresosData?.map((ing, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{`${(new Date(ing.createdAt).getHours()).toString().padStart(2, '0')}:${(new Date(ing.createdAt).getMinutes()).toString().padStart(2, '0')}`}</td>
                                        <td>{ing.descripcion}</td>
                                        <td>
                                            <NumericFormat displayType="text" value={ing.monto} decimalSeparator="," thousandSeparator="." />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <table className="tabla-caja">
                    <thead>
                        <tr>
                            <th colSpan={3}>GASTOS</th>
                        </tr>
                        <tr>
                            <th>HORA</th>
                            <th>DESCRIPCION</th>
                            <th>MONTO</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            gastosData?.map((gas, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{`${(new Date(gas.createdAt).getHours()).toString().padStart(2, '0')}:${(new Date(gas.createdAt).getMinutes()).toString().padStart(2, '0')}`}</td>
                                        <td>{gas.descripcion}</td>
                                        <td>
                                            <NumericFormat displayType="text" value={gas.monto} decimalSeparator="," thousandSeparator="." />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
};