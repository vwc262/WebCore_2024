import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import Signal from "../Entities/Signal.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { CreateElement } from "../Utilities/CustomFunctions.js";
import { EnumUnidadesSignal } from "../Utilities/Enums.js";

class Particular {
  static #_instance = null;
  /**
   * @type {Estacion}
   */
  Estacion = undefined;
  /**
   *@return {Particular}
   */
  static get Instance() {
    if (!this.#_instance) {
      this.#_instance = new Particular();
    }
    return this.#_instance;
  }

  constructor() {
    EventsManager.Instance.Suscribirevento(
      "Update",
      new EventoCustomizado(this.Update)
    );
  }
  /**
   * @type {HTMLElement}
   */
  HTMLUpdateElements = {};

  setEstacion(estacion) {
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
        signalActualizar.innerText = signal.GetValorString(true, true);
      }
    });
  };

  mostrarDetalles() {
    // Elementos del DOM
    //console.log("Detalles de la estación:", this.Estacion.Signals);
    this.$headerTitle = document.querySelector("#title");
    this.$headerDate = document.querySelector("#date__particular");
    this.$headerStatus = document.querySelector("#state_particular");
    this.$particularImg = document.querySelector("#particularImg");
    this.$datosHeader = document.querySelector(".header__datos-particular");

    this.$headerTitle.innerText = this.Estacion.Nombre;

    // Maneja los zIndex al cambiar de "paginas"
    section__home.style.zIndex = "5";
    section__mapa.style.zIndex = "5";
    section__graficador.style.zIndex = "5";
    section__login.style.zIndex = "5";
    section__particular.style.zIndex = "10";
    this.$datosHeader.style.opacity = "1";

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
  }

  createSignals() {
    this.$signalsContainer = document.querySelector(
      ".particular__ItemsContainer"
    );

    this.$signalsContainer.innerHTML = "";
    this.HTMLUpdateElements = {};

    //console.log(this.HTMLUpdateElements);
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
        innerText: signal.GetValorString(true, true),
      });

      this.setEnlaceParticular(this.Estacion.Enlace);

      $signalItem.append($etiquetaNombre, $etiquetaValor);
      this.alojarElementoDinamico([$etiquetaValor]);

      this.$signalsContainer.appendChild($signalItem);
    });
  }

  setEnlaceParticular(valorEnlace) {
    // Cambiar el texto de acuerdo al estado de la estación
    if (valorEnlace == "0") {
      this.$headerStatus.innerText = "Fuera de línea";
      this.$headerStatus.style.color = "red";
    } else {
      this.$headerStatus.innerText = "En línea";
      this.$headerStatus.style.color = "green";
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

  slider() {
    const container = document.querySelector(".particular__ItemsContainer");
    const sliderInput = document.querySelector("#sliderInput");

    // Mostrar el control deslizante si los elementos se desbordan del contenedor
    if (container.scrollWidth > container.clientWidth) {
      document.querySelector(".particular__slider").style.display = "flex";
    } else {
      document.querySelector(".particular__slider").style.display = "none";
    }

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

    if (tipoSignal7Count >= 1) {
      panelControlElement.style.display = "flex"; // Mostrar el panel de control
    } else {
      panelControlElement.style.display = "none"; // Ocultar el panel de control
    }
  }
}

export { Particular };
