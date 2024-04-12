import SitioPerfil from "./SitioPerfil.js";
import { Core } from "../Core.js";
import { Clamp, CreateElement, ObtenerWidthRender } from "../Utilities/CustomFunctions.js";
import configuracionPadierna from "../../config/PadiernaConfig.js";
import ParticlesAnimator from "./ParticlesAnimationManager.js";
import Estacion from "../Entities/Estacion.js";

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
        this.Panner = CreateElement({
            nodeElement: "div",
            attributes: { class: "perfilPanner" }
        });

        this.hoverDiv = CreateElement({
            nodeElement: "div",
            attributes: { class: "hoverPerfil" }
        });

        let tuberiasDiv = CreateElement({
            nodeElement: "div",
            attributes: { class: "tuberiasContainer" }
        });

        let tuberiaEstacion;

        this.Panner = CreateElement({
            nodeElement: "div",
            attributes: { class: "perfilPanner" },
            events: new Map().set('mousemove', [this.#drag])
        });

        let estacionesDiv = CreateElement({
            nodeElement: "div",
            attributes: {
                class: "estacionesContainer",
                style: `background: url(${Core.Instance.ResourcesPath}CelulaPadierna/background.png?v=10); width: ${widthRenderPerfil}px; height: 1080px;`
            }
        });

        this.maxPan = (widthRenderPerfil - 1920) + this.offSetTabla;

        this.horizontalScroll = CreateElement({
            nodeElement: "input",
            attributes: {
                class: "horizontalScroll",
                value: 0,
                min: 0,
                max: this.maxPan,
                type: "range",
                style: `--bola: url(${Core.Instance.ResourcesPath}General/idle.png); background: url(${Core.Instance.ResourcesPath}General/Barra.png?v=10);`
            },
            events: new Map().set('input', [this.scroll])
        });

        Core.Instance.data.forEach(estacion => {
            const estacionPerfil = new SitioPerfil(estacion.IdEstacion, function (isMouseOut, estacion, css) {
                this.setHoverPerfil(isMouseOut, estacion, css);
            }.bind(this));

            const estilosEstacionTuberias = configuracionPadierna.perfil.estilosTuberias.PorBombeo.find(element => element.IdEstacion == estacion.IdEstacion);
            estacionesDiv.appendChild(estacionPerfil.createSitio());
            estacionesDiv.appendChild(estacionPerfil.createEtiqueta());

            if (estilosEstacionTuberias != undefined) {
                tuberiaEstacion = CreateElement({
                    nodeElement: "canvas",
                    attributes: {
                        class: "tuberiaPerfil", id: `${estilosEstacionTuberias.Tag}`,
                        style: estilosEstacionTuberias.css
                    }
                });

                tuberiasDiv.appendChild(tuberiaEstacion);
                this.InitTuberias(estilosEstacionTuberias.css, tuberiaEstacion, estacion.IdEstacion);
            }
        })

        configuracionPadierna.perfil.estilosTuberias.PorGravedad.forEach(element => {
            if (element != undefined) {
                tuberiaEstacion = CreateElement({
                    nodeElement: "canvas",
                    attributes: {
                        class: "tuberiaPerfil", id: `${element.Tag}_Gravedad`,
                        style: element.css
                    }
                });

                tuberiasDiv.appendChild(tuberiaEstacion);
                this.InitTuberias(element.css, tuberiaEstacion);
            }
        })

        this.Panner.append(estacionesDiv)
        estacionesDiv.append(tuberiasDiv, this.hoverDiv);
        perfil.append(this.Panner, this.horizontalScroll);

    }
    scroll = (e) => {
        this.Panner.style.transform = `translateX(${-e.currentTarget.value}px)`;
    }

    InitTuberias(cssPipe, canvas, idEstacion) {
        let particlesAnimatorInstance = new ParticlesAnimator(cssPipe, canvas, idEstacion);
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

    /**
     * 
     * @param {boolean} isMouseOut 
     * @param {Estacion} estacion 
     * @param {string} css formato estilo css
     */
    setHoverPerfil(isMouseOut, estacion, css) {
        if (isMouseOut)
            this.hoverDiv.style = "dispaly: none;";
        else {
            this.hoverDiv.style = `display: block; background: url(${Core.Instance.ResourcesPath}Sitios/${estacion.Abreviacion}/Perfil/${estacion.Abreviacion}.png?v=10); ${css}`;
        }
    }
}

export default Perfil;