import Semaforo from "./Semaforo.js";
class Signal {
    constructor(signalCruda) {
        this.IdSignal = signalCruda.idSignal;
        this.IdEstacion = signalCruda.idEstacion;
        this.Nombre = signalCruda.nombre;
        this.Valor = signalCruda.valor;
        this.TipoSignal = signalCruda.tipoSignal;
        this.Ordinal = signalCruda.ordinal;
        this.IndiceImagen = signalCruda.indiceImagen;
        this.DentroLimite = signalCruda.dentroLimite;
        this.DentroRango = signalCruda.dentroRango;
        this.Linea = signalCruda.linea;
        this.Semaforo = this.#EstablecerSemaforo(signalCruda.semaforo);
    }
    #EstablecerSemaforo(semaforoCrudo) {
        return new Semaforo(semaforoCrudo);
    }
}

export default Signal;