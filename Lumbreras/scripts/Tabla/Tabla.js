import { Configuracion } from "../../config/config.js";
import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { Interceptor } from "./Interceptor.js";

/**
 * @returns {Tabla}
 */
class Tabla {

  rows = [];

  constructor() {
    /**
     * @type {HTMLElement}
     */
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
      let interceptor = new Interceptor(this.tBody, config);

      interceptor.root.addEventListener('click', this.onclick);
      interceptor.root.addEventListener('onmouseover', this.onmouseover);
    });

    this.suscribirEventos();
    this.update();
  }


  onmouseover() {

  }

  onclick() {

  }


  update() {

  }

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
