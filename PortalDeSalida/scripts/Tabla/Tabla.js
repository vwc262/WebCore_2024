import { Configuracion } from "../../config/config.js";
import { Core } from "../Core.js";
import { RowEstacion } from "./RowEstacion.js";

/**
 * @returns {Tabla}
 */
class Tabla {


  constructor() {
    /**
     * @type {HTMLElement}
     */
    this.rows = [];
    this.estacionBuscar;
    this.tBody = document.querySelector(".table-container");

    this.Configuracion = Configuracion.GetConfiguracion(
      Core.Instance.IdProyecto
    );
  }

  create() {
    this.estaciones = Core.Instance.data;


      this.estaciones.forEach(estacion => {
        let rowEstacion = new RowEstacion(this.tBody, estacion);
        rowEstacion.Init();

        this.rows.push(rowEstacion);
      });
  }
}

export { Tabla };
