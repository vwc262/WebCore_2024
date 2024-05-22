import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import { Configuracion } from "../../config/config.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { EnumEnlace, EnumTipoSignal } from "../Utilities/Enums.js";
import { CreateElement } from "../Utilities/CustomFunctions.js";
import { Particular } from "../Particular/Particular.js";

class SitioPerfilPozo {
    /**
     * @type {HTMLElement}
     */
    ElementosDinamicosHTML = {};
    /**
     * 
     * @param {Estacion} estacion 
     * @param {Function} setHover
     */
    constructor(IdEstacion, setHover) {
        this.Configuracion = Configuracion.GetConfiguracion(Core.Instance.IdProyecto);
        this.IdEstacion = IdEstacion;
        this.setHover = setHover;
        this.estilosEstacionEtiqueta = this.Configuracion.perfil.estilosEstacion.find(element => element.IdEstacion == this.IdEstacion);
    }

    createEtiqueta() {
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);
        const signal = estacion.ObtenerPrimerSignal();
        //console.log(signal)

        let valorSignal;
        let nameSignal;
        let etiquetaDiv = CreateElement({
            nodeElement: 'div',
            attributes: {
                id: `etiquetaSitioPerfil_${estacion.Nombre}`,
                class: 'lblCirclePerfil'
            },
        });

        let circuloEnlace = CreateElement({
            nodeElement: 'img',
            attributes: {
                id: `pl_Enlace${estacion.IdEstacion}`,
                class: 'imLinkCircle',
                src:`${Core.Instance.ResourcesPath}General/circlestate_2.png`
            },
        });



        let signalDiv = CreateElement({
            nodeElement: 'div',
            attributes: { class: 'signalSitioPerfil' }
        });

        let nombreSitio = CreateElement({
            nodeElement: 'p',
            attributes: {
                id: `idEstacion_${estacion.IdEstacion}`, class: 'estiloNombreEstacion',
                style: `background: ${estacion.IsTimeout() ? 'rgb(129, 11, 11)' : estacion.IsEnMantenimiento() ? 'rgb(129, 129, 129)' : estacion.Enlace == EnumEnlace.FueraLinea ? "rgb(235, 13, 13)" : "rgb(0, 128, 0)"}`
            },
            innerText: estacion.Nombre
        });

        if (signal) {
            const valor = `${signal.GetValorString(true, true)}`;

            valorSignal = CreateElement({
                nodeElement: 'div',
                attributes: {
                    id: `valor_${signal.IdEstacion}`,
                },
                innerHTML: valor
            });

            nameSignal = CreateElement({
                nodeElement: 'p',
                attributes: {
                    id: `name_${signal.Nombre}`,
                },
                innerText: `${signal.GetNomenclaturaSignal()}:  `
            });

            signalDiv.append(nameSignal, valorSignal)
        }

        this.ElementosDinamicosHTML[nombreSitio.id] = nombreSitio;
        if (signal) {
            this.ElementosDinamicosHTML[valorSignal.id] = valorSignal;
        }

        etiquetaDiv.append(circuloEnlace);
        this.ponerPosiciones(etiquetaDiv, this.estilosEstacionEtiqueta);

        return etiquetaDiv;
    }

    createSitio() {
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);

        let estacionDiv = CreateElement({
            nodeElement: 'div',
            attributes: { id: `sitioPerfil_${estacion.Nombre}`, class: 'sitioPerfil', style: `${this.estilosEstacionEtiqueta.Imagen}` },
            events: new Map()
                .set("click", [this.mostrarParticular])
                .set("mouseover", [() => {
                    this.setHover(false, estacion, this.estilosEstacionEtiqueta.Imagen);
                }])
                .set("mouseout", [() => {
                    this.setHover(true, estacion);
                }])
        });
        let estacionPerfilDiv = CreateElement({
            nodeElement: 'div',
            attributes: { id: `estacionPerfil_${estacion.Nombre}`, class: 'estacionPerfil' }
        });

        estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Bomba).forEach(signalBomba => {

            let imagenEstacionBombaPerfil = CreateElement({
                nodeElement: "img",
                attributes: { id: `idBomba_${signalBomba.IdSignal}`, class: "renderImagesSitio", src: estacion.ObtenerRenderNivelOBomba(signalBomba, "Perfil") }
            });

            estacionPerfilDiv.append(imagenEstacionBombaPerfil);
            this.ElementosDinamicosHTML[imagenEstacionBombaPerfil.id] = imagenEstacionBombaPerfil;
        })

        estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Nivel).forEach(signalNivel => {
            let imagenEstacionNivelPerfil = CreateElement({
                nodeElement: "img",
                attributes: { class: "renderImagesSitio", id: `idEstacionNivel_${estacion.Abreviacion}`, src: estacion.ObtenerRenderNivelOBomba(signalNivel, "Perfil") },
            });

            estacionPerfilDiv.append(imagenEstacionNivelPerfil);
            this.ElementosDinamicosHTML[imagenEstacionNivelPerfil.id] = imagenEstacionNivelPerfil;
        })


        estacionDiv.append(estacionPerfilDiv);

        this.suscribirEventos();

        return estacionDiv;
    }

    ponerPosiciones(etiquetaDiv, estilosEstacionEtiqueta) {
        if (estilosEstacionEtiqueta != undefined) {
            etiquetaDiv.style = estilosEstacionEtiqueta.Etiqueta;
        }
    }

    onMouseUp(idHover) {
        const elementHover = document.getElementById(idHover);
        elementHover.style.display = "block";
    }

    suscribirEventos() {
        EventsManager.Instance.Suscribirevento('Update', new EventoCustomizado(() => this.Update()));
    }

    Update() {
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);
        const signal = estacion.ObtenerPrimerSignal();

        const name = this.ElementosDinamicosHTML[`idEstacion_${estacion.IdEstacion}`];
        const nivel = this.ElementosDinamicosHTML[`idEstacionNivel_${estacion.Abreviacion}`];

        name.style.background = estacion.IsTimeout() ? 'rgb(129, 11, 11)' : estacion.IsEnMantenimiento() ? 'rgb(129, 129, 129)' : estacion.Enlace == EnumEnlace.FueraLinea ? "rgb(235, 13, 13)" : "rgb(0, 128, 0)";

        if (signal) {
            const valor = `${signal.GetValorString(true, true)}`;
            const valorSignal = this.ElementosDinamicosHTML[`valor_${signal.IdEstacion}`];
            valorSignal.innerHTML = valor;
        }

        estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Nivel).forEach(signalNivel => {
            nivel.src = estacion.ObtenerRenderNivelOBomba(signalNivel, "Perfil");
        })

        estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Bomba).forEach(signalBomba => {
            const bomba = this.ElementosDinamicosHTML[`idBomba_${signalBomba.IdSignal}`];
            bomba.src = estacion.ObtenerRenderNivelOBomba(signalBomba, "Perfil");
        })
    }

    mostrarParticular = () => {
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);
        Particular.Instance.setEstacion(estacion);
        Particular.Instance.mostrarDetalles();
    }
}

export default SitioPerfilPozo;