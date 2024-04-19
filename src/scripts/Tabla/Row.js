import Estacion from "../Entities/Estacion.js";
import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { Particular } from "../Particular/Particular.js";
import { CreateElement } from "../Utilities/CustomFunctions.js";
import { Tabla } from "./Tabla.js";

class Row {
  /**
   *
   * @param {Estacion} estacion
   * @param {Function} hoverRow callback
   */
  constructor(IdEstacion, hoverRow) {
    this.IdEstacion = IdEstacion;
    this.hoverRow = hoverRow;
  }

  create() {
    const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);

    this.rowContainer = CreateElement({
      nodeElement: 'div',
      attributes: { class: `sitio-tabla`, style: 'cursor:pointer' },
      innerText: '',
      events: new Map()
        .set('mouseover', [(event) => {
          this.hoverRow(true, this.IdEstacion);
        }])
        .set('mouseout', [(event) => {
          this.hoverRow(false, this.IdEstacion);
        }])
    });

    let bottomGlowColumn = CreateElement({ nodeElement: 'div', attributes: { class: 'bottomGlowColumn' } });
    this.enlace = CreateElement({ nodeElement: 'img', attributes: { class: `enlace-tabla` } });
    let nombreFechaContainer = CreateElement({ nodeElement: 'div', attributes: { class: `nombre-Fecha-Container` } });;
    this.nombre = CreateElement({ nodeElement: 'div', attributes: { class: `nombre-tabla` }, innerText: `${estacion.Nombre}` });
    this.fecha = CreateElement({ nodeElement: 'div', attributes: { class: `fecha-tabla` } });

    this.rowContainer.append(this.enlace, nombreFechaContainer, bottomGlowColumn);
    nombreFechaContainer.append(this.nombre, this.fecha);

    this.Update();

    this.rowContainer.addEventListener("click", (event) => {
      const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);
      Particular.Instance.setEstacion(estacion);
      Particular.Instance.mostrarDetalles();
    });

    this.suscribirEventos();

    return this.rowContainer;
  }

  Update() {
    const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);

    this.enlace.setAttribute(
      "src",
      `${Core.Instance.ResourcesPath}General/state_${estacion.IsTimeout() ? 't' : estacion.Enlace}.png?v=${Core.Instance.version}`
    );
    this.fecha.innerText = `${estacion.ObtenerFecha()}`;
  }

  suscribirEventos() {
    EventsManager.Instance.Suscribirevento('Update', new EventoCustomizado(() => this.Update()));
  }
}

export { Row };
