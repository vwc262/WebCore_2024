import { ArranqueParo } from "../ArranqueParo/ArranqueParo.js";
import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import Signal from "../Entities/Signal.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { CreateElement } from "../Utilities/CustomFunctions.js";
import {
  EnumUnidadesSignal,
  EnumModule,
  EnumTipoSignal,
} from "../Utilities/Enums.js";
import { GoBack, GoHome, Module, SetActualModule } from "../uiManager.js";

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
  }

  Update = () => {
    //console.log("particular Update");
    const estacionUpdate = Core.Instance.GetDatosEstacion(
      this.Estacion.IdEstacion
    );

    this.$headerDate.innerText = estacionUpdate.ObtenerFecha();
    this.setEnlaceParticular(estacionUpdate.Enlace);

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
  };

  mostrarDetalles() {
    SetActualModule("Particular");
    // Elementos del DOM
    //console.log("Detalles de la estación:", this.Estacion.Signals);
    this.$headerTitle = document.querySelector("#title");
    this.$headerDate = document.querySelector("#date__particular");
    this.$headerStatus = document.querySelector("#state_particular");
    this.$particularImg = document.querySelector("#particularImg");
    this.$datosHeader = document.querySelector(".header__datos-particular");
    this.$btnBack = document.querySelector(".header__btnRegresar");
    this.$panelBombas = document.querySelector(".arranqueParo__panelControl");

    this.$headerTitle.innerText = this.Estacion.Nombre;

    // Maneja los zIndex al cambiar de "paginas"
    section__home.style.zIndex = "5";
    section__mapa.style.zIndex = "5";
    section__graficador.style.zIndex = "5";
    section__login.style.zIndex = "5";
    section__particular.style.zIndex = "10";
    this.$datosHeader.style.opacity = "1";
    this.$btnBack.style.opacity = "1";
    this.$btnBack.style.pointerEvents = "auto";
    this.$panelBombas.style.pointerEvents = "auto";

    // Cambiar el texto de acuerdo al estado de la estación
    this.setEnlaceParticular(this.Estacion.Enlace);

    // Asignar la fecha formateada al elemento HTML
    this.$headerDate.innerText = this.Estacion.ObtenerFecha();

    // Construir la URL de la imagen particular
    const sitioAbrev = this.Estacion.Abreviacion;
    const urlImgParticular = `http://w1.doomdns.com:11002/RecursosWeb/WebCore24/TanquesPadierna/Sitios/${sitioAbrev}/Particular/fondo.jpg?v=10`;

    // Asignar la URL de la imagen al atributo src del elemento de imagen
    this.$particularImg.src = urlImgParticular;

    // Crear señales
    this.createSignals();

    // Funconalidad del slider para recorrer las señales
    this.slider();

    // Funcionalidad para mostrar el panel de control
    this.panelControl();

    this.setNivelAgua(sitioAbrev);

    const $btnBack = document.querySelector(".header__btnRegresar");
    $btnBack.addEventListener("click", () => {
      SetActualModule("Perfil");
      GoHome();
    });
  }

  createSignals() {
    this.$signalsContainer = document.querySelector(
      ".particular__ItemsContainer"
    );

    this.$signalsContainer.innerHTML = "";
    this.HTMLUpdateElements = {};

    // Filtrar los signals con TipoSignal igual a 1, 3 o 4
    this.Estacion.Signals.filter((signal) =>
      [1, 3, 4].includes(signal.TipoSignal)
    ).forEach((signal) => {
      const $signalItem = CreateElement({
        nodeElement: "div",
        attributes: { class: "particular__item" },
      });

      const $etiquetaNombre = CreateElement({
        nodeElement: "div",
        attributes: { class: "etiqueta__Nombre" },
        innerText: `${signal.GetNomenclaturaSignal()}: `,
      });

      const $etiquetaValor = CreateElement({
        nodeElement: "div",
        attributes: {
          class: "etiqueta__Valor",
          id: `particular__valorSlider_${signal.IdSignal}`,
          style: `color: ${signal.GetValorColor()}`,
        },
        innerHTML: signal.GetValorString(true, true),
      });

      $signalItem.append($etiquetaNombre, $etiquetaValor);
      this.alojarElementoDinamico([$etiquetaValor]);
      this.$signalsContainer.appendChild($signalItem);
    });
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

  slider() {
    const container = document.querySelector(".particular__ItemsContainer");
    const sliderInput = document.querySelector("#sliderInput");

    // Mostrar el control deslizante si los elementos se desbordan del contenedor
    document.querySelector(".particular__slider").style.display =
      container.scrollWidth > container.clientWidth ? "flex" : "none";

    if (
      document.querySelector(".particular__slider").style.display !== "none"
    ) {
      sliderInput.addEventListener("input", () => {
        const currentValue = parseFloat(sliderInput.value);
        const containerWidth = container.offsetWidth;
        const scrollWidth = container.scrollWidth;
        const maxScrollLeft = scrollWidth - containerWidth;
        const scrollLeft = (maxScrollLeft * currentValue) / sliderInput.max;

        container.scrollLeft = scrollLeft;
      });
    }
  }

  panelControl() {
    const signals = this.Estacion.Signals;
    const tipoSignal7Count = signals.filter(
      (signal) => signal.TipoSignal === 7
    ).length;
    const panelControlElement = document.querySelector(
      ".particular__panelControl"
    );
    panelControlElement.style.display = tipoSignal7Count >= 1 ? "flex" : "none";
  }

  setEnlaceParticular(valorEnlace) {
    // Cambiar el texto de acuerdo al estado de la estación
    const offline = valorEnlace == "0";
    this.$headerStatus.innerText = offline ? "Fuera de línea" : "En línea";
    this.$headerStatus.style.color = offline ? "red" : "green";
  }

  setNivelAgua() {
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
            class: "bomba__Particular",
            src: this.Estacion.ObtenerRenderNivelOBomba(bomba, "Particular"),
          },
        });
        this.HTMLUpdateElements[$imgBombaParticular.id] = $imgBombaParticular;
        $bombasContainer.append($imgBombaParticular);
      }
    );

    this.Estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Nivel).forEach(
      (nivel) => {
        const $nivelAgua = CreateElement({
          nodeElement: "img",
          attributes: {
            id: `particular_nivel_${nivel.IdSignal}`,
            class: "nivelAgua__Particular",
            src: this.Estacion.ObtenerRenderNivelOBomba(nivel, "Particular"),
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
