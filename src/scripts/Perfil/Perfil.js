import SitioPerfil from "./SitioPerfil.js";
import { Core } from "../Core.js";
import { Clamp, CreateElement } from "../Utilities/CustomFunctions.js";
import { Configuracion } from "../../config/config.js";
import ParticlesAnimator from "./ParticlesAnimationManager.js";
import Estacion from "../Entities/Estacion.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";

class Perfil {

    constructor(sitios) {
        this.sitios = sitios;
        this.Panner = undefined;
        this.horizontalScroll;
        this.verticalScroll;
        this.offSetTabla = 473; // se calculo a mano ya que la tabla mide 600 pero como es curva tiene un espacion a considerar
        this.moveX = 0;
        this.maxPanX = 0;
        this.maxPanY = 0;
    }

    create() {
        const configuracionProyecto = Configuracion.GetConfiguracion(Core.Instance.IdProyecto);
        const widthRenderPerfil = configuracionProyecto.widthRender;
        const heightRender = configuracionProyecto.heightRender;

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
        this.Panner.doPanX = configuracionProyecto.doPanX;
        this.Panner.doPanY = configuracionProyecto.doPanY;

        let backgroundPerfil = CreateElement({
            nodeElement: "div",
            attributes: {
                class: "estacionesContainer",
                style: `background: url(${Core.Instance.ResourcesPath}Perfil/background.jpg?v=${Core.Instance.version}); width: ${widthRenderPerfil}px; height: ${heightRender}px;`
            }
        });

        let capaTubos = CreateElement({
            nodeElement: "div",
            attributes: {
                class: "capasitios",
                style: `background: url(${Core.Instance.ResourcesPath}Perfil/tubos.png?v=${Core.Instance.version}); width: ${widthRenderPerfil}px; height: ${heightRender}px;`
            }
        });

        let capaSitios = CreateElement({
            nodeElement: "div",
            attributes: {
                class: "capasitios",
                style: `background: url(${Core.Instance.ResourcesPath}Perfil/sitios.png?v=${Core.Instance.version}); width: ${widthRenderPerfil}px; height: ${heightRender}px;`
            }
        });

        this.maxPanX = (widthRenderPerfil - 1920) + this.offSetTabla;
        this.maxPanY = (heightRender);

        this.horizontalScroll = CreateElement({
            nodeElement: "input",
            attributes: {
                id: "horizontalScroll",
                class: "horizontalScroll",
                value: 0,
                min: 0,
                max: this.maxPanX,
                type: "range",
                style: `--bola: url(${Core.Instance.ResourcesPath}General/idle.png); background: url(${Core.Instance.ResourcesPath}General/Barra.png?v=${Core.Instance.version});`
            },
            events: new Map().set('input', [this.scroll])
        });
        this.verticalScroll = CreateElement({
            nodeElement: "input",
            attributes: {
                id: "verticalScroll",
                class: "verticalScroll",
                value: 0,
                min: 0,
                max: this.maxPanY,
                type: "range",
                style: `--bola: url(${Core.Instance.ResourcesPath}General/idle.png); background: url(${Core.Instance.ResourcesPath}General/Barra.png?v=${Core.Instance.version});`
            },
            events: new Map().set('input', [this.scroll])
        });

        Core.Instance.data.forEach(estacion => {
            const estacionPerfil = new SitioPerfil(estacion.IdEstacion, function (isMouseOut, estacion, css) {
                this.setHoverPerfil(isMouseOut, estacion, css);
            }.bind(this));

            const estilosEstacionTuberias = configuracionProyecto.perfil.estilosTuberias.PorBombeo.find(element => element.IdEstacion == estacion.IdEstacion);
            backgroundPerfil.appendChild(estacionPerfil.createSitio());
            backgroundPerfil.appendChild(estacionPerfil.createEtiqueta());

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

        configuracionProyecto.perfil.estilosTuberias.PorGravedad.forEach(element => {
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

        this.Panner.append(capaTubos, capaSitios, backgroundPerfil)
        backgroundPerfil.append(tuberiasDiv, this.hoverDiv);
        perfil.append(this.Panner);
        if (configuracionProyecto.doPanX)
            perfil.append(this.horizontalScroll);
        if (configuracionProyecto.doPanY)
            perfil.append(this.verticalScroll);


        EventsManager.Instance.Suscribirevento('OnMouseHoverTabla', new EventoCustomizado((data) => this.setHoverPerfil(data.isMouseOut, data.estacion, data.css)));

    }
    scroll = (e) => {
        if (e.currentTarget.id.includes('horizontal'))
            this.Panner.style.transform = `translateX(${-e.currentTarget.value}px) translateY(${-this.verticalScroll.value}px)`;
        else
            this.Panner.style.transform = `translateX(${-this.horizontalScroll.value}px) translateY(${-e.currentTarget.value}px)`

    }

    InitTuberias(cssPipe, canvas, idEstacion) {
        let particlesAnimatorInstance = new ParticlesAnimator(cssPipe, canvas, idEstacion);
        particlesAnimatorInstance.init();
    }

    #drag = (e) => {
        if (e.which == 1 && (e.currentTarget.doPanX || e.currentTarget.doPanY)) {
            this.moveX = parseInt(this.horizontalScroll.value);
            this.moveY = parseInt(this.verticalScroll.value);
            this.moveX += -e.movementX
            this.moveY += -e.movementY;
            this.moveX = Clamp(this.moveX, 0, this.maxPanX);
            this.moveY = Clamp(this.moveY, 0, this.maxPanY);

            this.Panner.style.transform = `translateX(${e.currentTarget.doPanX ? -this.moveX : 0}px) translateY(${e.currentTarget.doPanY ? -this.moveY : 0}px)`;
            this.horizontalScroll.value = this.moveX;
            this.verticalScroll.value = this.moveY;
        }
    }

    /**
     * 
     * @param {boolean} isMouseOut 
     * @param {Estacion} estacion 
     * @param {string} css formato estilo css
     */
    setHoverPerfil(isMouseOut, estacion, css, stopPropagation) {
        if (isMouseOut)
            this.hoverDiv.style = "dispaly: none;";
        else {
            this.hoverDiv.style = `display: block; background: url(${Core.Instance.ResourcesPath}Sitios/${estacion.Abreviacion}/Perfil/fondo.png?v=${Core.Instance.version}); ${css}`;
        }

        if (!stopPropagation) {

            EventsManager.Instance.EmitirEvento('OnMouseHoverPerfil', { mouseover: !isMouseOut, IdEstacion: estacion.IdEstacion, stopPropagation: true });
        }
    }
}

export default Perfil;