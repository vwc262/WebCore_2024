import { Estacion } from "../../Entities/Estacion";

class GlobalData {
    static #_instance = undefined;
    /**
     * @returns {GlobalData}
     */
    static get Instance() {
        if (!this.#_instance) {
            this.#_instance = new GlobalData();
        }
        return this.#_instance;
    }

    Estaciones = new Map();

    /**
     * 
     * @returns {Estacion[]}
     */
    getEstaciones = () => {
        return Array.from(this.Estaciones.values())
    }
}

export { GlobalData }