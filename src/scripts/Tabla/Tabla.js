import { Core } from "../Core.js";
import { Row } from "./Row.js";

/**
 * @returns {Tabla}
 */
class Tabla {
    rows = [];

    constructor() {
     
        this.tBody = document.querySelector('.curved-tBody');
        this.create();
    }

    create() {
        Core.Instance.data.forEach((estacion, index) => {
            this.rows.push(new Row(estacion));
            const row = this.rows[this.rows.length - 1];
            this.tBody.appendChild(row.create());
        });
    }

    update(){

    }
}

export { Tabla };