class Semaforo {
    constructor(semaforoCrudo) {
        if (semaforoCrudo) {
            this.IdSignal = semaforoCrudo.idSignal;
            this.Altura = semaforoCrudo.altura;
            this.Critico = semaforoCrudo.critico;
            this.Preventivo = semaforoCrudo.preventivo;
            this.Normal = semaforoCrudo.normal;
        }
    }
}

export default Semaforo;