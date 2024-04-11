import SitioPerfil from "./SitioPerfil.js";
import { Core } from "../Core.js";
import { Clamp, CreateElement, ObtenerWidthRender } from "../Utilities/CustomFunctions.js";
import configuracionPadierna from "../../config/PadiernaConfig.js";
import ParticlesAnimator from "./ParticlesAnimationManager.js";

class Perfil {
    constructor(sitios) {
        this.sitios = sitios;
        this.Panner = undefined;
        this.horizontalScroll;
        this.offSetTabla = 473; // se calculo a mano ya que la tabla mide 600 pero como es curva tiene un espacion a considerar
        this.moveX = 0;
        this.maxPan = 0;
    }
    create() {
        const widthRenderPerfil = ObtenerWidthRender(Core.Instance.IdProyecto);
        let perfil = document.querySelector(".section__home")
        this.Panner = CreateElement({ nodeElement: "div", attributes: { class: "perfilPanner" } });

        let tuberiasDiv = CreateElement({ nodeElement: "div", attributes: { class: "tuberiasContainer" } });
        let tuberiaEstacion;
        this.Panner = CreateElement({ nodeElement: "div", attributes: { class: "perfilPanner" }, events: new Map().set('mousemove', [this.#drag]) });
        let estacionesDiv = CreateElement({ nodeElement: "div", attributes: { class: "estacionesContainer", style: `background: url(${Core.Instance.ResourcesPath}CelulaPadierna/background.jpg?v=10); width: ${widthRenderPerfil}px; height: 1080px;` } });
        this.maxPan = (widthRenderPerfil - 1920) + this.offSetTabla;
        this.horizontalScroll = CreateElement({ nodeElement: "input", attributes: { class: "horizontalScroll", value: 0, min: 0, max: this.maxPan, type: "range", style: `--bola: url(${Core.Instance.ResourcesPath}General/idle.png); background: url(${Core.Instance.ResourcesPath}General/Barra.png?v=10);` }, events: new Map().set('input', [this.scroll]) });

        Core.Instance.data.forEach(estacion => {
            const estacionPerfil = new SitioPerfil(estacion.IdEstacion);
            const estilosEstacionTuberias = configuracionPadierna.perfil.estilosTuberias.PorBombeo.find(element => element.IdEstacion == estacion.IdEstacion);
            estacionesDiv.appendChild(estacionPerfil.createSitio());

            if (estilosEstacionTuberias != undefined) {
                tuberiaEstacion = CreateElement({ nodeElement: "canvas", attributes: { class: "tuberiaPerfil", id: `${estilosEstacionTuberias.Tag}`, style: estilosEstacionTuberias.css } });
                tuberiasDiv.appendChild(tuberiaEstacion);
                this.InitTuberias(estilosEstacionTuberias.css, tuberiaEstacion);
            }
        })

        configuracionPadierna.perfil.estilosTuberias.PorGravedad.forEach(element => {
            if (element != undefined) {
                tuberiaEstacion = CreateElement({ nodeElement: "canvas", attributes: { class: "tuberiaPerfil", id: `${element.Tag}_Gravedad`, style: element.css } });
                tuberiasDiv.appendChild(tuberiaEstacion);
                this.InitTuberias(element.css, tuberiaEstacion);
            }
        })

        this.Panner.append(estacionesDiv)
        estacionesDiv.append(tuberiasDiv);
        perfil.append(this.Panner, this.horizontalScroll);
    }
    scroll = (e) => {
        this.Panner.style.transform = `translateX(${-e.currentTarget.value}px)`;
    }

    InitTuberias(cssPipe, canvas) {
        let particlesAnimatorInstance = new ParticlesAnimator(cssPipe, canvas);
        particlesAnimatorInstance.init();
    }
    #drag = (e) => {
        if (e.which == 1) {
            this.moveX = parseInt(this.horizontalScroll.value);
            this.moveX += -e.movementX;
            this.moveX = Clamp(this.moveX, 0, this.maxPan);
            this.Panner.style.transform = `translateX(${-this.moveX}px)`;
            this.horizontalScroll.value = this.moveX;
        }
    }
}

export default Perfil;