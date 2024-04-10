import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import { Row } from "./Row.js";
import { RowVariables } from "./RowVariables.js";

/**
 * @returns {Tabla}
 */
class Tabla {
    /**
     * @type {[Row]}
     */
    rows = [];
    rowVariables = [];

    constructor() {

        /**
         * @type {HTMLElement}
         */
        this.tBody = document.querySelector('.curved-tBody');
        this.tBodyVariablesContainer = document.querySelector('.curved-table-variables-container');

        this.cantidadElementos = Core.Instance.data.length;
        this.indice = 0;
        this.elementosVisibles = 15;

        this.curvedRows = document.getElementsByClassName('curved-Row');
        this.curvedRowsVariables = document.getElementsByClassName('curved-Row-variables');

        // Mouse wheel event
        this.tBody.addEventListener('wheel', (event) => {
            let upwards = event.wheelDelta > 0 || event.detail < 0;
            this.setScrollDirection(upwards);
        });

        // Mouse wheel event (older browsers)
        this.tBody.addEventListener('mousewheel', (event) => {
            let upwards = event.wheelDelta > 0 || event.detail < 0;
            this.setScrollDirection(upwards);
        });

        // Touch move event
        this.tBody.addEventListener('touchmove', (event) => {
            console.log('Touch move event');
            // Your code here
        });

        this.btnTabla = document.querySelector('.btnTabla');
        this.btnTabla.addEventListener('click', () => {

            let visible = this.tBodyVariablesContainer.getAttribute('visible');
            if (visible == null || visible == undefined) visible = false;
            else if (visible == '0') visible = false;
            else visible = true;

            this.tBodyVariablesContainer.setAttribute('visible', `${visible ? '0' : '1'}`);
            this.tBodyVariablesContainer.style = `right:${visible ? '-455' : '475'}px;`;
        });


        this.create();

    }

    /**
     * 
     * @param {boolean} upwards direccion (hacia arriba)
     */
    setScrollDirection(upwards) {
        this.indice += upwards ? 1 : -1

        if (this.indice < -(this.cantidadElementos - this.elementosVisibles)) {
            this.indice = -(this.cantidadElementos - this.elementosVisibles);
        }
        if (this.indice > 0) {
            this.indice = 0;
        }

        // console.log(this.indice);

        let indexCurvedRows = 0;
        for (let indexEstacion = -this.indice; indexEstacion < Core.Instance.data.length; indexEstacion++) {
            const estacion = Core.Instance.data[indexEstacion];
            let row = this.rows[indexEstacion];
            let rowVariables = this.rowVariables[indexEstacion];

            row.IdEstacion = estacion.IdEstacion;
            rowVariables.IdEstacion = estacion.IdEstacion;

            if (this.curvedRows[indexCurvedRows] != undefined) {
                this.curvedRows[indexCurvedRows].innerHTML = '';
                this.curvedRows[indexCurvedRows].appendChild(row.rowContainer);

                this.curvedRowsVariables[indexCurvedRows].innerHTML = '';
                this.curvedRowsVariables[indexCurvedRows].appendChild(rowVariables.rowContainer);
            }

            row.Update();
            rowVariables.Update();

            indexCurvedRows++;
        }
    }

    create() {
        let indexCurvedRows = 0;
        for (let indexEstacion = -this.indice; indexEstacion < Core.Instance.data.length; indexEstacion++) {
            const estacion = Core.Instance.data[indexEstacion];

            this.rows.push(new Row(estacion.IdEstacion, indexEstacion));
            this.rowVariables.push(new RowVariables(estacion.IdEstacion, indexEstacion));
            const row = this.rows[this.rows.length - 1];
            const rowVariables = this.rowVariables[this.rows.length - 1];

            if (this.curvedRows[indexCurvedRows] != undefined) {
                this.curvedRows[indexCurvedRows].innerHTML = '';
                this.curvedRows[indexCurvedRows].appendChild(row.create());

                this.curvedRowsVariables[indexCurvedRows].innerHTML = '';
                this.curvedRowsVariables[indexCurvedRows].appendChild(rowVariables.create());
            }

            indexCurvedRows++;
        }
    }
}

export { Tabla };