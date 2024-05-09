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
  EnumEnlace,
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
          if (signal.DentroRango) $imgNivelAgua.classList.add('turbulence');
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

      this.showHideSlider();
    }
  };

  mostrarDetalles() {
    SetActualModule("Particular");
    // Elementos del DOM
    //console.log("Detalles de la estación:", this.Estacion.Signals);
    this.$headerTitle = document.querySelector("#title");
    this.$headerDate = document.querySelector("#date__particular");
    this.$headerStatus = document.querySelector("#state_particular");
    this.$particularImg = document.querySelector("#particularImg");
    this.$particularCapaTextoImg = document.querySelector(
      "#particularTextoImg"
    );
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
    this.$datosHeader.style.display = "block";
    this.$btnBack.style.opacity = "1";
    this.$btnBack.style.pointerEvents = "auto";
    this.$panelBombas.style.pointerEvents = "auto";

    // Cambiar el texto de acuerdo al estado de la estación
    this.setEnlaceParticular(this.Estacion);

    // Asignar la fecha formateada al elemento HTML
    this.$headerDate.innerText = this.Estacion.ObtenerFecha();

    // Construir la URL de la imagen particular
    const sitioAbrev = this.Estacion.Abreviacion;
    const urlImgParticular = `${Core.Instance.ResourcesPath}/Sitios/${sitioAbrev}/Particular/fondo.jpg?v=${Core.Instance.version}`;
    const urlImgParticularCapaTexto = `${Core.Instance.ResourcesPath}/Sitios/${sitioAbrev}/Particular/capatexto.png?v=${Core.Instance.version}`;

    // Asignar la URL de la imagen al atributo src del elemento de imagen
    this.$particularImg.src = urlImgParticular;
    this.$particularCapaTextoImg.src = urlImgParticularCapaTexto;

    // Crear señales
    this.createSignals();

    // Funconalidad del slider para recorrer las señales
    this.slider();

    // Funcionalidad para mostrar el panel de control
    this.panelControl();

    this.setNivelAgua(sitioAbrev);

    const $btnBack = document.querySelector(".header__btnRegresar");
    $btnBack.addEventListener("click", this.backParticular);
  }

  backParticular = () => {
    SetActualModule("Perfil");
    GoHome();
  }

  createSignals() {
    this.$signalsContainer = document.querySelector(
      ".particular__ItemsContainer"
    );

    this.$signalsContainer.innerHTML = "";
    this.HTMLUpdateElements = {};

    // Filtrar los signals con TipoSignal igual a 1, 3 o 4
    this.Estacion.Signals.filter((signal) =>
      signal.TipoSignal == EnumTipoSignal.Nivel ||
      signal.TipoSignal == EnumTipoSignal.Presion ||
      signal.TipoSignal == EnumTipoSignal.Gasto ||
      signal.TipoSignal == EnumTipoSignal.Totalizado ||
      signal.TipoSignal == EnumTipoSignal.ValvulaAnalogica ||
      signal.TipoSignal == EnumTipoSignal.ValvulaDiscreta ||
      signal.TipoSignal == EnumTipoSignal.Voltaje
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
    const sliderInputBola = document.querySelector(
      ".particular__slider input[type='range']"
    );

    this.showHideSlider();

    sliderInputBola.style.setProperty(
      "--bolaSlider",
      `url(${Core.Instance.ResourcesPath}General/esfera_slider.png?v=${Core.Instance.version})`
    );

    if (
      document.querySelector(".particular__slider").style.display !== "none"
    ) {
      sliderInput.addEventListener("input", (event) => {
        const container = document.querySelector(".particular__ItemsContainer");

        const currentValue = parseFloat(event.target.value);
        const containerWidth = container.offsetWidth;
        const scrollWidth = container.scrollWidth;
        const maxScrollLeft = scrollWidth - containerWidth;
        const scrollLeft = (maxScrollLeft * currentValue) / sliderInput.max;

        container.scrollLeft = scrollLeft;
      });
    }
  }

  showHideSlider() {
    const container = document.querySelector(".particular__ItemsContainer");

    // Mostrar el control deslizante si los elementos se desbordan del contenedor
    document.querySelector(".particular__slider").style.display =
      container.scrollWidth > container.offsetWidth ? "flex" : "none";
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

  setEnlaceParticular(estacion) {
    let valorEnlace = estacion.Enlace;
    let timeout = estacion.IsTimeout();
    let enMantenimiento = estacion.IsEnMantenimiento();

    // Cambiar el texto de acuerdo al estado de la estación
    const offline = valorEnlace == EnumEnlace.FueraLinea;
    const tipoEnlace =
      valorEnlace == EnumEnlace.Celular
        ? "C"
        : valorEnlace == EnumEnlace.Radio
          ? "R"
          : "CR";
    this.$headerStatus.innerHTML = timeout
      ? "Fuera de línea (Tiempo)"
      : enMantenimiento ?
        'En Mantenimiento' :
        offline
          ? "Fuera de línea"
          : `En línea (${tipoEnlace})`;
    this.$headerStatus.style.color = timeout
      ? "rgb(129, 11, 11)"
      :
      enMantenimiento ?
        "rgb(129, 129, 129)"
        : offline
          ? "rgb(140, 13, 13)"
          : "rgb(0, 128, 0)";
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
            class: "bomba__Particular ",
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
            class: `nivelAgua__Particular ${this.Estacion.SetTurbulencia(nivel)}`,
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
