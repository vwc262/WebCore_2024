import Linea from "./Linea.js";
import Signal from "./Signal.js";


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
}

export default Estacion;