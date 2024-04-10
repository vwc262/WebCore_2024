import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import configuracion from "../../config/PadiernaConfig.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { EnumTipoSignal, EnumUnidadesSignal } from "../Utilities/Enums.js";
import { CreateElement } from "../Utilities/CustomFunctions.js";

class SitioPerfil {
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

        let signalEtiqueta;
        let estacionDiv = CreateElement({ nodeElement: 'div', attributes: { id: `sitioPerfil_${estacion.Nombre}`, class: 'sitioPerfil' } });
        let nombreEstacion = CreateElement({ nodeElement: 'p', attributes: { id: `idEstacion_${estacion.IdEstacion}`, class: 'estiloNombreEstacion', style: `background: ${estacion.Enlace == 0 ? "red" : "green"}` }, innerText: estacion.Nombre });
        let imagenEstacionFondoPerfil = CreateElement({ nodeElement: "img", attributes: { id: `idEstacionFondo_${estacion.IdEstacion}`, class: "idEstacionFondo", style: `background: url(${Core.Instance.ResourcesPath}/Sitios/${estacion.Abreviacion}/Perfil/m.png?v=10)` } })
        let imagenEstacionNivelPerfil = document.createElement("img");


        if (signal) {
            signalEtiqueta = CreateElement({ nodeElement: 'p', innerText: `${signal.Nombre}: ${signal.Valor} ${EnumUnidadesSignal[signal.TipoSignal]}` });

            estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Bomba).forEach(signalBomba => {
                let imagenEstacionBombaPerfil = CreateElement({ nodeElement: "img", attributes: { id: `idBomba_${signalBomba.IdSignal}`, class: "Bomba", style: `background: url(${Core.Instance.ResourcesPath}/Sitios/${estacion.Abreviacion}/Perfil/b/)` } })
            })
        }

        //estacionDiv.append(imagenEstacionFondoPerfil);
        estacionDiv.append(nombreEstacion);
        estacionDiv.append(signalEtiqueta);

        this.ponerEstilos(estacionDiv);
        this.suscribirEventos();
        return estacionDiv;
    }

    ponerEstilos(estacionDiv) {
        const estilosEstacionEtiqueta = configuracion.perfil.estilosEstacion.find(element => element.IdEstacion == this.IdEstacion);
        if (estilosEstacionEtiqueta != undefined) {
            estacionDiv.style = estilosEstacionEtiqueta.Etiqueta;
        }
    }

    suscribirEventos() {
        EventsManager.Instance.Suscribirevento('Update', new EventoCustomizado(() => this.Update()));
    }

    Update() {
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);
        const signal = estacion.ObtenerPrimerSignal();

        if (signal) {
            const name = document.getElementById(`idEstacion_${estacion.IdEstacion}`);
            name.style.background = estacion.Enlace == 0 ? "red" : "green";
        }
    }
}

export default SitioPerfil;