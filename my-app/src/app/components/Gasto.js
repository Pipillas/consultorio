import { useState } from "react"
import { NumericFormat } from 'react-number-format';
import { socket } from "../layout";

export default function Gasto() {

    const [gasto, setGasto] = useState(0);
    const [descripcion, setDescripcion] = useState('');

    const clickHandler = () => {
        if (gasto === '' || descripcion === '') {
            alert('DEBE LLENAR LOS CAMPOS');
        } else {
            socket.emit('req-gasto', gasto, descripcion);
            setGasto(0);
            setDescripcion('');
        }
    };

    return (
        <section className="tarjeta-formulario">
            <span>GASTO</span>
            <NumericFormat value={gasto} onValueChange={e => setGasto(e.floatValue)} thousandSeparator="." decimalSeparator="," />
            <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripcion"></input>
            <button onClick={clickHandler} className="guardar-button">ENVIAR</button>
        </section>
    )
}