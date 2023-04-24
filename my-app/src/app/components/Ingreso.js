import { useState } from "react"
import { NumericFormat } from 'react-number-format';
import { socket } from "../layout";

export default function Ingreso() {

    const [ingreso, setIngreso] = useState(0);
    const [descripcion, setDescripcion] = useState('');

    const clickHandler = () => {
        if (ingreso === '' || descripcion === '') {
            alert('DEBE LLENAR LOS CAMPOS');
        } else {
            socket.emit('req-ingreso', ingreso, descripcion);
            setIngreso(0);
            setDescripcion('');
        }
    };

    return (
        <section className="tarjeta-formulario">
            <span>INGRESO</span>
            <NumericFormat value={ingreso} onValueChange={e => setIngreso(e.floatValue)} />
            <input value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripcion"></input>
            <button onClick={clickHandler} className="guardar-button">ENVIAR</button>
        </section>
    )
}