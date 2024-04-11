import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { EnumAppEvents } from "../Utilities/Enums.js";
import Login from "../Entities/Login/Login.js";
import { ShowModal } from "../uiManager.js";
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
  //#region
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
  }
  //#endregion

  //#region Propiedades
  isVisible = false;

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
      if (parseFloat(getComputedStyle($panelArranqueParo).opacity) === 1) {
        $panelArranqueParo.style.background = urlImg;
        $panelArranqueParo.style.backgroundRepeat = "no-repeat";
        $panelArranqueParo.style.backgroundSize = "contain";
        $panelArranqueParo.style.backgroundPositionY = "bottom";

        $panelFondo.style.transform = "translateY(16vh)";

        this.carrusel();
      }
    });
  }

  // ahora lo que necesito es recorrer el carrusel cuando de click a mis botones, al recorrerlo, el siguiente elemento debe de colocarse en medio, esto solo cuando se deborden los items del contenedor

  carrusel() {
    const $carruselContainer = document.querySelector(
      ".arranqueParo__carruselBombas"
    );
    const $BtnNext = document.querySelector(".arranqueParo__Next");
    const $BtnPrev = document.querySelector(".arranqueParo__Prev");

    if ($carruselContainer.scrollWidth > $carruselContainer.clientWidth) {
      console.log("se desborda el item");
    } else {
      console.log("NOOOO se desborda el item");
    }
  }

  Update = () => {
    if (this.isVisible) {
      const estacionUpdate = Core.Instance.GetDatosEstacion(this.idEstacion);
    }
  };

  CloseArranqueParo = () => {
    this.isVisible = false;
    // Logica para cerrar el modal
  };
  //#endregion
}
export { ArranqueParo };
