import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/FormularioTarea.css";

export default function FormularioTarea() {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  // Obtener idSeccion desde la URL
  const { idSeccion } = useParams();

  // Obtener la fecha actual en formato YYYY-MM-DD
  const obtenerFechaMinima = () => {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${año}-${mes}-${dia}`;
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!nombre || !tipo || !descripcion || !fecha) {
      setError("Por favor completa todos los campos.");
      return;
    }

    // Validar que la fecha no sea anterior a hoy
    const fechaSeleccionada = new Date(fecha);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas

    if (fechaSeleccionada < fechaActual) {
      setError("La fecha de vencimiento no puede ser anterior a la fecha actual.");
      return;
    }

    // Validar que exista idSeccion
    if (!idSeccion) {
      setError("No se pudo identificar la sección.");
      return;
    }

    const nuevaTarea = {
      idSeccion: Number(idSeccion),
      nombre,
      tipo,
      descripcion,
      fechaVencimiento: fecha + "T00:00:00",
    };

    try {
      const respuesta = await fetch("https://cswproyect-production.up.railway.app/api/tareas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaTarea),
      });

      if (!respuesta.ok) {
        throw new Error("Error al crear la tarea");
      }

      const data = await respuesta.json();
      console.log("✅ Tarea creada:", data);

      // Redirigir de vuelta a las tareas de esta sección
      navigate(`/secciones/${idSeccion}/tareas`);
    } catch (error) {
      console.error("❌ Error:", error);
      setError("No se pudo crear la tarea. Inténtalo nuevamente.");
    }
  };

  return (
    <form className="formulario-tarea" onSubmit={manejarEnvio}>
      <h2>Crear nueva tarea</h2>
      
      {/* Mostrar la sección actual */}
      <p style={{ textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '10px' }}>
        Sección ID: {idSeccion}
      </p>

      {error && <div style={{ color: "red", marginBottom: "8px" }}>{error}</div>}

      <div className="campo">
        <label htmlFor="nombre-tarea">Nombre de la tarea:</label>
        <input
          id="nombre-tarea"
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
        <label htmlFor="tipo-tarea">Tipo de tarea:</label>
        <select
          id="tipo-tarea"
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value);
            setError("");
          }}
          required
        >
          <option value="">Seleccionar tipo...</option>
          <option value="Individual">Individual</option>
          <option value="Grupal">Grupal</option>
        </select>
      </div>

      <div className="campo">
        <label htmlFor="descripcion-tarea">Descripción:</label>
        <textarea
          id="descripcion-tarea"
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
        <label htmlFor="fecha-tarea">Fecha de vencimiento:</label>
        <input
          id="fecha-tarea"
          type="date"
          value={fecha}
          min={obtenerFechaMinima()}
          onChange={(e) => {
            setFecha(e.target.value);
            setError("");
          }}
          required
        />
        <small style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>
          La fecha debe ser igual o posterior a hoy
        </small>
      </div>

      <button type="submit" className="boton-crear">
        Crear Tarea
      </button>
    </form>
  );
}