import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import configuracion from "../../config/PadiernaConfig.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { EnumUnidadesSignal } from "../Utilities/Enums.js";

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

        let estacionDiv = document.createElement("div");
        let nombreEstacion = document.createElement("p");
        let signalEtiqueta = document.createElement("p");

        let imagenEstacionFondoPerfil = document.createElement("img");
        let imagenEstacionNivelPerfil = document.createElement("img");
        let imagenEstacionBombaPerfil = document.createElement("img");

        nombreEstacion.innerText = estacion.Nombre;

        if (signal) {
            signalEtiqueta.innerText = `${signal.Nombre}: ${signal.Valor} ${EnumUnidadesSignal[signal.TipoSignal]}`;
        }

        estacionDiv.setAttribute("class", `sitioPerfil_${estacion.Nombre}`);
        estacionDiv.setAttribute("class", `sitioPerfil`);

        nombreEstacion.setAttribute("class", `estiloNombreEstacion`); 
        nombreEstacion.setAttribute("id", `idEstacion_${estacion.IdEstacion}`);
        nombreEstacion.style.background = estacion.Enlace == 0 ? "red" : "green";

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