import Estacion from "../Entities/Estacion.js";
import { Core } from "../Core.js";

class Row {
    /**
     * 
     * @param {Estacion} estacion 
     */
    constructor(IdEstacion) {
        this.IdEstacion = IdEstacion;
        this.create();
    }

    create() {
        let rowContainer = document.createElement('div');
        rowContainer.classList = `sitio-tabla`;

        this.enlace = document.createElement('img');
        this.enlace.classList = `enlace-tabla`;

        let nombreFechaContainer = document.createElement('div');
        nombreFechaContainer.classList = `nombre-Fecha-Container`;

        this.nombre = document.createElement('div');
        this.nombre.classList = `nombre-tabla`;
        
        this.fecha = document.createElement('div');
        this.fecha.classList = `fecha-tabla`;

        rowContainer.append(this.enlace, nombreFechaContainer);
        nombreFechaContainer.append(this.nombre, this.fecha);

        this.updateEstacion();

        rowContainer.addEventListener('click', (event) => {
            // particular
        });

        return rowContainer;
    }

    updateEstacion() {
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);


        this.nombre.innerText = `${estacion.Nombre}`;
        this.enlace.setAttribute('src', 'http://w1.doomdns.com:11002/RecursosWeb/Client/TanquesMagdalenaContreras/General/state_0.png?v=10');
        this.fecha.innerText = `${estacion.Tiempo}`;
    }

}

export { Row };