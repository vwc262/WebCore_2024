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
        let scrollHorizontal = CreateElement({ nodeElement: "input", attributes: { class: "horizontalScroll", type: "range", style: `--bola: url(${Core.Instance.ResourcesPath}General/idle.png); background: url(${Core.Instance.ResourcesPath}General/Barra.png?v=10);` } });

        Core.Instance.data.forEach(estacion => {
            const estacionPerfil = new SitioPerfil(estacion.IdEstacion);
            estacionesDiv.appendChild(estacionPerfil.createSitio());
        })

        perfil.append(estacionesDiv, scrollHorizontal);
    }
}

export default Perfil;