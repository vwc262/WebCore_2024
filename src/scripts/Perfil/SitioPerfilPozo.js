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
    ElementosDinamicosHTML = [];
    /**
     * 
     * @param {Estacion} estacion 
     * @param {Function} setHover
     */
    constructor(IdEstacion, setHover) {
        this.Configuracion = Configuracion.GetConfiguracion(Core.Instance.IdProyecto);
        this.IdEstacion = IdEstacion;
        this.setHover = setHover;
        this.elementoCirculo = undefined;
        this.elementoBomba = undefined;
        this.estilosEstacionEtiqueta = this.Configuracion.perfil.estilosEstacion.find(element => element.IdEstacion == this.IdEstacion);
        EventsManager.Instance.Suscribirevento('OnMouseHoverTabla', new EventoCustomizado((data) => this.HoverGeneral(data.isMouseOut, data.estacion, data.css)));
    }
    HoverGeneral(isMouseOut, estacion, css) {
        if (estacion.IdEstacion == this.IdEstacion) {
            this.elementoCirculo.style.filter = isMouseOut ? '' : 'drop-shadow(rgb(0, 255, 231) 0px 0px 1px)';
            this.elementoBomba.style.background = isMouseOut ? '' : `url(${Core.Instance.ResourcesPath}Sitios/Global/global.png) 100% 100%`;
        }
    }
    createEtiqueta() {
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);
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
                src: `${Core.Instance.ResourcesPath}General/circlestate_2.png`
            },
            events: new Map().set("mouseover", [() => {
                this.HoverGeneral(false, estacion, '');
                EventsManager.Instance.EmitirEvento('OnMouseHoverPerfil', { mouseover: true, IdEstacion: estacion.IdEstacion, stopPropagation: true });
            }]).set("mouseout", [() => { this.HoverGeneral(true, estacion, ''); EventsManager.Instance.EmitirEvento('OnMouseHoverPerfil', { mouseover: false, IdEstacion: estacion.IdEstacion, stopPropagation: true }); }])
        });
        this.elementoCirculo = circuloEnlace; // se guarda la referencia para cuestiones de hover
        circuloEnlace.estacion = estacion;
        circuloEnlace.update = this.ActualizarEnlaceLermaPerfil;
        this.ElementosDinamicosHTML.push(circuloEnlace);
        let textoCirculo = CreateElement({
            nodeElement: "div",
            attributes: {
                abv: `${estacion.Abreviacion}`,
                class: 'txtLinkCircle',
            },
        });
        etiquetaDiv.append(circuloEnlace, textoCirculo);
        this.ponerPosiciones(etiquetaDiv, this.estilosEstacionEtiqueta);
        circuloEnlace.update(estacion);
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
                    this.HoverGeneral(false, estacion, '');
                    EventsManager.Instance.EmitirEvento('OnMouseHoverPerfil', { mouseover: true, IdEstacion: estacion.IdEstacion, stopPropagation: true });
                }])
                .set("mouseout", [() => {
                    this.HoverGeneral(true, estacion, '');
                    EventsManager.Instance.EmitirEvento('OnMouseHoverPerfil', { mouseover: false, IdEstacion: estacion.IdEstacion, stopPropagation: true });
                }])
        });
        let estacionPerfilDiv = CreateElement({
            nodeElement: 'div',
            attributes: { id: `estacionPerfil_${estacion.Nombre}`, class: 'estacionPerfil' }
        });

        estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Bomba).forEach(signalBomba => {
            let imagenEstacionBombaPerfil = CreateElement({
                nodeElement: "img",
                attributes: { id: `idBomba_${signalBomba.IdSignal}`, class: "renderImagesSitio imgBck", src: estacion.ObtenerRenderNivelOBombaLerma(signalBomba, "Perfil") }
            });
            imagenEstacionBombaPerfil.signal = signalBomba;
            imagenEstacionBombaPerfil.update = this.ActualizarImagenBombaPerfilLerma;
            estacionPerfilDiv.append(imagenEstacionBombaPerfil);
            imagenEstacionBombaPerfil.estacion = estacion;
            imagenEstacionBombaPerfil.update(estacion);
            this.elementoBomba = imagenEstacionBombaPerfil; //  se guarda referencia para cuestiones de hover
            this.ElementosDinamicosHTML.push(imagenEstacionBombaPerfil);
        })
        estacionDiv.append(estacionPerfilDiv);
        this.suscribirEventos();
        return estacionDiv;
    }
    //#region Perfil Elementos Lerma
    ActualizarEnlaceLermaPerfil(estacionUpdate) {
        if (estacionUpdate) {
            const imgCirculo = this;
            const url = `${Core.Instance.ResourcesPath}General/circlestate_${estacionUpdate.IsTimeout() ? 0 : estacionUpdate.IsEnMantenimiento() ? 1 : estacionUpdate.EstaEnLinea() ? 2 : 0}.png`;
            imgCirculo.setAttribute('src', url);
        }
    }
    ActualizarImagenBombaPerfilLerma(estacionUpdate) {
        if (estacionUpdate) {
            const imagenBomba = this;
            imagenBomba.setAttribute('src', estacionUpdate.ObtenerRenderNivelOBombaLerma(imagenBomba.signal, "Perfil"));
            imagenBomba.style.filter = imagenBomba.signal.Valor == 4 ? "hue-rotate(295deg)" : "[hue-rotate(0deg)";
        }
    }
    Update() {
        const estacionUpdate = Core.Instance.GetDatosEstacion(this.IdEstacion);
        this.ElementosDinamicosHTML.forEach(element => {
            element.update(estacionUpdate);
        });
    }
    //#endregion
    ponerPosiciones(etiquetaDiv, estilosEstacionEtiqueta) {
        if (estilosEstacionEtiqueta != undefined) {
            etiquetaDiv.style = estilosEstacionEtiqueta.Etiqueta;
        }
    }
    suscribirEventos() {
        EventsManager.Instance.Suscribirevento('Update', new EventoCustomizado(() => this.Update()));
    }
    mostrarParticular = () => {
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);
        Particular.Instance.setEstacion(estacion);
        Particular.Instance.mostrarDetalles();
    }
}

export default SitioPerfilPozo;