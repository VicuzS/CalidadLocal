import "../styles/SeccionCard.css"

function SeccionCard({ nombre}) {
  return (
    <div className="seccion-card">
      <p>{nombre}</p>
      <button>x</button>
    </div>
  );
}

export default SeccionCard;