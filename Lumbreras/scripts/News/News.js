import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { EnumTipoSignal } from "../Utilities/Enums.js";
import NewsElement from "../News/NewsElement.js";


/** @returns {News} */
class News {

    constructor() {
        this.xBase = 0;  // Posición base inicial
        this.velocidad = 50; // Píxeles por segundo (ajusta este valor)
        this.ultimoTiempo = performance.now();
        this.HTMLElements = [];
        this.enEjecucion = true;
    }

    Init() {

        const config = Core.Instance.Configuracion;

        const keys = Object.keys(config.interceptores);
        keys.forEach(k => {
            let interceptor = config.interceptores[k];

            interceptor.ids.forEach(idEstacion => {
                const estacion = Core.Instance.GetDatosEstacion(idEstacion);
                const niveles = estacion.Signals.filter(s => s.TipoSignal == EnumTipoSignal.Nivel);

                niveles.forEach(n => {
                    let element = new NewsElement(interceptor.abreviacion, estacion, n);
                    let div = element.createElement();
                    div.width = 160;

                    this.alojarElementoDinamico([div]);
                });
            });
        });

        this.setupNews();
        this.suscribirEventos();
    }

    setupNews() {
        let xAcumulado = 0;
        const espaciado = 10;

        this.HTMLElements.forEach(elemento => {
            elemento.style.left = `${xAcumulado}px`;

            if (elemento.visible) {
                xAcumulado += elemento.width + espaciado;
            }
        });
    }

    /**
    *aloja un elemento dinamico a la propiedad HTML
    * @param {[HTMLElement]} elementos
    */
    alojarElementoDinamico(elementos) {
        elementos.forEach((elemento) => {
            this.HTMLElements.push(elemento);
        });
    }

    suscribirEventos() {
        EventsManager.Instance.Suscribirevento(
            "Update",
            new EventoCustomizado(this.Update)
        );
    }

    Update= () => {
        const elemVisibles = this.HTMLElements.filter(f => f.visible);
        this.enEjecucion = elemVisibles.length > 10;
        this.animar(performance.now());
    }

    animar(tiempoActual) {

        if (!this.enEjecucion) return;

        // Calcular delta time en segundos
        const deltaTime = (tiempoActual - this.ultimoTiempo) / 1000;
        this.ultimoTiempo = tiempoActual;

        // Calcular desplazamiento basado en tiempo
        const desplazamiento = this.velocidad * deltaTime;
        this.xBase -= desplazamiento; // Mover la posición base
        const espaciado = 10;

        // Verificar si necesitamos reciclar
        const primerElemento = this.HTMLElements[0];
        let parar = false;

        if (primerElemento && parseFloat(primerElemento.style.left) + primerElemento.width + espaciado < 0) {

            // Mover primer elemento al final
            const ultimoElemento = [...this.HTMLElements].reverse().find(el => el.visible);

            const nuevoX = parseFloat(ultimoElemento.style.left.replace('px', '')) + ultimoElemento.width + espaciado;

            primerElemento.style.left = `${nuevoX}px`;
            this.xBase += primerElemento.width + espaciado;;

            // Reordenar array para mantener secuencia
            this.HTMLElements = [...this.HTMLElements.slice(1), this.HTMLElements[0]];

        }

        // Aplicar a todos los HTMLElements con sus posiciones relativas
        let xAcumulado = 0;

        this.HTMLElements.forEach(elemento => {
            elemento.style.left = `${this.xBase + xAcumulado}px`;

            if (elemento.visible) {
                xAcumulado += elemento.width + espaciado;
            }
        });

        // Continuar la animación
        this.animacionId = requestAnimationFrame(t => this.animar(t));
    }
}

export default News;