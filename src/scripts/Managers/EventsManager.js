import { EnumAppEvents } from "../Utilities/Enums.js";
class EventsManager {
    static #_instance = undefined
    /**
     * @returns {EventsManager}
     */
    static get Instance() {
        if (!this.#_instance) {
            this.#_instance = new EventsManager();
        }
        return this.#_instance
    }
    /**
     * @type {EventoCustomizado}
     */
    #Eventos = new Map();
    /**
     * 
     * @param {string} nombreEvento 
     * @param {EventoCustomizado} fnHanlder 
     */
    Suscribirevento(nombreEvento, fnHanlder) {
        if (!this.#Eventos.has(nombreEvento)) {
            this.#Eventos.set(nombreEvento, [fnHanlder]);
        }
        else {
            let eventos = this.#Eventos.get(nombreEvento);
            if (eventos) {
                this.#Eventos.set(nombreEvento, [...eventos, fnHanlder]);
            }
        }
    }
    /**
     * 
     * @param {string} nombreEvento 
     * @param {string} idEvento 
     */
    RemoverEvento(nombreEvento, idEvento) {
        const listaEventosCustomizados = this.#Eventos.get(nombreEvento);
        const eventosCUstomizadosRestantes = listaEventosCustomizados?.filter(evCustomizado => evCustomizado.idEvento != idEvento);
        if (eventosCUstomizadosRestantes)
            this.#Eventos.set(nombreEvento, eventosCUstomizadosRestantes);
    }
    /**
     * 
     * @param {keyof EnumAppEvents } nombreEvento 
     * @param {{}} data 
     */
    EmitirEvento(nombreEvento, data = {}) {
        const eventos = this.#Eventos.get(nombreEvento);
        if (eventos) {
            eventos.forEach(evento => {
                evento.FnHandler(data);
            });
        }
    }
}
/**
 * @returns {EventoCustomizado}
 */
class EventoCustomizado {
    /**
     * 
     * @param {Function} fnHandler 
     */
    constructor(fnHandler) {
        this.FnHandler = fnHandler;
        this.IdEvento = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

export { EventsManager, EventoCustomizado };