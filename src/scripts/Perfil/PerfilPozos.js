import SitioPerfil from "./SitioPerfil.js";
import { Core } from "../Core.js";
import { Clamp, CreateElement } from "../Utilities/CustomFunctions.js";
import { Configuracion } from "../../config/config.js";
import ParticlesAnimator from "./ParticlesAnimationManager.js";
import Estacion from "../Entities/Estacion.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import SitioPerfilPozo from "./SitioPerfilPozo.js";


class PerfilPozos {
    //#region  Propiedades
    PanzoomRef = undefined;
    oldScrollValuePan = 0;
    renderWidth = 0;
    renderHeight = 0;
    PanZoomConfig = {
        maxScale: 5,
        minScale: 1,
        startScale: 1,
        force: false
    };
    //#endregion
    constructor() {
        this.create();
    }

    create() {
        const configuracionProyecto = Configuracion.GetConfiguracion(Core.Instance.IdProyecto);
        this.renderHeight = configuracionProyecto.heightRender;
        this.renderWidth = configuracionProyecto.widthRender;
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
            // events: new Map().set('mousemove', [this.#drag])
        });
        this.Panner.doPanX = configuracionProyecto.doPanX;
        this.Panner.doPanY = configuracionProyecto.doPanY;

        let backgroundPerfil = CreateElement({
            nodeElement: "div",
            attributes: {
                class: "estacionesContainer",
                style: `background: url(${Core.Instance.ResourcesPath}Perfil/background.jpg?v=${Core.Instance.version}); width: ${widthRenderPerfil}px; height: ${heightRender}px;background-size:cover`
            }
        });

        let capaTubos = CreateElement({
            nodeElement: "div",
            attributes: {
                class: "capasitios",
                style: `background: url(${Core.Instance.ResourcesPath}Perfil/tubos.png?v=${Core.Instance.version}); width: ${widthRenderPerfil}px; height: ${heightRender}px;background-size:cover`
            }
        });

        let capaSitios = CreateElement({
            nodeElement: "div",
            attributes: {
                class: "capasitios",
                style: `background: url(${Core.Instance.ResourcesPath}Perfil/sitios.png?v=${Core.Instance.version}); width: ${widthRenderPerfil}px; height: ${heightRender}px;background-size:cover`
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
            const estacionPerfil = new SitioPerfilPozo(estacion.IdEstacion, function (isMouseOut, estacion, css) {
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

        this.Panner.append(capaTubos, capaSitios, backgroundPerfil)
        backgroundPerfil.append(tuberiasDiv, this.hoverDiv);
        perfil.append(this.Panner);
        if (configuracionProyecto.doPanX)
            perfil.append(this.horizontalScroll);
        if (configuracionProyecto.doPanY)
            perfil.append(this.verticalScroll);


        EventsManager.Instance.Suscribirevento('OnMouseHoverTabla', new EventoCustomizado((data) => this.setHoverPerfil(data.isMouseOut, data.estacion, data.css)));

        this.establecerPanzoom(this.Panner);

    }

    establecerPanzoom(elementoPanner) {
        console.log(elementoPanner.parent);
        this.PanzoomRef = Panzoom(elementoPanner, this.PanZoomConfig);
        elementoPanner.addEventListener('wheel', this.PanzoomRef.zoomWithWheel);
        elementoPanner.addEventListener('panzoomzoom', this.checarLimitesPanzoom);
        elementoPanner.addEventListener('panzoompan', this.checarLimitesPanzoom);
    }

    checarLimitesPanzoom = (e) => {
        let origenX = ((e.detail.scale * this.renderWidth - this.renderWidth) / (e.detail.scale * 2));
        let origenY = (e.detail.scale * this.renderHeight - this.renderHeight) / (e.detail.scale * 2);
        let limiteX = {
            pos: origenX,
            neg: - origenX
        }
        let limiteY = {
            pos: origenY,
            neg: - origenY
        }        
        let newX, newY;        
        if (e.detail.scale === this.PanZoomConfig.minScale && (e.detail.x !== 0 || e.detail.y !== 0)) {
            this.PanzoomRef.pan(origenX, origenY);
            newX = origenX;
            newY = origenY;
        }
        else if (e.detail.x > limiteX.pos || e.detail.x < (limiteX.neg) || e.detail.y > limiteY.pos || e.detail.y < limiteY.neg) {
            newX =  e.detail.x <= limiteX.pos && e.detail.x >= limiteX.neg ? e.detail.x : e.detail.x > limiteX.pos ? limiteX.pos : limiteX.neg;
            newY =  e.detail.y <= limiteY.pos && e.detail.y >= limiteY.neg ? e.detail.y : e.detail.y > limiteY.pos ? limiteY.pos : limiteY.neg;            
            this.PanzoomRef.pan(newX, newY);
            let dir = this.oldScrollValuePan > e.detail.x ? 1 : -1;
            this.oldScrollValuePan = newX;            
        }
        else {
            e.detail.x =  e.detail.x;
            e.detail.y =  e.detail.y;
            newX = e.detail.x;
            newY = e.detail.y;
        }          
        // if (vwc.Settings.useShortCut) {
        //     let areaVisual = Perfil.GetArea(e.detail.scale, newX, newY);
        //     let idAreaNuevo = -1;
        //     let EmpalmeNuevo = 0;
        //     for (let i = 0; i < vwc.Settings.findShortCut; i++) {
        //         let areaSeleccion = Perfil.GetArea(vwc.Settings.findSCZoom[i], vwc.Settings.findSCposX[i], vwc.Settings.findSCposY[i]);
        //         let empalme = Perfil.CalcularEmpalme(areaVisual, areaSeleccion);
        //         if (empalme > EmpalmeNuevo) {
        //             EmpalmeNuevo = empalme;
        //             idAreaNuevo = i;
        //         }
        //     }
        //     if (!Perfil.SpinnerAction && idAreaNuevo >= 0 && EmpalmeNuevo > 0.3 && (Perfil.idArea === undefined || Perfil.idArea != idAreaNuevo)) {
        //         Perfil.idArea = idAreaNuevo;

        //         Table.scrollIndex = vwc.Settings.findSCTableIndex[idAreaNuevo];
        //         if (Perfil.needSpinerValidation)
        //             Table.UpdateContent();
        //         Perfil.needSpinerValidation = true;
        //         vwc.Settings.currentCellIndex = idAreaNuevo;

        //         Perfil.updateSPinner(vwc.Settings.cellSelectorDegrees[vwc.Settings.currentCellIndex]);
        //     }

        //     let restablecerBtn = Perfil.DOMElements.restablecerBtn.HTML;
        //     if (e.detail.scale <= 1)
        //         restablecerBtn.attr({ isHide: true }).hide();
        //     else {
        //         if (!Perfil.googleMapActive)
        //             restablecerBtn.attr({ isHide: false }).show();

        //     }

        // }

    }
}

export { PerfilPozos };