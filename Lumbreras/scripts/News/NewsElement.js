import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import Signal from "../Entities/Signal.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
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
        container.id = this.id;

        let interceptor = document.createElement('div');
        interceptor.classList = 'news_element_interceptor';
        interceptor.innerHTML = `${this.interceptor} (${this.estacion.IdEstacion})`;

        let estacion = document.createElement('div');
        estacion.classList = 'news_element_estacion';
        estacion.innerHTML = `${this.estacion.Nombre.slice(0, 25)}`;

        let nivel = document.createElement('div');
        nivel.classList = 'news_element_nivel';
        nivel.innerHTML = `Nivel: ${this.nivel.Nombre}`;

        this.root = container;
        this.root.visible = true;

        container.append(interceptor, estacion, nivel);
        this.container.append(container);

        this.Update();
        this.suscribirEventos();

        return this.root;
    }

    Update = () => {
        const updatedEstacion = Core.Instance.GetDatosEstacion(this.estacion.IdEstacion);
        const updatedNivel = updatedEstacion.Signals.find(s => s.IdSignal == this.nivel.IdSignal);

        if (updatedNivel) {
            const enumerador = updatedNivel.GetEnumSemaforo();

            if (enumerador == EnumSemaforo.Critico || enumerador == EnumSemaforo.Preventivo) {
                this.root.visible = true;
                this.root.style.display = 'flex';
                this.root.style.background = enumerador == EnumSemaforo.Critico ?
                    `linear-gradient(90deg, rgba(255, 0, 0, 0) 0%, rgba(255, 0, 0, 1) 15%, rgba(255, 0, 0, 1) 85%, rgba(255, 0, 0, 0) 100%` :
                    `linear-gradient(90deg, rgba(255, 0, 0, 0) 0%, rgba(255, 251, 0, 1) 15%, rgba(255, 251, 0, 1) 85%, rgba(255, 0, 0, 0) 100%`;
                this.root.style.color = enumerador == EnumSemaforo.Critico ? 'beige' : 'blue';
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
            new EventoCustomizado(this.Update)
        );
    }
}

export default NewsElement;