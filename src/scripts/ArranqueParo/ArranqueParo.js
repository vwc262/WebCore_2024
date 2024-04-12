import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import {
  EnumAppEvents,
  EnumPerillaBomba,
  EnumTipoSignal,
} from "../Utilities/Enums.js";
import Login from "../Entities/Login/Login.js";
import { ShowModal } from "../uiManager.js";
import Estacion from "../Entities/Estacion.js";
import { CreateElement } from "../Utilities/CustomFunctions.js";
import Signal from "../Entities/Signal.js";
class ArranqueParo {
  //#region Singleton
  static #instance = undefined;
  /**
   * @returns {ArranqueParo}
   */
  static get Instance() {
    if (!this.#instance) {
      this.#instance = new ArranqueParo();
    }
    return this.#instance;
  }
  //#endregion

  //#region Constructor
  constructor() {
    this.idEstacion = 0;
    // suscripcion al evento logout
    EventsManager.Instance.Suscribirevento(
      EnumAppEvents.LogOut,
      new EventoCustomizado(this.CloseArranqueParo)
    );
    EventsManager.Instance.Suscribirevento(
      EnumAppEvents.Update,
      new EventoCustomizado(this.Update)
    );

    this.#carruselContainer = document.querySelector(
      ".arranqueParo__itemsContainer"
    );

    // Agregar eventos de clic una sola vez en el constructor
    this.agregarEventosClic();
  }
  //#endregion

  //#region Propiedades
  isVisible = false;
  #isCarouselCreated = false;
  #itemsCarrusel = [];
  /**
   * @type {HTMLElement}
   */
  #carruselContainer = undefined;
  //#endregion

  //#region Metodos
  Create(idEstacion) {
    const sesionIniciada = Login.Instace.userIsLogged; // para saber si la sesion ya se inicio
    this.idEstacion = idEstacion;
    const estacionActual = Core.Instance.GetDatosEstacion(this.idEstacion); // Se obtiene la estacion Actual
    // Si ya se complen las condiciones cambiar la bandera is visible a true

    // Validación
    if (sesionIniciada && estacionActual.Enlace === 0) {
      this.animPanel();
    } else {
      const mensaje = sesionIniciada
        ? "El sitio debe de estar en línea"
        : "Se debe de iniciar sesión";

      ShowModal(mensaje, "Panel de control");
    }
  }

  animPanel() {
    const $panelArranqueParo = document.querySelector(
      ".arranqueParo__panelControl"
    );

    const $panelFondo = document.querySelector(".arranqueParo__Container");

    $panelArranqueParo.style.opacity = "1";
    const urlImg =
      "url(http://w1.doomdns.com:11002/RecursosWeb/Client/TanquesPadierna/Control/transition.gif?v=10)";

    // Agregar un event listener para detectar cuando la transición ha terminado
    $panelArranqueParo.addEventListener("transitionend", () => {
      // Verificar si la opacidad es igual a 1 después de la transición
      if (
        parseFloat(getComputedStyle($panelArranqueParo).opacity) === 1 &&
        !this.#isCarouselCreated
      ) {
        $panelArranqueParo.style.background = urlImg;
        $panelArranqueParo.style.backgroundRepeat = "no-repeat";
        $panelArranqueParo.style.backgroundSize = "contain";
        $panelArranqueParo.style.backgroundPositionY = "bottom";

        $panelFondo.style.transform = "translateY(16vh)";

        this.CrearCarrusel();
      }
    });
  }

  CrearCarrusel() {
    const $carruselContainer = document.querySelector(
      ".arranqueParo__carruselBombas"
    );
    const $selectBombaContainer = document.querySelector(
      ".arranqueParo__BtnsCarrusel"
    );

    const $carruselItem = document.querySelectorAll(
      ".controlParo__carruselItem"
    );
    const estacion = Core.Instance.GetDatosEstacion(this.idEstacion);

    // Verificar que la estacion contenga mas de una linea y pintar por default la primer linea
    if (estacion.Lineas.length > 1) {
      this.PintarBotonesLineasEstacion(estacion);
      const bombasPrimerLinea = estacion.ObtenerBombasPorLinea(1);
      this.CrearItemsCarrusel(bombasPrimerLinea);
    } else
      this.CrearItemsCarrusel(
        estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Bomba)
      );

    // if ($carruselContainer.scrollWidth > $carruselContainer.clientWidth) {
    //   console.log("se desborda el item");
    //   $selectBombaContainer.style.opacity = "1";
    //   $selectBombaContainer.style.pointerEvents = "all";
    // } else {
    //   console.log("NOOOO se desborda el item");
    //   $selectBombaContainer.style.opacity = "0.5";
    //   $selectBombaContainer.style.pointerEvents = "none";
    // }
    this.SetIsCarouselCreated(true);
  }
  /**
   * Pinta los botones de las lineas de la estacion
   * @param {Estacion} estacion
   */
  PintarBotonesLineasEstacion(estacion) {
    estacion.Lineas.forEach((linea) => {
      const divLinea = CreateElement({
        nodeElement: "div",
        attributes: { id: `Linea__${linea.IdLinea}`, idLinea: linea.IdLinea },
        innerText: linea.Nombre,
        events: new Map().set("click", [this.CambiarLinea]),
      });
      // TODO : Agregar al contenedor de botones de linea
    });
  }

  CambiarLinea = (e) => {
    const estacion = Core.Instance.GetDatosEstacion(this.idEstacion);
    const idLinea = parseInt(e.currentTarget.getAttribute("idLinea"));
    const bombasPorLinea = estacion.ObtenerBombasPorLinea(idLinea);
    this.CrearItemsCarrusel(bombasPorLinea);
  };
  /**
   *
   * @param {[Signal]} bombas
   */
  CrearItemsCarrusel(bombas) {
    //Limpiar Papa
    this.#carruselContainer.innerHTML = "";
    const estacion = Core.Instance.GetDatosEstacion(this.idEstacion);
    bombas.forEach((bomba, index) => {
      const carruselItem = CreateElement({
        nodeElement: "div",
        attributes: { class: "controlParo__carruselItem" },
      });
      const modo = CreateElement({
        nodeElement: "div",
        attributes: { class: "arranqueParo__modo" },
        innerText:
          EnumPerillaBomba[
            estacion.ObtenerValorPerillaBomba(bomba.Ordinal).Valor
          ],
      });
      const bombaImg = CreateElement({
        nodeElement: "div",
        attributes: { class: "arranqueParo__bombaImg" },
      });
      const bombaNum = CreateElement({
        nodeElement: "div",
        attributes: { class: "arranqueParo__bombaNum;" },
        innerText: bomba.Nombre,
      });
      this.#itemsCarrusel.push(carruselItem);
      carruselItem.append(modo, bombaImg, bombaNum);
      carruselItem.style.left = `${index * 100}px`;
      this.#carruselContainer.append(carruselItem);
    });
  }

  /**
   * Establece el valor para saber si el carrusel ya se creo
   * @param {boolean} isCreated
   */
  SetIsCarouselCreated(isCreated) {
    this.#isCarouselCreated = isCreated;
  }

  agregarEventosClic() {
    const $btnPrev = document.querySelector(".arranqueParo__Prev");
    const $btnNext = document.querySelector(".arranqueParo__Next");

    // Agregar evento de clic al botón de "prev"
    $btnPrev.addEventListener("click", this.MoverCarrusel);

    // Agregar evento de clic al botón de "next"
    $btnNext.addEventListener("click", this.MoverCarrusel);
  }

  /**
   * Evento para mover el carrusel
   * @param {Event} e
   */
  MoverCarrusel = (e) => {
    //Distincion para saber si va atras o adelante
    const isAtras = e.currentTarget.id == "carruselPrev_AP";
    this.#itemsCarrusel = this.#itemsCarrusel.sort();
    if (!isAtras) {
      const ultimo = this.#itemsCarrusel[this.#itemsCarrusel.length - 1];
      ultimo.style.cssText = "left:-100px;opacity:0;transition:none";
      this.#itemsCarrusel = [ultimo, ...this.#itemsCarrusel];
      this.#itemsCarrusel.splice(this.#itemsCarrusel.length - 1, 1);
    }
    this.#itemsCarrusel = isAtras
      ? this.#itemsCarrusel.sort()
      : this.#itemsCarrusel.reverse();
    this.#itemsCarrusel.forEach((item, index) => {
      const currentX = parseFloat(item.style.left.replace("px", ""));
      item.style.cssText = `left:${
        isAtras ? currentX - 100 : currentX + 100
      }px; opacity = 1; transition:left linear .2s`;
    });

    if (isAtras) {
      this.#itemsCarrusel[0].style.cssText =
        "left:300px;opacity:0;transition:none";
      this.#itemsCarrusel.push(this.#itemsCarrusel[0]);
      this.#itemsCarrusel.splice(0, 1);
    }
  };

  Update = () => {
    if (this.isVisible) {
      const estacionUpdate = Core.Instance.GetDatosEstacion(this.idEstacion);
    }
  };

  CloseArranqueParo = () => {
    // Logica para cerrar el modal
    this.isVisible = false;
    this.SetIsCarouselCreated(false);
  };
  //#endregion
}
export { ArranqueParo };
