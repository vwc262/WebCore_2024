import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";

class SitioPerfil {
    /**
     * 
     * @param {Estacion} estacion 
     */
    constructor(IdEstacion) {
        this.IdEstacion = IdEstacion;
    }
    createSitio() {
        let estacionDiv = document.createElement("div");
        let nombreEstacion = document.createElement();
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);
        estacionDiv.setAttribute("id", estacion.IdEstacion)
        estacionDiv.innerText = estacion.Nombre;
        this.suscribirEventos();
        return estacionDiv;
    }

    suscribirEventos() {
        EventsManager.Instance.Suscribirevento('Update', new EventoCustomizado(() => this.Update()));
    }
    Update() {
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion)
        console.log('Update SitioPerfil' + estacion.Nombre);
    }
}

export default SitioPerfil;