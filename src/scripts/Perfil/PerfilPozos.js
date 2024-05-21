import SitioPerfil from "./SitioPerfil.js";
import { Core } from "../Core.js";
import { Clamp, CreateElement } from "../Utilities/CustomFunctions.js";
import { Configuracion } from "../../config/config.js";
import ParticlesAnimator from "./ParticlesAnimationManager.js";
import Estacion from "../Entities/Estacion.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";

class PerfilPozos {
    constructor() {
        this.create();
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

        // this.Panner = CreateElement({
        //     nodeElement: "div",
        //     attributes: { class: "perfilPanner" },
        //     events: new Map().set('mousemove', [this.#drag])
        // });
        // this.Panner.doPanX = configuracionProyecto.doPanX;
        // this.Panner.doPanY = configuracionProyecto.doPanY;

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

        // configuracionProyecto.perfil.estilosTuberias.PorGravedad.forEach(element => {
        //     if (element != undefined) {
        //         tuberiaEstacion = CreateElement({
        //             nodeElement: "canvas",
        //             attributes: {
        //                 class: "tuberiaPerfil", id: `${element.Tag}_Gravedad`,
        //                 style: element.css
        //             }
        //         });

        //         tuberiasDiv.appendChild(tuberiaEstacion);
        //         this.InitTuberias(element.css, tuberiaEstacion);
        //     }
        // })

        // this.Panner.append(capaTubos, capaSitios, backgroundPerfil)
        backgroundPerfil.append(tuberiasDiv, this.hoverDiv);
        perfil.append(this.Panner);
        if (configuracionProyecto.doPanX)
            perfil.append(this.horizontalScroll);
        if (configuracionProyecto.doPanY)
            perfil.append(this.verticalScroll);


        EventsManager.Instance.Suscribirevento('OnMouseHoverTabla', new EventoCustomizado((data) => this.setHoverPerfil(data.isMouseOut, data.estacion, data.css)));

    }
}

export { PerfilPozos };