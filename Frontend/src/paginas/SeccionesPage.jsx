import "../styles/SeccionesPage.css"
import SeccionCard from "../componentes/SeccionCard";

function SeccionesPage(){
    return(
        <div className="seccionesPage-body">
            <div className="main-seccionesPage-container row">
                <div className="perfil-container col">
                    <h2>SALUDOS, LUIS</h2>
                    <i className="fa-solid fa-user"></i>
                </div>
                <div className="secciones-crud-container col">
                    <div className="secciones-header-container row">
                        <select>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                        </select>
                        <button className="button-seccionesPage">Agregar nueva seccion</button>
                    </div>
                    <div className="secciones-container row">
                        <SeccionCard nombre="CALIDAD DE SOFTWARE - G1"/>
                        <SeccionCard nombre="CALIDAD DE SOFTWARE - G2"/>
                        <SeccionCard nombre="CALIDAD DE SOFTWARE - G3"/>
                        <SeccionCard nombre="BASE DE DATOS II - G1"/>
                        <SeccionCard nombre="BASE DE DATOS II - G2"/>
                        <SeccionCard nombre="BASE DE DATOS II - G3"/>
                        <SeccionCard nombre="BASE DE DATOS II - G4"/>
                        <SeccionCard nombre="DISEÑO DE SOFTWARE - G1"/>
                        <SeccionCard nombre="DISEÑO DE SOFTWARE - G2"/>
                        <SeccionCard nombre="DISEÑO DE SOFTWARE - G3"/>
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default SeccionesPage;