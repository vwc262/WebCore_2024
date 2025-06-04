import { Configuracion } from "../../config/config.js";
import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
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
    this.interceptores = this.Configuracion.interceptores;
    let interceptores_keys = Object.keys(this.interceptores);

    interceptores_keys.forEach((key, index) => {
      let config = this.interceptores[key];

      config.ids.forEach(idEstacion => {
        const nombre_interceptor = config.nombre;
        let estacion = Core.Instance.GetDatosEstacion(idEstacion);

        let rowEstacion = new RowEstacion(this.tBody, estacion, nombre_interceptor);
        rowEstacion.Init();

        this.rows.push(rowEstacion);
      });
    });

    this.suscribirEventos();
    this.update();
  }


  onmouseover() { }

  onclick() { }

  update() { }

  suscribirEventos() {
    EventsManager.Instance.Suscribirevento(
      "Update",
      new EventoCustomizado(() => this.update())
    );
    EventsManager.Instance.Suscribirevento(
      "OnMouseHoverPerfil",
      new EventoCustomizado((data) =>
        this.hoverRow(data.mouseover, data.IdEstacion, data.stopPropagation)
      )
    );
  }
}

export { Tabla };
