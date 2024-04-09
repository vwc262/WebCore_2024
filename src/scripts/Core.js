import { VwcApp } from "./App.js";
import Estacion from "./Entities/Estacion.js";
import { Fetcher } from "./Fetcher/Fetcher.js";
import { EventsManager } from "./Managers/EventsManager.js";
import { EnumControllerMapeo, EnumProyecto, RequestType } from "./Utilities/Enums.js";

/**
 * Clase Base de la App Web
 */
class Core {
    IdInterval = undefined;
    IdProyecto = EnumProyecto.Default;
    /**
     * @type {[Estacion]}
     */
    data = undefined;
    static #_instance = undefined;
    /**
     * @returns {Core}
     */
    static get Instance() {
        if (!this.#_instance) {
            this.#_instance = new Core();
        }
        return this.#_instance;
    }
    /**
     * 
     * @param {EnumProyecto} idProyecto 
     */
    async Init(idProyecto) {
        console.info("Iniciando App");
        this.IdProyecto = idProyecto;
        await this.Update();
        this.IdInterval = setInterval(() => this.Update(), 10 * 1000);
    }
    async Update() {
        const data = await Fetcher.Instance.RequestData(`${EnumControllerMapeo.READ}?idProyecto=${this.IdProyecto}`, RequestType.GET, undefined, false);
        this.data = this.GetData(data);
        //console.log(this.data);
        EventsManager.Instance.EmitirEvento('Update'); // Manda mensaje de update a todos los elementos que necesiten actualizar
    }
    /**
     * 
     * @param {*} jsonObject 
     * @returns {[Estacion]}
     */
    GetData(jsonObject) {
        return jsonObject.map(element => new Estacion(element));
    }
    /**
     * Obtiene los datos de la estacion especifica
     * @param {number} idEstacion 
     * @returns {Estacion | undefined} 
     */
    GetDatosEstacion(idEstacion) {
        return this.data.find(estacion => estacion.IdEstacion == idEstacion);
    }


}
export { Core }
window.onload = () => new VwcApp().Start();
