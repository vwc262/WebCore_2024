import Estacion from "../Entities/Estacion.js";

class Row {
    /**
     * 
     * @param {Estacion} estacion 
     */
    constructor(estacion ) {
        this.estacion = estacion;
        this.create();
    }

    create() {
        let row = document.createElement('div');
        row.innerText = `row ${this.estacion.Nombre}`;
        row.classList = `sitio-tabla`;

        return row;
    }

    destroy() {
        // console.log(`${this.name} is destroyed.`);
        // delete this.name;
        // delete this.age;
    }
}

export { Row };


// Abreviacion
// : 
// "tc1"
// Enlace
// : 
// 0
// IdEstacion
// : 
// 1
// Latitud
// : 
// 19.377071
// Lineas
// : 
// [Linea]
// Longitud
// : 
// -99.16459
// Nombre
// : 
// "TC-1"
// Signals
// : 
// (8) [Signal, Signal, Signal, Signal, Signal, Signal, Signal, Signal]
// Tiempo
// : 
// "2024-03-25T13:07:03"
// TipoEstacion
// : 
// undefined