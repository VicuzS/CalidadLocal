import { useState } from "react";
import "../styles/InvitacionButton.css";
import InvitacionModal from "./InvitacionModal";
import { useAuth } from "../context/AuthContext";

//import { useSeccion } from "../context/SeccionContext";


export default function InvitacionButton() {

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false); // Para no enviar varios correos mientras se procesa uno
  const [enviadas, setEnviadas] = useState([]);
  
  const { user } = useAuth();
  //const { idSeccion } = useSeccion();
  const API_URL = import.meta.env.VITE_API_URL;

  const openModal = () => setOpen(true);
  const closeModal = () => { setOpen(false); setEmail(""); };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user || user.role !== "profesor") {
      setMensaje("Solo los profesores pueden enviar invitaciones.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMensaje("Por favor ingrese un correo válido.");
      return;
    }

    setLoading(true); // 👈 solo después de pasar las validaciones

    const data = {
      correoAlumno: email,
      idSeccion: 3,
    };

    try {
      const response = await fetch(`${API_URL}/api/invitaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setMensaje(result.message || "Invitación enviada correctamente 🎉");
        setEmail("");
        setTimeout(() => setMensaje(""), 3000);
        setEnviadas((prev) => [...prev, email]);
      } else {
        setMensaje(result.message || "Error al enviar la invitación");
      }
    } catch (error) {
      console.error("Error al enviar la invitación:", error);
      setMensaje("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <button className="btn btn-primary btn-invitacion" onClick={openModal} type="button">
        Invitar Alumno
      </button>

      <InvitacionModal open={open} onClose={closeModal} title="Invitar Alumno">
        <form onSubmit={onSubmit} className="form-grid">
          <label className="field">
            <span>Correo del alumno</span>
            <input
              type="email"
              placeholder="alumno@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </label>

          <div className="btn-group">
            <button type="button" className="btn" onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}> 
              {loading ? "Enviando..." : "Enviar Invitación"}
            </button>
          </div>
        </form>
        {mensaje && (
          <p style={{ color: "black", marginTop: "10px", textAlign: "center" }}>
            {mensaje}
          </p>
        )} 
        {enviadas.length > 0 && (
          <div style={{ color: "black", marginTop: "15px" }}>
            <h4>Invitaciones enviadas:</h4>
            <ul>
              {enviadas.map((mail, i) => (
                <li key={i}>{mail}</li>
              ))}
            </ul>
          </div>
        )}
      </InvitacionModal>


    </>
  );
}
