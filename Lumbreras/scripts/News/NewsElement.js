import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import Signal from "../Entities/Signal.js";
import { EnumSemaforo } from "../Utilities/Enums.js";


/**
 * @returns {NewsElement}
 */
class NewsElement {

    /**
     * 
     * @param {String} interceptor
     * @param {Estacion} estacion
     * @param {Signal} nivel 
     */
    constructor(interceptor, estacion, nivel) {
        this.interceptor = interceptor;
        this.estacion = estacion;
        this.nivel = nivel;
        this.container = document.getElementsByClassName('news')[0];
        this.root = null;
        this.id = `news_element_${nivel.IdSignal}`;
    }

    HTMLUpdateElements = [];

    createElement() {
        let container = document.createElement('div');
        container.classList = 'news_element';
        container.innerHTML = `${this.interceptor} - (${this.estacion.IdEstacion}) ${this.estacion.Nombre}: ${this.nivel.Nombre}`;
        container.id = this.id;

        this.root = container;
        this.container.append(container);
        this.update();

        return this.root;
    }

    update() {
        const updatedEstacion = Core.Instance.GetDatosEstacion(this.estacion.IdEstacion);
        const updatedNivel = updatedEstacion.Signals.find(s => s.IdSignal == this.nivel.IdSignal);

        if (updatedNivel) {
            const color = updatedNivel.GetEnumSemaforo();
            const enumerador = updatedNivel.GetEnumSemaforo();

            if (enumerador == EnumSemaforo.Critico || enumerador == EnumSemaforo.Critico) {
                this.root.visible = true;
                this.root.style.display = 'flex';
                this.root.style.background = color;
            }
            else {
                this.root.visible = false;
                this.root.style.display = 'none';
            }
        }
    }

    suscribirEventos() {
        EventsManager.Instance.Suscribirevento(
            "Update",
            new EventoCustomizado(this.update)
        );
    }
}

export default NewsElement;