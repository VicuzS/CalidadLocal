import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FormularioTarea.css";

export default function FormularioTarea() {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
<<<<<<< Updated upstream
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
=======
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Por ahora idSeccion 3 luego se conectara a seccionCard
  const idSeccion = 3;

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!nombre || !tipo || !descripcion || !fecha) {
>>>>>>> Stashed changes
      setError("Por favor completa todos los campos.");
      return;
    }

<<<<<<< Updated upstream
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
=======
    const nuevaTarea = {
      idSeccion, // Enviado automáticamente como 3 por ahora
      nombre,
      tipo,
      descripcion,
      fechaVencimiento: fecha + "T00:00:00", // formato compatible con LocalDateTime
    };

    try {
      const respuesta = await fetch("http://localhost:8080/api/tareas", {
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

      // Redirigir a la lista de tareas
      navigate("/tareasIndividuales");
    } catch (error) {
      console.error("❌ Error:", error);
      setError("No se pudo crear la tarea. Inténtalo nuevamente.");
    }
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          <option value="Investigación">Investigación</option>
          <option value="Programación">Programación</option>
          <option value="Diseño">Diseño</option>
          <option value="Presentación">Presentación</option>
          <option value="Análisis">Análisis</option>
=======
          <option value="Individual">Individual</option>
          <option value="Grupal">Grupal</option>
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
      <button type="submit" className="boton-crear">
        Crear Tarea
      </button>
>>>>>>> Stashed changes
    </form>
  );
}
