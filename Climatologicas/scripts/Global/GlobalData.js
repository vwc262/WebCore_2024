import { Estacion } from "../../Entities/Estacion.js";
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

    #Estaciones = new Map();
    /**
     * 
     * @param {Estacion} estacion 
     */
    agregarEstacion = (estacion) => {
        this.#Estaciones.set(estacion.IdEstacion, estacion);
    }
    /**
     * 
     * @returns {Estacion[]}
     */
    getEstaciones = () => {
        return Array.from(this.#Estaciones.values())
    }
    /**
     * 
     * @param {number} idEstacion 
     * @returns {Estacion}
     */
    getEstacion = (idEstacion) => {
        return this.#Estaciones.get(idEstacion);
    }
}

export { GlobalData }