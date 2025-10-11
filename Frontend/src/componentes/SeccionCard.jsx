import "../styles/SeccionCard.css"

function SeccionCard({ seccion, onEliminar }) {
  const handleEliminar = async (e) => {
    e.stopPropagation(); // Evitar que se active el click del card
    
    if (window.confirm(`¿Está seguro de eliminar la sección "${seccion.nombreCurso}"?`)) {
      await onEliminar(seccion.idSeccion);
    }
  };

  return (
    <div className="seccion-card">
      <p>{seccion.nombreCurso}</p>
      <button onClick={handleEliminar}>x</button>
    </div>
  );
}

export default SeccionCard;