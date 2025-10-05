import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FormularioTarea.css";

export default function FormularioTarea() {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const manejarEnvio = (e) => {
    e.preventDefault();
    // validación simple
    if (
      !nombre.trim() ||
      !tipo.trim() ||
      !descripcion.trim() ||
      !fecha.trim() ||
      !modalidad.trim()
    ) {
      setError("Por favor completa todos los campos.");
      return;
    }

    // aquí iría la llamada al backend si aplica
    console.log({
      nombre,
      tipo,
      descripcion,
      fecha,
      modalidad,
    });

    // navegar a TareasIndividuales solo si la validación pasó
    navigate("/tareasIndividuales");
  };

  return (
    <form className="formulario-tarea" onSubmit={manejarEnvio}>
      <h2>Crear nueva tarea</h2>

      {error && <div style={{ color: "red", marginBottom: "8px" }}>{error}</div>}

      <div className="campo">
        <label>Nombre de la tarea:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => {
            setNombre(e.target.value);
            setError("");
          }}
          required
        />
      </div>

      <div className="campo">
        <label>Tipo de tarea:</label>
        <select
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value);
            setError("");
          }}
          required
        >
          <option value="">Seleccionar tipo...</option>
          <option value="Investigación">Investigación</option>
          <option value="Programación">Programación</option>
          <option value="Diseño">Diseño</option>
          <option value="Presentación">Presentación</option>
          <option value="Análisis">Análisis</option>
        </select>
      </div>

      <div className="campo">
        <label>Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => {
            setDescripcion(e.target.value);
            setError("");
          }}
          rows="4"
          required
        />
      </div>

      <div className="campo">
        <label>Fecha de vencimiento:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => {
            setFecha(e.target.value);
            setError("");
          }}
          required
        />
      </div>

      <div className="campo">
        <label>Modalidad:</label>
        <select
          value={modalidad}
          onChange={(e) => {
            setModalidad(e.target.value);
            setError("");
          }}
          required
        >
          <option value="">Seleccionar modalidad...</option>
          <option value="Individual">Individual</option>
          <option value="Grupal">Grupal</option>
        </select>
      </div>

      <button type="submit" className="boton-crear">Crear Tarea</button>
    </form>
  );
}
