import PropTypes from "prop-types";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import "../styles/InvitacionModal.css";

export default function InvitacionModal({ open, onClose, title, children }) {

    InvitacionModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    children: PropTypes.node,
  };
  
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    //Evitar scroll del body al abrir el modal
    const prev = document.body.style.overflow; 
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  
  if (!open) return null;
  
  return createPortal( //pintar por encima
    <div className="modal-overlay"
         role="button"
         tabIndex={0}
         onClick={onClose}
         /*onKeyDown = {(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
         }}*/
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()} // para no cerrar el modal al clickearlo
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar" type="button">×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>, 
    document.body
  );
}
