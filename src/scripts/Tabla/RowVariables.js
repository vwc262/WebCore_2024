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
    }

    create() {
        /**
        * @type {[Cell]}
        */
        this.signalsContainer = [];

        this.rowContainer = document.createElement('div');
        this.rowContainer.classList = `sitio-tabla`;

        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);

        estacion.Signals.forEach(signal => {
            if (this.columns[signal.TipoSignal]) {
                this.columns[signal.TipoSignal].push(signal);
            }
        });

        let moreThanOne = false;

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

            if (this.columns[key].length > 1) {
                moreThanOne = true;
            }
        });

        if (moreThanOne) {
            this.expandRow = CreateElement({
                nodeElement: 'div',
                attributes: { class: 'expand-btn-Row', maximized: 0 },
                innerText: '',
                events: new Map().set('click', [(event) => {

                    let maximized = event.currentTarget.getAttribute('maximized');
                    if (maximized == null || maximized == undefined) maximized = false;
                    else if (maximized == '0') maximized = false;
                    else maximized = true;

                    event.currentTarget.setAttribute('maximized', `${maximized ? '0' : '1'}`);
                    event.currentTarget.style.background = `url(http://w1.doomdns.com:11002/RecursosWeb/WebCore24/TanquesPadierna/General/${maximized ? 'mas_nrm' : 'menos_nrm'}.png?v=10)`;
                }]).set('mouseover', [(event) => {

                    let maximized = event.currentTarget.getAttribute('maximized');
                    if (maximized == null || maximized == undefined) maximized = false;
                    else if (maximized == '0') maximized = false;
                    else maximized = true;

                    event.currentTarget.style.background = `url(http://w1.doomdns.com:11002/RecursosWeb/WebCore24/TanquesPadierna/General/${maximized ? 'menos_ovr' : 'mas_ovr'}.png?v=10)`;
                }]).set('mouseout', [(event) => {

                    let maximized = event.currentTarget.getAttribute('maximized');
                    if (maximized == null || maximized == undefined) maximized = false;
                    else if (maximized == '0') maximized = false;
                    else maximized = true;

                    event.currentTarget.style.background = `url(http://w1.doomdns.com:11002/RecursosWeb/WebCore24/TanquesPadierna/General/${maximized ? 'menos_nrm' : 'mas_nrm'}.png?v=10)`;
                }])
            });

            this.rowContainer.append(this.expandRow);
        }

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