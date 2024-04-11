import Estacion from "../Entities/Estacion.js";
import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { CreateElement } from '../Utilities/CustomFunctions.js'
import Signal from "../Entities/Signal.js";
import { Cell } from "./Cell.js";

class RowVariables {
    /**
     * 
     * @param {Estacion} estacion 
     * @param {Map<string, [Signal]>} columns
     */
    constructor(IdEstacion, columns) {
        this.IdEstacion = IdEstacion;
        this.columns = columns;

        this.create();
    }

    create() {

        this.rowContainer = document.createElement('div');
        this.rowContainer.classList = `sitio-tabla`;

        /**
     * @type {[Cell]}
     */
        this.signalsContainer = [];

        this.expandRow = CreateElement({
            nodeElement: 'div',
            attributes: { class: 'expand-btn-Row' },
            innerText: '',
            events: new Map()
        });

        this.rowContainer.append(this.expandRow);

        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);

        estacion.Signals.forEach(signal => {
            if (this.columns[signal.TipoSignal]) {
                this.columns[signal.TipoSignal].push(signal);
            }
        });

        Object.keys(this.columns).forEach(key => {

            if (this.columns[key].length > 0) {
                this.signalsContainer.push(new Cell(this.columns[key][0], this.columns[key].length > 1));
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

        this.Update();

        return this.rowContainer;
    }

    Update() {
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);

    }

    // suscribirEventos() {
    //     EventsManager.Instance.Suscribirevento('Update', new EventoCustomizado(() => this.updateEstacion()));
    // }

}

export { RowVariables };