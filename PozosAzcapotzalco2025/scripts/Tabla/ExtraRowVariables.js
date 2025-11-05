import Estacion from "../Entities/Estacion.js";
import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { CreateElement } from '../Utilities/CustomFunctions.js'
import Signal from "../Entities/Signal.js";
import { Cell } from "./Cell.js";

class ExtraRowVariables {
    /**
     * 
     * @param {int} IdEstacion 
     * @param {Map<string, [Signal]>} columns 
     * @param {int} ordinalSignal 
     */
    constructor(IdEstacion, columns, ordinalSignal) {
        this.IdEstacion = IdEstacion;
        this.columns = columns;
        this.ordinalSignal = ordinalSignal;
    }

    create() {
        /**
        * @type {[Cell]}
        */
        this.signalsContainer = [];

        this.rowContainer = document.createElement('div');
        this.rowContainer.classList = `sitio-tabla`;

        /**
         * @type {Estacion} estacion
         */
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);

        estacion.Signals.forEach(signal => {
            if (this.columns[signal.TipoSignal]) {
                this.columns[signal.TipoSignal].push(signal);
            }
        });

        Object.keys(this.columns).forEach(key => {
            if (this.columns[key][this.ordinalSignal] != undefined) {
                this.signalsContainer.push(new Cell(this.columns[key][this.ordinalSignal], true));
                this.rowContainer.appendChild(this.signalsContainer[this.signalsContainer.length - 1].create());
            } else {
                this.rowContainer.appendChild(CreateElement({
                    nodeElement: 'div',
                    attributes: { class: 'signal-Column-Container-NA' },
                    innerText: 'N/A',
                    events: new Map()
                }));
            }
        });

        return this.rowContainer;
    }

}

export { ExtraRowVariables };