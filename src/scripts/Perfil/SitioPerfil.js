import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import configuracion from "../../config/PadiernaConfig.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { EnumTipoSignal } from "../Utilities/Enums.js";

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
        console.log(estacion);

        let estacionDiv = document.createElement("div");
        let nombreEstacion = document.createElement("p");
        let nombreSignal = document.createElement("p");
        let valorSignal = document.createElement("p");

        nombreEstacion.innerText = estacion.Nombre;
        if (estacion.Signals.length > 0 && estacion.Signals[0].Nombre.includes("Nivel")) {
            nombreSignal.innerText = estacion.Signals[0].Nombre;
            valorSignal.innerText = "Valor: " + estacion.Signals[0].Valor + " " +  EnumTipoSignal.Nivel;
        }
        else if (estacion.Signals.length > 0 && estacion.Signals[0].Nombre.includes("Presion")){
            nombreSignal.innerText = estacion.Signals[0].Nombre;
            valorSignal.innerText = "Valor: " + estacion.Signals[0].Valor + " " +  EnumTipoSignal.Presion;
        }
        else if (estacion.Signals.length > 0 && estacion.Signals[0].Nombre.includes("Gasto")){
            nombreSignal.innerText = estacion.Signals[0].Nombre;
            valorSignal.innerText = "Valor: " + estacion.Signals[0].Valor + " " + EnumTipoSignal.Gasto;
        }

        estacionDiv.setAttribute("class", `sitioPerfil_${estacion.Nombre}`);
        valorSignal.setAttribute("id", estacion.Nombre);

        estacionDiv.append(nombreEstacion);
        estacionDiv.append(nombreSignal);
        estacionDiv.append(valorSignal);

        this.ponerPosiciones(estacionDiv);
        this.suscribirEventos();
        return estacionDiv;
    }

    ponerPosiciones(estacionDiv) {
        const estilosEstacionEtiqueta = configuracion.perfil.estilosEstacion.find(element => element.IdEstacion == this.IdEstacion);
        if (estilosEstacionEtiqueta != undefined) {
            estacionDiv.style = estilosEstacionEtiqueta.Etiqueta;
        }
    }

    suscribirEventos() {
        EventsManager.Instance.Suscribirevento('Update', new EventoCustomizado(() => this.Update()));
    }

    Update() {
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion)
        //console.log('Update SitioPerfil' + estacion.Nombre);
    }
}

export default SitioPerfil;