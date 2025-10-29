import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/AsignarNotas.css";

export default function AsignarNotas() {
  const navigate = useNavigate();
  const { idSeccion, idAlumno } = useParams();
  const location = useLocation();
  
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(null);
  
  const BASE_URL = 'http://localhost:8080';
  
  const alumnoInfo = location.state?.alumno || {};
  const nombreSeccion = location.state?.nombreSeccion || '';

  useEffect(() => {
    cargarTareasNotas();
  }, [idSeccion, idAlumno]);

  const cargarTareasNotas = async () => {
    setLoading(true);
    setError("");
    setMessage(null);
    
    try {
      const response = await fetch(
        `${BASE_URL}/api/entregas/seccion/${idSeccion}/alumno/${idAlumno}/tareas-notas`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (Array.isArray(data) && data.length === 0) {
          setTareas([]);
          setLoading(false);
          return;
        }
        
        const normalized = data.map((t) => ({
          idTarea: t.idTarea,
          idEntrega: t.idEntrega,
          titulo: t.nombreTarea,
          nota: t.nota === null ? "" : Number(t.nota),
        }));
        setTareas(normalized);
      } else {
        const errorText = await response.text();
        console.error(`Error ${response.status}:`, errorText);
        
        if (response.status === 404) {
          setError("No se encontró información para este alumno en esta sección");
        } else if (response.status === 500) {
          setError("Error en el servidor. Por favor, contacta al administrador");
        } else {
          setError(`Error al cargar las tareas (${response.status})`);
        }
      }
    } catch (err) {
      console.error("Error al cargar tareas:", err);
      setError("Error de conexión con el servidor. Verifica que el backend esté corriendo");
    } finally {
      setLoading(false);
    }
  };

  const handleNotaChange = (idTarea, value) => {
    setTareas((prev) =>
      prev.map((t) =>
        t.idTarea === idTarea 
          ? { ...t, nota: value === "" ? "" : Number(value) } 
          : t
      )
    );
  };

  // Validar todas las notas
  const validarNotas = () => {
    for (const t of tareas) {
      if (t.nota !== "" && (Number.isNaN(t.nota) || t.nota < 0 || t.nota > 20)) {
        return { valido: false, mensaje: `Nota inválida en "${t.titulo}"` };
      }
    }
    return { valido: true, mensaje: "" };
  };

  // Actualizar una entrega existente
  const actualizarEntrega = async (tarea) => {
    const response = await fetch(
      `${BASE_URL}/api/entregas/${tarea.idEntrega}/nota`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nota: tarea.nota === "" ? null : tarea.nota }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Error al actualizar "${tarea.titulo}": ${errText}`);
    }
  };

  // Crear una nueva entrega
  const crearEntrega = async (tarea) => {
    const payload = {
      idTarea: tarea.idTarea,
      idAlumno: Number.parseInt(idAlumno, 10),
      nota: tarea.nota === "" ? null : tarea.nota,
    };

    const response = await fetch(
      `${BASE_URL}/api/entregas`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      const created = await response.json();
      // Actualizar el idEntrega localmente
      setTareas((prev) =>
        prev.map((p) =>
          p.idTarea === tarea.idTarea 
            ? { ...p, idEntrega: created.idEntrega } 
            : p
        )
      );
    } else {
      const errText = await response.text();
      throw new Error(`Error al crear entrega para "${tarea.titulo}": ${errText}`);
    }
  };

  // Procesar una tarea (actualizar o crear)
  const procesarTarea = async (tarea) => {
    if (tarea.idEntrega) {
      await actualizarEntrega(tarea);
    } else {
      await crearEntrega(tarea);
    }
  };

  const handleGuardar = async () => {
    setSaving(true);
    setMessage(null);
    setError("");

    // Validación de notas
    const validacion = validarNotas();
    if (!validacion.valido) {
      setMessage({ type: "error", text: validacion.mensaje });
      setSaving(false);
      return;
    }

    try {
      // Procesar todas las tareas
      for (const tarea of tareas) {
        await procesarTarea(tarea);
      }

      setMessage({ type: "success", text: "Notas guardadas correctamente." });
      
      // Recargar las tareas para reflejar los cambios
      setTimeout(() => {
        cargarTareasNotas();
      }, 1000);

    } catch (err) {
      console.error("Error guardando notas:", err);
      setError(err.message || "Error al guardar las notas");
    } finally {
      setSaving(false);
    }
  };

  const handleVolver = () => {
    navigate(`/secciones/${idSeccion}/tareas`);
  };

  // Siempre retorna string
  const formatearNota = (nota) => {
    if (nota === null || nota === undefined || nota === "") {
      return "";
    }
    const numero = Number(nota);
    return Number.isNaN(numero) ? "" : String(numero);
  };

  const calcularPromedio = () => {
    const notasValidas = tareas.filter(t => t.nota !== "" && t.nota !== null);
    if (notasValidas.length === 0) return "Sin notas";
    const suma = notasValidas.reduce((acc, t) => acc + Number(t.nota), 0);
    return (suma / notasValidas.length).toFixed(2);
  };

  // Determinar contenido a mostrar
  let contenidoPrincipal;
  
  if (loading) {
    contenidoPrincipal = <div className="loading-message">Cargando tareas...</div>;
  } else if (tareas.length === 0) {
    contenidoPrincipal = (
      <div className="vacio">
        No hay tareas registradas para este alumno en esta sección
      </div>
    );
  } else {
    contenidoPrincipal = (
      <>
        {/* Card de Resumen */}
        <div className="stats-card">
          <div className="stat-item">
            <div className="stat-label">Promedio Actual</div>
            <div className="stat-value">{calcularPromedio()}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Total de Tareas</div>
            <div className="stat-value">{tareas.length}</div>
          </div>
        </div>

        {/* Lista de Tareas */}
        <div className="tareas-scroll">
          {tareas.map((tarea, index) => (
            <div className="tarea-item" key={tarea.idTarea}>
              <div className="tarea-titulo-wrapper">
                <div className="tarea-numero">TAREA {index + 1}</div>
                <div className="tarea-titulo">{tarea.titulo}</div>
              </div>
              <div className="tarea-nota">
                <span className="nota-label">Nota:</span>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.1"
                  value={formatearNota(tarea.nota)}
                  placeholder="0.0"
                  onChange={(e) => handleNotaChange(tarea.idTarea, e.target.value)}
                  disabled={saving}
                />
                <span className="nota-max">/ 20</span>
              </div>
            </div>
          ))}
        </div>

        <button 
          className="btn-asignarNotas" 
          onClick={handleGuardar} 
          disabled={saving}
        >
          {saving ? "Guardando..." : "💾 Guardar notas"}
        </button>
      </>
    );
  }

  return (
    <div className="asignarNotas-body">
      <div className="main-asignarNotas-container">
        <div className="asignarNotas-header">
          <div className="header-info">
            <h2>
              {alumnoInfo.nombreCompleto || 
               `${alumnoInfo.nombres || ''} ${alumnoInfo.apellidoP || ''} ${alumnoInfo.apellidoM || ''}`.trim() ||
               'Asignar Notas'}
            </h2>
            {alumnoInfo.codigoAlumno && (
              <p className="codigo-alumno">Código: {alumnoInfo.codigoAlumno}</p>
            )}
            {nombreSeccion && (
              <p className="nombre-seccion">{nombreSeccion}</p>
            )}
          </div>
          <button className="btn-volver" onClick={handleVolver}>
            ← Volver
          </button>
        </div>

        {message && (
          <div
            className={`message ${message.type === "error" ? "message-error" : "message-success"}`}
          >
            {message.text}
          </div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {contenidoPrincipal}
      </div>
    </div>
  );
}