import { Configuracion } from "../../config/config.js";
import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { Interceptor } from "./Interceptor.js";
import { RowEstacionBuscador } from "./RowEstacionBuscador.js";

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
    this.tbBody = document.querySelector(".table-buscador-container");

    this.Configuracion = Configuracion.GetConfiguracion(
      Core.Instance.IdProyecto
    );
  }

  create() {

    this.buscadorImg = document.querySelector(".buscadorTabla");
    this.interceptores = this.Configuracion.interceptores;
    let interceptores_keys = Object.keys(this.interceptores);
    let input = document.getElementById('query');

    this.buscadorImg.style.background = `url(${Core.Instance.ResourcesPath}Tabla/buscadorTabla.png?v=${Core.Instance.version}) `;
    this.buscadorImg.style.backgroundSize = `contain`;
    this.buscadorImg.style.backgroundRepeat = `no-repeat`;

    interceptores_keys.forEach((key, index) => {
      let config = this.interceptores[key];
      let interceptor = new Interceptor(this.tBody, config);
      interceptor.Init();

      interceptor.root.addEventListener('click', this.onclick);
      interceptor.root.addEventListener('onmouseover', this.onmouseover);

      config.ids.forEach(idEstacion => {
        let estacion = Core.Instance.GetDatosEstacion(idEstacion);
        let RowEstacion_Buscador = new RowEstacionBuscador(this.tbBody, estacion, this.nombre_interceptor);
        this.rows.push(RowEstacion_Buscador);
        RowEstacion_Buscador.Init();
      });
    });

    input.addEventListener('input', this.search.bind(this));

    this.suscribirEventos();
    this.update();
  }


  onmouseover() { }

  onclick() { }

  search(event) {
    const texto = event.target.value.toLowerCase();
    let table = document.getElementById("tableContainer");
    let tableBuscador = document.getElementById("tableContainerBuscador");

    table.style.display = `${texto == "" ? 'flex' : 'none'}`;
    tableBuscador.style.display = `${texto != "" ? 'flex' : 'none'}`;

    this.rows.forEach(row => {
      const textoEstacion = row.estacion.Nombre;
      const coincide = textoEstacion.toLowerCase().includes(texto);
      row.root.style.display = coincide ? "flex" : "none";
    });
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
