"use client"
import { useState } from "react";
import Formulario from "./components/Formulario";
import Table from "./components/Table";
import './styles/home.css';
import Ingreso from "./components/Ingreso";
import Gasto from "./components/Gasto";

export default function Home() {

  const [tipoEstudio, setTipoEstudio] = useState('radiografia');
  const [pacienteID, setPacienteID] = useState('');
  const changeEstudio = tipo => setTipoEstudio(tipo);
  const editarPaciente = id => setPacienteID(id);

  return (
    <main className="main">
      <div>
        <Formulario changeEstudio={changeEstudio} pacienteID={pacienteID} editarPaciente={editarPaciente} />
        <Gasto />
        <Ingreso />
      </div>
      <Table tipoEstudio={tipoEstudio} params={false} editarPaciente={editarPaciente} />
    </main>
  );
}