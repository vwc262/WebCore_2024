import { GlobalData } from "../scripts/Global/GlobalData.js";
import { Signal } from "./Signal.js";
class Estacion {
    constructor(estacionCruda) {
        this.IdEstacion = estacionCruda.idEstacion;
        this.Enlace = estacionCruda.enlace;
        this.FallaEnergia = estacionCruda.fallaEnergia;
        this.Latitud = estacionCruda.latitud;
        this.Longitud = estacionCruda.longitud;
        this.Nombre = estacionCruda.nombre;
        this.Tiempo = estacionCruda.tiempo;
        this.TipoEstacion = estacionCruda.tipoEstacion;
        this.TipoPoleo = estacionCruda.tipoPoleo
        this.Signals = new Map()
        this.SignalIndividual = new Map()
        this.#agregarSignals(estacionCruda.signals);
        GlobalData.Instance.agregarEstacion(this);
    }

    /**
     * 
     * @param {[]} signals 
     */
    #agregarSignals = (signals) => {
        signals.forEach(s => {
            this.SignalIndividual.set(s.idSignal, s);
            if (!this.Signals.has(s.tipoSignal)) {
                this.Signals.set(s.tipoSignal, []);
            }
            this.Signals.get(s.tipoSignal).push(s);
        })
    }

    /**
     * 
     * @param {E_TipoSignal} tipoSignal 
     * @returns {Signal[]}
     */
    getSignals = (tipoSignal) => {
        return this.Signals.get(tipoSignal)
    }

    /**
     * 
     * @param {number} idSignal 
     * @returns {Signal}
     */
    getSignal = (idSignal) => {
        return this.SignalIndividual.get(idSignal)
    }
    updateData = (updateCrudo) => {
        this.Enlace = updateCrudo.E;
        this.Tiempo = updateCrudo.T;
        this.FallaEnergia = updateCrudo.F;
        for (const [idSignal, valorsignal] of Object.entries(updateCrudo.S)) {
            let signal = this.getSignal(parseInt(idSignal));
            signal.valor = valorsignal;
            signal.dentroRango = signal.valor != -0.9;
        }
        // console.log(this.getSignals(1))
    }

}

export { Estacion };