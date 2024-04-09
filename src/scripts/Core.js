import Estacion from "./Entities/Estacion.js";
import { Fetcher } from "./Fetcher/Fetcher.js";
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
    Init(idProyecto) {
        console.info("Iniciando App");
        this.IdProyecto = idProyecto;
        this.Update();
        this.IdInterval = setInterval(() => this.Update(), 10 * 1000);

    }
    async Update() {
        const data = await Fetcher.Instance.RequestData(`${EnumControllerMapeo.READ}?idProyecto=${this.IdProyecto}`, RequestType.GET, undefined, false);
        this.data = this.GetData(data);
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
window.onload = Core.Instance.Init(EnumProyecto.Padierna);