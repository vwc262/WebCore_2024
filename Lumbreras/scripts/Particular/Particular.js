import { Configuracion } from "../../config/config.js";
import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import Signal from "../Entities/Signal.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { CreateElement } from "../Utilities/CustomFunctions.js";
import {
  EnumModule,
  EnumTipoSignal,
  EnumEnlace,
  EnumProyecto,
} from "../Utilities/Enums.js";
import { GoHome, Module, SetActualModule } from "../uiManager.js";

class Particular {
  //#region  Singleton
  static #_instance = null;
  /**
   *@return {Particular}
   */
  static get Instance() {
    if (!this.#_instance) {
      this.#_instance = new Particular();
    }
    return this.#_instance;
  }
  //#endregion

  //#region Constructor
  constructor() {
    EventsManager.Instance.Suscribirevento(
      "Update",
      new EventoCustomizado(this.Update)
    );
  }
  //#endregion

  //#region Propiedades
  /**
   * @type {Estacion}
   */
  Estacion = undefined;
  /**
   * @type {HTMLElement}
   */
  HTMLUpdateElements = {};

  //#endregion

  //#region Metodos
  setEstacion(estacion) {
    if (this.Estacion && this.Estacion.IdEstacion != estacion.IdEstacion) {
      // Hay Cambio de particular
      EventsManager.Instance.EmitirEvento("ParticularChanged");

      this.estacion = estacion;
    }
    this.Estacion = Core.Instance.GetDatosEstacion(estacion.IdEstacion);
    this.MostrarFallaAc(this.Estacion.IsFallaAc());
  }

  MostrarFallaAc(mostrar) {
    let urlFallaAc = `${Core.Instance.ResourcesPath}/Iconos/backupenergy.png?v=${Core.Instance.version}`
    let imgFallaAc = document.querySelector('.fallaAcParticular');
    imgFallaAc.setAttribute('src', urlFallaAc);
    imgFallaAc.style.display = mostrar ? 'block' : 'none';
  }

  Update = () => {
    if (this.Estacion) {
      //console.log("particular Update");
      const estacionUpdate = Core.Instance.GetDatosEstacion(
        this.Estacion.IdEstacion
      );

      this.$headerDate.innerText = estacionUpdate.ObtenerFecha();
      this.setEnlaceParticular(estacionUpdate);

      estacionUpdate.Signals.forEach((signal) => {
        let signalActualizar =
          this.HTMLUpdateElements[`particular__valorSlider_${signal.IdSignal}`];

        if (signalActualizar) {
          signalActualizar.innerHTML = signal.GetValorString(true, true);
        }

        let $imgNivelAgua =
          this.HTMLUpdateElements[`particular_nivel_${signal.IdSignal}`];

        if ($imgNivelAgua) {
          $imgNivelAgua.setAttribute(
            "src",
            estacionUpdate.ObtenerRenderNivelOBomba(signal, "Particular")
          );
          if (signal.DentroRango == 1) $imgNivelAgua.classList.add('turbulence');
          else $imgNivelAgua.classList.remove('turbulence')
        }

        let $imgBombaParticular =
          this.HTMLUpdateElements[`particular_bomba_${signal.IdSignal}`];

        if ($imgBombaParticular) {
          $imgBombaParticular.setAttribute(
            "src",
            estacionUpdate.ObtenerRenderNivelOBomba(signal, "Particular")
          );
        }
      });

      this.MostrarFallaAc(estacionUpdate.IsFallaAc());

    }
  };

  mostrarDetalles(interceptor) {
    SetActualModule("Particular");

    this.HTMLUpdateElements = {};

    // Maneja los zIndex al cambiar de "paginas"
    section__home.style.display = "none";
    section__mapa.style.display = "none";
    section__graficador.style.display = "none";
    section__particular.style.display = "block";

    // Elementos del particular
    this.$headerParticularName = document.querySelector("#nombre__particular");
    this.$headerInterceptor = document.querySelector("#interceptor__particular");
    this.$headerDate = document.querySelector("#date__particular");
    this.$headerStatus = document.querySelector("#state_particular");
    this.$particularImg = document.querySelector("#particularImg");
    this.$particularCapaTextoImg = document.querySelector("#particularTextoImg");
    this.barras = document.getElementsByClassName("barraNivelContainer");

    // Construir la URL de la imagen particular
    const sitioAbrev = this.Estacion.Abreviacion;
    const urlImgParticular = `${Core.Instance.ResourcesPath}/Sitios/${sitioAbrev}/Particular/fondo.jpg?v=${Core.Instance.version}`;
    const urlImgParticularCapaTexto = `${Core.Instance.ResourcesPath}/Sitios/${sitioAbrev}/Particular/capatexto.png?v=${Core.Instance.version}`;

    // Asignar la URL de la imagen al atributo src del elemento de imagen
    this.$particularImg.src = urlImgParticular;
    this.$particularCapaTextoImg.src = urlImgParticularCapaTexto;

    this.$headerParticularName.innerText = this.Estacion.Nombre;
    this.$headerInterceptor.innerText = interceptor;

    // Crear señales
    this.createSignals();

    this.Update();
  }

  backParticular = () => {
    SetActualModule("Perfil");
    GoHome();
  }

  createSignals() {
    this.$signalsContainer = document.querySelector(
      ".particular__ItemsContainer"
    );

    this.HTMLUpdateElements = {};
    let estacionUpdate = Core.Instance.GetDatosEstacion(this.Estacion.IdEstacion);

    const niveles = estacionUpdate.Signals.filter((signal) => signal.TipoSignal == EnumTipoSignal.Nivel);

    for (let index = 0; index < this.barras.length; index++) {
      const barra = this.barras[index];
      barra.innerHTML = '';

      if (index <= niveles.length - 1) {

        const nivel = niveles[index];

        const barraContainer = CreateElement({
          nodeElement: "div",
          attributes: {
            class: "barraContainer",
          },
        });

        const barraNivel = CreateElement({
          nodeElement: "div",
          attributes: {
            class: "barraNivel",
            id: `barraNivel_${nivel.IdSignal}`,
          },
        });

        barraContainer.append(barraNivel);
        this.setBaraNivel(barraNivel, nivel);

        const signalItem = CreateElement({
          nodeElement: "div",
          attributes: { class: "particular__item" },
        });

        const etiquetaNombre = CreateElement({
          nodeElement: "div",
          attributes: { class: "etiqueta__Nombre" },
          innerText: `${nivel.GetNomenclaturaSignal()}: `,
        });

        const etiquetaValor = CreateElement({
          nodeElement: "div",
          attributes: {
            class: "etiqueta__Valor",
            id: `nivel_${nivel.IdSignal}`,
          },
          innerHTML: nivel.GetValorString(true, true),
        });

        this.alojarElementoDinamico([barraNivel, etiquetaValor]);

        signalItem.append(etiquetaNombre, etiquetaValor);
        barra.append(barraContainer, signalItem);

        barra.style.display = 'block';
      } else {

        barra.removeAttribute('id');
        barra.style.display = 'none';
      }

    }
  }

  /**
   *aloja un elemento dinamico a la propiedad HTML
   * @param {[HTMLElement]} elementos
   */
  alojarElementoDinamico(elementos) {
    elementos.forEach((elemento) => {
      this.HTMLUpdateElements[elemento.id] = elemento;
    });
  }

  /**
   * 
   * @param {HTMLElement} barraNivel 
   * @param {Signal} signal 
   */
  setBaraNivel(barraNivel, signal) {

    let max_height = 330;
    let altura = signal.Semaforo?.Altura || 1.0;
    let amount = (signal.Valor / altura) * max_height;
    let color = signal.GetColorSemaforo();

    barraNivel.style.height = `${amount}px`;
    barraNivel.style.backgroundColor = color;
  }

  setEnlaceParticular(estacion) {

    const estado = estacion.ObtenerEstadoEnlace();

    this.$headerStatus.innerHTML = estado.textoEnlace;
    this.$headerStatus.style.color = estado.color;
  }

  createNiveles() {
    let estacionUpdate = Core.Instance.GetDatosEstacion(this.Estacion.IdEstacion);
    const $nivelContainer = document.getElementById("particular__aguaNivel");
    const $bombasContainer = document.getElementById(
      "particular__bombasEstado"
    );

    $nivelContainer.innerHTML = "";
    $bombasContainer.innerHTML = "";

    this.Estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Bomba).forEach(
      (bomba) => {
        const $imgBombaParticular = CreateElement({
          nodeElement: "img",
          attributes: {
            id: `particular_bomba_${bomba.IdSignal}`,
            class: "bomba__Particular ",
            src: estacionUpdate.ObtenerRenderNivelOBomba(bomba, "Particular"),
          },
        });
        this.HTMLUpdateElements[$imgBombaParticular.id] = $imgBombaParticular;
        this.ponerBombaPurple(bomba, $imgBombaParticular);
        $bombasContainer.append($imgBombaParticular);
      }
    );

    estacionUpdate.ObtenerSignalPorTipoSignal(EnumTipoSignal.Nivel).forEach(
      (nivel) => {
        const $nivelAgua = CreateElement({
          nodeElement: "img",
          attributes: {
            id: `particular_nivel_${nivel.IdSignal}`,
            class: `nivelAgua__Particular ${estacionUpdate.SetTurbulencia(nivel)}`,
            src: estacionUpdate.ObtenerRenderNivelOBomba(nivel, "Particular"),
          },
        });
        this.HTMLUpdateElements[$nivelAgua.id] = $nivelAgua;
        $nivelContainer.append($nivelAgua);
      }
    );
  }
  //#endregion
}

export { Particular };
