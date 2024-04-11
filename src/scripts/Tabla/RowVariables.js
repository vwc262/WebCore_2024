import Estacion from "../Entities/Estacion.js";
import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { CreateElement } from '../Utilities/CustomFunctions.js'
import Signal from "../Entities/Signal.js";
import { Cell } from "./Cell.js";

class RowVariables {
    /**
     * 
     * @param {int} IdEstacion 
     * @param {Map<string, [Signal]>} columns 
     * @param {int} ordinalSignal 
     * @param {Object} offset object with offset.value
     * @param {Function} refreshTable callback
     * @param {int} actualIndex 
     */
    constructor(IdEstacion, columns, ordinalSignal, offset, refreshTable, actualIndex) {
        this.IdEstacion = IdEstacion;
        this.columns = columns;
        this.ordinalSignal = ordinalSignal;
        this.offset = offset;
        this.refreshTable = refreshTable;
        this.actualIndex = actualIndex;
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

        let extraRows = 0;

        Object.keys(this.columns).forEach(key => {

            if (this.columns[key].length > 0 && this.columns[key][this.ordinalSignal] != undefined) {
                this.signalsContainer.push(new Cell(this.columns[key][this.ordinalSignal], this.columns[key].length > 1));
                this.rowContainer.appendChild(this.signalsContainer[this.signalsContainer.length - 1].create());
            } else {
                this.rowContainer.appendChild(CreateElement({
                    nodeElement: 'div',
                    attributes: { class: 'signal-Column-Container-NA' },
                    innerText: 'N/A',
                    events: new Map()
                }));
            }

            if (this.columns[key].length > extraRows) {
                extraRows = this.columns[key].length;
            }
        });

        if (extraRows > 1) {

            this.expandRow = CreateElement({
                nodeElement: 'div',
                attributes: { class: 'expand-btn-Row', maximized: 0, extraRows: extraRows - 1, rowIndex: this.actualIndex },
                innerText: '',
                events: new Map().set('click', [(event) => {

                    let rowIndex = parseInt(event.currentTarget.getAttribute('rowIndex'));

                    let btns = document.getElementsByClassName('expand-btn-Row');
                    for (let btn of btns) {
                        let _rowIndex = parseInt(btn.getAttribute('rowIndex'));
                        if (rowIndex != _rowIndex) {
                            btn.style.background = `url(http://w1.doomdns.com:11002/RecursosWeb/WebCore24/TanquesPadierna/General/mas_nrm.png?v=10)`;
                            btn.setAttribute('maximized', '0');
                        }
                    }

                    let maximized = event.currentTarget.getAttribute('maximized');
                    if (maximized == null || maximized == undefined) maximized = false;
                    else if (maximized == '0') maximized = false;
                    else maximized = true;

                    event.currentTarget.setAttribute('maximized', `${maximized ? '0' : '1'}`);
                    event.currentTarget.style.background = `url(http://w1.doomdns.com:11002/RecursosWeb/WebCore24/TanquesPadierna/General/${maximized ? 'mas_nrm' : 'menos_nrm'}.png?v=10)`;

                    let extraRows = maximized ? 0 : parseInt(event.currentTarget.getAttribute('extraRows'));
                    this.offset.extraRows = extraRows;
                    this.offset.actualIndex = maximized ? 0 : this.actualIndex;

                    this.refreshTable();

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

        this.Update(this.actualIndex);

        return this.rowContainer;
    }

    /**
     * 
     * @param {int} actualIndex 
     */
    Update(actualIndex) {
        this.actualIndex = actualIndex;
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);

    }

    // suscribirEventos() {
    //     EventsManager.Instance.Suscribirevento('Update', new EventoCustomizado(() => this.updateEstacion()));
    // }

}

export { RowVariables };