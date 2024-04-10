import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import configuracion from "../../config/PadiernaConfig.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { EnumTipoSignal, EnumUnidadesSignal } from "../Utilities/Enums.js";
import { CreateElement } from "../Utilities/CustomFunctions.js";

class SitioPerfil {
    /**
     * @type {HTMLElement}
     */
    ElementosDinamicosHTML = {};
    /**
     * 
     * @param {Estacion} estacion 
     */
    constructor(IdEstacion) {
        this.IdEstacion = IdEstacion;
    }
    createSitio() {
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);
        const signal = estacion.ObtenerPrimerSignal();

        let estacionDiv = CreateElement({ nodeElement: 'div', attributes: { id: `sitioPerfil_${estacion.Nombre}`, class: 'sitioPerfil' } });
        let etiquetaDiv = CreateElement({ nodeElement: 'div', attributes: { id: `etiquetaSitioPerfil_${estacion.Nombre}`, class: 'etiquetaSitioPerfil' } });
        let estacionPerfilDiv = CreateElement({ nodeElement: 'div', attributes: { id: `estacionPerfil_${estacion.Nombre}`, class: 'estacionPerfil' } });
        this.ElementosDinamicosHTML[`idEstacion_${estacion.IdEstacion}`] = CreateElement({ nodeElement: 'p', attributes: { id: `idEstacion_${estacion.IdEstacion}`, class: 'estiloNombreEstacion', style: `background: ${estacion.Enlace == 0 ? "red" : "green"}` }, innerText: estacion.Nombre });
        let imagenEstacionFondoPerfil = CreateElement({ nodeElement: "img", attributes: { id: `idEstacionFondo_${estacion.Abreviacion}`, class: "idEstacionFondo", style: `background: url(${Core.Instance.ResourcesPath}Sitios/${estacion.Abreviacion}/Perfil/m.png?v=10)` } })
        let imagenEstacionNivelPerfil = document.createElement("img");


        if (signal) {
            const valor = `${signal.Valor} ${EnumUnidadesSignal[signal.TipoSignal]}`;
            this.ElementosDinamicosHTML[`valor_${signal.Nombre}`] = CreateElement({ nodeElement: 'p', attributes: {id: `valor_${signal.Nombre}`} ,innerText: `${signal.Nombre}: ${estacion.Enlace == 0 ? "---" : valor}` });

            estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Bomba).forEach(signalBomba => {
                let imagenEstacionBombaPerfil = CreateElement({ nodeElement: "img", attributes: { id: `idBomba_${signalBomba.IdSignal}`, class: "Bomba", style: `background: url(${Core.Instance.ResourcesPath}Sitios/${estacion.Abreviacion}/Perfil/b/)` } })
            })
        }

        estacionPerfilDiv.append(imagenEstacionFondoPerfil);
        Object.values(this.ElementosDinamicosHTML).forEach(elementoDom => {
            etiquetaDiv.append(elementoDom);
        });
        estacionDiv.append(estacionPerfilDiv, etiquetaDiv);

        this.ponerEstilos(etiquetaDiv, estacionPerfilDiv);
        this.suscribirEventos();
        return estacionDiv;
    }

    ponerEstilos(etiquetaDiv, estacionPerfilDiv) {
        const estilosEstacionEtiqueta = configuracion.perfil.estilosEstacion.find(element => element.IdEstacion == this.IdEstacion);
        if (estilosEstacionEtiqueta != undefined) {
            etiquetaDiv.style = estilosEstacionEtiqueta.Etiqueta;
            estacionPerfilDiv.style = estilosEstacionEtiqueta.Imagen;
        }
    }

    suscribirEventos() {
        EventsManager.Instance.Suscribirevento('Update', new EventoCustomizado(() => this.Update()));
    }

    Update() {
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);
        const signal = estacion.ObtenerPrimerSignal();
        
        if (signal) {
            const valor = `${signal.Valor} ${EnumUnidadesSignal[signal.TipoSignal]}`;
            const name = this.ElementosDinamicosHTML[`idEstacion_${estacion.IdEstacion}`];
            const valorSignal = this.ElementosDinamicosHTML[`valor_${signal.Nombre}`];
            name.style.background = estacion.Enlace == 0 ? "red" : "green";
            valorSignal.innerText = estacion.Enlace == 0 ? "---" : valor;
        }
    }
}

export default SitioPerfil;