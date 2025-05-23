import { Core } from "../Core.js";
import { EnumTipoSignal } from "../Utilities/Enums.js";
import NewsElement from "./NewsElement.js";


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

        this.ultimoTiempo = 0;
        this.animar(performance.now());

    }

    /**
    *aloja un elemento dinamico a la propiedad HTML
    * @param {[HTMLElement]} elementos
    */
    alojarElementoDinamico(elementos) {
        elementos.forEach((elemento) => {
            this.HTMLElements[elemento.id] = elemento;
        });
    }

    animar(tiempoActual) {
        if (!this.enEjecucion) return;

        // Calcular delta time en segundos
        const deltaTime = (tiempoActual - this.ultimoTiempo) / 1000;
        this.ultimoTiempo = tiempoActual;

        // Calcular desplazamiento basado en tiempo
        const desplazamiento = this.velocidad * deltaTime;
        this.xBase -= desplazamiento; // Mover la posición base

        // Aplicar a todos los elementos con sus posiciones relativas
        let xAcumulado = 0;
        const espaciado = 10;

        for (const key in this.HTMLElements) {
            let elemento = this.HTMLElements[key];

            if (elemento.visible) {
                elemento.style.left = `${this.xBase + xAcumulado}px`;
                xAcumulado += elemento.width + espaciado;
            }
        }

        // Continuar la animación
        this.animacionId = requestAnimationFrame(t => this.animar(t));
    }
}

export default News;