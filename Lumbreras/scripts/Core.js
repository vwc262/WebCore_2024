import { Configuracion } from "../config/config.js";
import { VwcApp } from "./App.js";
import Estacion from "./Entities/Estacion.js";
import { Fetcher } from "./Fetcher/Fetcher.js";
import { EventsManager } from "./Managers/EventsManager.js";
import {
  EnumAppEvents,
  EnumControllerMapeo,
  EnumNombreProyecto,
  EnumProyecto,
  EnumTipoSignal,
  RequestType,
} from "./Utilities/Enums.js";

/**
 * Clase Base de la App Web
 */
class Core {
  version = 0;
  /**
   * Retorna la ruta de resources
   * @returns {string }
   */
  get ResourcesPath() {
    return `https://virtualwavecontrol.com.mx/RecursosWeb/WebCore24/${EnumNombreProyecto[this.IdProyecto]
      }/`;
  }
  IdInterval = undefined;
  /**
   * @type {keyof EnumProyecto}
   */
  IdProyecto = EnumProyecto.Default;
  /**
   * @type {[Estacion]}
   */
  data = undefined;
  static #_instance = undefined;
  /**
   * @returns {Core}
   */
  static get Instance() {
    if (!this.#_instance) {
      this.#_instance = new Core();
    }
    return this.#_instance;
  }
  /**
   *
   * @param {EnumProyecto} idProyecto
   */
  async Init(idProyecto) {
    console.log("Iniciando App");
    this.IdProyecto = idProyecto;
    this.version = await Fetcher.Instance.RequestVersion(`OBTENERVERSION?idProyecto=${this.IdProyecto}`);

    this.Configuracion = Configuracion.GetConfiguracion(
      Core.Instance.IdProyecto
    );

    await this.Update();
    this.IdInterval = setInterval(() => this.Update(), 10 * 1000);
  }
  async Update() {
    const data = await Fetcher.Instance.RequestData(
      `${EnumControllerMapeo.READ}?idProyecto=${this.IdProyecto}`,
      RequestType.GET,
      undefined,
      false
    );
    this.version = await Fetcher.Instance.RequestVersion(`OBTENERVERSION?idProyecto=${this.IdProyecto}`);
    this.data = this.GetData(data);

    // this.randomValues();
    //console.log(this.data);
    EventsManager.Instance.EmitirEvento(EnumAppEvents.Update); // Manda mensaje de update a todos los elementos que necesiten actualizar
  }

  randomValues() {
    this.data.forEach((estacion) => {
      let time = new Date();
      let ss = time.getSeconds();

      estacion.Enlace = 1;//  ss > 45 ? 3 : ss > 30 ? 2 : ss > 15 ? 1 : 0;
      estacion.Tiempo = time.toISOString();

      estacion.Signals.forEach((signal) => {
        signal.DentroLimite = ss > 40 ? 2 : ss > 20 ? 1 : 0;
        signal.DentroRango = ss > 50 ? 0 : ss > 10 ? 1 : -1;
        signal.IndiceImagen = parseInt((ss / 60.0) * 10);

        if (signal.TipoSignal == EnumTipoSignal.Nivel) {
          signal.Valor = ss * 10.0 / 60.0;
        }
        else if (signal.TipoSignal == EnumTipoSignal.Presion) {
          signal.Valor = ss * 100.0 / 60.0;
        }
        else if (signal.TipoSignal == EnumTipoSignal.Gasto) {
          signal.Valor = ss * 1000.0 / 60.0;
        }
        else if (signal.TipoSignal == EnumTipoSignal.Totalizado) {
          signal.Valor = ss * 10000 / 60;
        }
        else if (signal.TipoSignal == EnumTipoSignal.ValvulaAnalogica) {
          signal.Valor = ss * 100.0 / 60.0;
        }
        else if (signal.TipoSignal == EnumTipoSignal.ValvulaDiscreta) {
          signal.Valor = ss > 40 ? 2 : ss > 20 ? 1 : 0;
        }
        else if (signal.TipoSignal == EnumTipoSignal.Bomba) {
          signal.Valor = ss > 45 ? 3 : ss > 30 ? 2 : ss > 15 ? 1 : 0;
        }
        else if (signal.TipoSignal == EnumTipoSignal.PerillaBomba || signal.TipoSignal == EnumTipoSignal.PerillaGeneral) {
          signal.Valor = ss > 40 ? 2 : ss > 20 ? 1 : 0;
        }
        else if (signal.TipoSignal == EnumTipoSignal.Voltaje) {
          signal.Valor = ss * 15.0 / 60.0;
        }
        else if (signal.TipoSignal == EnumTipoSignal.FallaAC || signal.TipoSignal == EnumTipoSignal.PuertaAbierta) {
          signal.Valor = ss > 45 ? false : true;
        }
        else if (signal.TipoSignal == EnumTipoSignal.Mantenimiento) {
          signal.Valor = ss > 45 ? 1 : 0;
        }
        else {
          signal.Valor = ss;
        }
      });
    });
  }
  /**
   *
   * @param {*} jsonObject
   * @returns {[Estacion]}
   */
  GetData(jsonObject) {
    return jsonObject.map((element) => new Estacion(element));
  }
  /**
   * Obtiene los datos de la estacion especifica
   * @param {number} idEstacion
   * @returns {Estacion | undefined}
   */
  GetDatosEstacion(idEstacion) {
    return this.data.find((estacion) => estacion.IdEstacion == idEstacion);
  }

}
export { Core };

window.onload = () => new VwcApp().Start();