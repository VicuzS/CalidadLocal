import "../styles/SeccionCard.css"
function SeccionCard({nombre}){
    return(
        <div className="seccion-card">
            <p>{nombre}</p>    
        </div>
    );
}

export default SeccionCard;