import SitioPerfil from "./SitioPerfil.js";
import { Core } from "../Core.js";

class Perfil {
    constructor(sitios) {
        this.sitios = sitios;
    }

    create() {
        let perfil = document.querySelector(".section__home")
        let estacionesDiv = document.createElement("div");
        estacionesDiv.setAttribute("class", "estacionesContainer");

        let estaciones = Core.Instance.data.forEach(estacion => {
            const estacionPerfil = new SitioPerfil(estacion.IdEstacion);
            estacionesDiv.appendChild(estacionPerfil.createSitio());
        })

        perfil.append(estacionesDiv);
    }
}

export default Perfil;