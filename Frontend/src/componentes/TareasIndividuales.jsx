import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/TareasIndividuales.css";

export default function TareasIndividuales() {
  const navigate = useNavigate();
  const { idSeccion } = useParams(); // ✅ Captura el parámetro de la URL

  const handleCrearTarea = () => {
    navigate(`/secciones/${idSeccion}/crear-tarea`); // ✅ Mantiene el contexto de la sección
  };

  return (
    <div className="tareas-container">
      <div className="header">
        <h2>Tareas de la Sección {idSeccion}</h2>
        <button className="btn btn-primary" onClick={handleCrearTarea}>
          Crear Tarea
        </button>
      </div>

      <table className="tabla-tareas">
        <thead>
          <tr>
            <th className="col-nota">Nota</th>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="2" className="vacio">
              No hay estudiantes todavía
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
