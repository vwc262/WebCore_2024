import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import { Row } from "./Row.js";

/**
 * @returns {Tabla}
 */
class Tabla {
    /**
     * @type {[Row]}
     */
    rows = [];

    constructor() {

        /**
         * @type {HTMLElement}
         */
        this.tBody = document.querySelector('.curved-tBody');

        this.cantidadElementos = Core.Instance.data.length;
        this.indice = 0;
        this.elementosVisibles = 15;

        this.curvedRows = document.getElementsByClassName('curved-Row');

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

        this.rows.forEach((row) => {
            row.updatePosition(this.indice);
        });
    }

    create() {
        Core.Instance.data.forEach((estacion, index) => {
            this.rows.push(new Row(estacion.IdEstacion, index));
            const row = this.rows[this.rows.length - 1];
            if (index < this.curvedRows.length) {
                this.curvedRows[index].innerHTML = '';
                this.curvedRows[index].appendChild(row.create());
            }
        });
    }

    update() {

    }
}

export { Tabla };