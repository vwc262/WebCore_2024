import Linea from "./Linea.js";
import Signal from "./Signal.js";
import { EnumTipoSignal } from "../Utilities/Enums.js";


class Estacion {
    constructor(estacionCruda) {
        this.IdEstacion = estacionCruda.idEstacion;
        this.Nombre = estacionCruda.nombre;
        this.Latitud = estacionCruda.latitud;
        this.Longitud = estacionCruda.longitud;
        this.Tiempo = estacionCruda.tiempo;
        this.Enlace = estacionCruda.enlace;
        this.Abreviacion = estacionCruda.abreviacion;
        this.TipoEstacion = estacionCruda.TipoEstacion;
        this.Lineas = this.#EstablecerLineas(estacionCruda.lineas);
        /**
         * @type {[Signal]}
         */
        this.Signals = this.#EstablecerSignals(estacionCruda.signals)
    }
    /**
     * 
     * @param {jsonArray} lineasCrudas 
     * @returns {[Linea]}
     */
    #EstablecerLineas(lineasCrudas) {
        return lineasCrudas.map(lineaCruda => new Linea(lineaCruda));
    }
    #EstablecerSignals(signalsCrudas) {
        return signalsCrudas.map(signalCruda => new Signal(signalCruda))
    }
    ObtenerPrimerSignal() {
        if (this.Signals.length > 0) {
            return this.Signals[0];
        }
    }
    /**
     * 
     * @param {keyof EnumTipoSignal} EnumTipoSignal 
     * @returns {[Signal]}
     */
    ObtenerSignalPorTipoSignal(EnumTipoSignal){
        return this.Signals.filter(signal  => signal.TipoSignal == EnumTipoSignal) ?? [];     
    }
}

export default Estacion;