import SitioPerfil from "./SitioPerfil.js";
import { Core } from "../Core.js";
import { CreateElement } from "../Utilities/CustomFunctions.js";

class Perfil {
    constructor(sitios) {
        this.sitios = sitios;
    }

    create() {
        let perfil = document.querySelector(".section__home")
        let estacionesDiv = CreateElement({ nodeElement: "div", attributes: { class: "estacionesContainer", style: `background: url(${Core.Instance.ResourcesPath}CelulaPadierna/background.jpg?v=10); width: 1920px; height: 1080px;` } });
        //style: `url(${Core.Instance.ResourcesPath}Sitios/${estacion.Abreviacion}/CelulaPadierna/background.jpg?v=10)`

        let estaciones = Core.Instance.data.forEach(estacion => {
            const estacionPerfil = new SitioPerfil(estacion.IdEstacion);
            estacionesDiv.appendChild(estacionPerfil.createSitio());
        })

        perfil.append(estacionesDiv);
    }
}

export default Perfil;