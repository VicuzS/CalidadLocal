import { useState } from "react";
import "../styles/InvitacionButton.css";
import InvitacionModal from "./InvitacionModal";

export default function InvitacionButton() {

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  
  const API_URL = import.meta.env.VITE_API_URL;

  const openModal = () => setOpen(true);
  const closeModal = () => { setOpen(false); setEmail(""); };

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      para: email,
      nombre: "Alumno Invitado",
      curso: "Programación I",
      enlace: `${import.meta.env.VITE_FRONTEND_URL}/login`

    };

    try {

      const response = await fetch(
        `${API_URL}/invitaciones/enviar?correo=${encodeURIComponent(email)}&nombre=${encodeURIComponent("Alumno Invitado")}&curso=${encodeURIComponent("Programación I")}`,
       {
      method: "POST"
       }
      );

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const mensajeBackend = await response.text();
      console.log("Respuesta del backend:", mensajeBackend);
      setMensaje("Invitación enviada correctamente.");

    } catch (error) {
      console.error("Error al enviar la invitación:", error);
      setMensaje("Error al enviar la invitación. Inténtalo de nuevo.");
    }

    //closeModal();
  };

  return (
    <>
      <button className="btn btn-primary" onClick={openModal} type="button">
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
            <button type="submit" className="btn btn-primary">
              Enviar Invitación
            </button>
          </div>
        </form>
      </InvitacionModal>

      {mensaje && <p style={{ marginTop: "10px" }}>{mensaje}</p>}
    </>
  );
}
