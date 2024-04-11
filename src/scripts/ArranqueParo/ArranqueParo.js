import { Core } from '../Core.js';
import { EventoCustomizado, EventsManager } from '../Managers/EventsManager.js'
import { EnumAppEvents } from '../Utilities/Enums.js';
import Login from '../Entities/Login/Login.js'
class ArranqueParo {
    //#region Singleton
    static #instance = undefined;
    /**
     * @returns {ArranqueParo}
     */
    static get Instance() {
        if (!this.#instance) {
            this.#instance = new ArranqueParo();
        }
        return this.#instance
    }
    //#endregion
    //#region
    constructor() {
        this.idEstacion = 0;
        // suscripcion al evento logout
        EventsManager.Instance.Suscribirevento(EnumAppEvents.LogOut, new EventoCustomizado(this.CloseArranqueParo));
        EventsManager.Instance.Suscribirevento(EnumAppEvents.Update, new EventoCustomizado(this.Update));
    }
    //#endregion

    //#region Propiedades
    isVisible = false;

    //#endregion

    //#region Metodos
    Create(idEstacion) {
        const sesionIniciada = Login.Instace.userIsLogged; // para saber si la sesion ya se inicio        
        this.idEstacion = idEstacion
        const estacionActual = Core.Instance.GetDatosEstacion(this.idEstacion); // Se obtiene la estacion Actual
        // Si ya se complen las condiciones cambiar la bandera is visible a true
    }

    Update = () => {
        if (this.isVisible) {
            const estacionUpdate = Core.Instance.GetDatosEstacion(this.idEstacion);

        }
    }

    CloseArranqueParo = () => {
        this.isVisible = false;
        // Logica para cerrar el modal
    }
    //#endregion

}
export { ArranqueParo };