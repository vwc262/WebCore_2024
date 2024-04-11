import Estacion from "../Entities/Estacion.js";
import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { Particular } from "../Particular/Particular.js";
import { CreateElement } from "../Utilities/CustomFunctions.js";

class Row {
  /**
   *
   * @param {Estacion} estacion
   */
  constructor(IdEstacion) {
    this.IdEstacion = IdEstacion;
  }

  create() {
    this.rowContainer = document.createElement("div");
    this.rowContainer.classList = `sitio-tabla`;

    let bottomGlowColumn = CreateElement({ nodeElement: 'div', attributes: { class: 'bottomGlowColumn' } });

    this.enlace = document.createElement("img");
    this.enlace.classList = `enlace-tabla`;

    let nombreFechaContainer = document.createElement("div");
    nombreFechaContainer.classList = `nombre-Fecha-Container`;

    this.nombre = document.createElement("div");
    this.nombre.classList = `nombre-tabla`;

    this.fecha = document.createElement("div");
    this.fecha.classList = `fecha-tabla`;

    this.rowContainer.append(this.enlace, nombreFechaContainer, bottomGlowColumn);
    nombreFechaContainer.append(this.nombre, this.fecha);

    this.Update();

    this.rowContainer.addEventListener("click", (event) => {
      const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);
      Particular.Instance.setEstacion(estacion);
      Particular.Instance.mostrarDetalles();
    });

    return this.rowContainer;
  }

  Update() {
    const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);

    this.nombre.innerText = `${estacion.Nombre}`;
    this.enlace.setAttribute(
      "src",
      `${Core.Instance.ResourcesPath}General/state_${estacion.Enlace}.png?v=0`
    );
    this.fecha.innerText = `${estacion.ObtenerFecha()}`;
  }

  // suscribirEventos() {
  //     EventsManager.Instance.Suscribirevento('Update', new EventoCustomizado(() => this.updateEstacion()));
  // }
}

export { Row };
