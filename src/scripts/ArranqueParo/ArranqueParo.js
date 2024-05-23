import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { EnumAppEvents, EnumControllerMapeo, EnumEstadoComando, EnumPerillaBomba, EnumPerillaBombaString, EnumPerillaGeneral, EnumPerillaGeneralString, EnumTipoSignal, EnumValorBomba, RequestType, } from "../Utilities/Enums.js";
import Login from "../Entities/Login/Login.js";
import { ShowModal } from "../uiManager.js";
import Estacion from "../Entities/Estacion.js";
import { CreateElement } from "../Utilities/CustomFunctions.js";
import Signal from "../Entities/Signal.js";
import { Fetcher } from "../Fetcher/Fetcher.js";
import { Particular } from "../Particular/Particular.js";

class ArranqueParo {
  //#region Singleton
  static #instance = undefined;
  /**
   * @returns {ArranqueParo}
   */
  static get Instance() {
    if (!this.#instance)
      this.#instance = new ArranqueParo();
    return this.#instance;
  }
  //#endregion

  //#region Constructor
  constructor() {
    this.idEstacion = 0;
    // suscripcion al evento logout
    EventsManager.Instance.Suscribirevento(EnumAppEvents.LogOut, new EventoCustomizado(this.CloseArranqueParo));
    EventsManager.Instance.Suscribirevento(EnumAppEvents.Update, new EventoCustomizado(this.Update));
    EventsManager.Instance.Suscribirevento(EnumAppEvents.ParticularChanged, new EventoCustomizado(this.CloseArranqueParo));
    this.#carruselContainer = document.querySelector(".arranqueParo__itemsContainer");
    this.#PerillaGeneralText = document.querySelector(".arranqueParo__modoTxt");
    // Agregar eventos de clic una sola vez en el constructor
    this.agregarEventosClic();
  }
  //#endregion

  //#region Propiedades
  isVisible = false;
  #isCarouselCreated = false;
  #itemsCarrusel = [];
  clone = undefined;
  /**
   * @type {HTMLElement}
   */
  #carruselContainer = undefined;
  /**
   * @type {{HTMLElement}}
   */
  #UpdateableElements = {};
  #PerillaGeneralText = undefined;
  /**
   * @type {Signal}
   */
  #bombaSeleccionada = undefined;
  #prenderBomba = true;
  //#endregion

  //#region Metodos
  Create(idEstacion) {
    if (!this.#isCarouselCreated) {
      const sesionIniciada = Login.Instace.userIsLogged; // para saber si la sesion ya se inicio
      this.idEstacion = idEstacion;
      const estacionActual = Core.Instance.GetDatosEstacion(this.idEstacion); // Se obtiene la estacion Actual
      // Si ya se complen las condiciones cambiar la bandera is visible a true
      // Validación
      if (sesionIniciada && estacionActual.EstaEnLinea()) {
        this.animPanel();
        this.isVisible = true;
      } else {
        const mensaje = sesionIniciada ? "El sitio debe de estar en línea" : "Se debe de iniciar sesión";
        ShowModal(mensaje, "Panel de control", false);
      }
    }
  }

  animPanel() {
    const $panelArranqueParo = document.querySelector(".arranqueParo__panelControl");
    $panelArranqueParo.style.opacity = "1";
    const $panelFondo = document.querySelector(".arranqueParo__Container");
    const $imgArranqueParo = document.getElementById("imgPanelArranqueParo");
    $imgArranqueParo.setAttribute("src", `${Core.Instance.ResourcesPath}Control/transition.gif?v=${Core.Instance.version}`);
    // Agregar un event listener para detectar cuando la transición ha terminado
    $panelArranqueParo.addEventListener("transitionend", () => {
      // Verificar si la opacidad es igual a 1 después de la transición
      if (parseFloat(getComputedStyle($panelArranqueParo).opacity) === 1 && !this.#isCarouselCreated) {
        this.SetIsCarouselCreated(true);
        $panelFondo.style.background = `url(${Core.Instance.ResourcesPath}Control/panelControl.png?v=${Core.Instance.version}) no-repeat`;
        $panelFondo.style.backgroundSize = `contain`;
        $panelFondo.style.transform = "translateY(225px)";
        $panelFondo.style.opacity = "1";
        this.CrearCarrusel();
      }
    });
  }

  CrearCarrusel() {
    const estacion = Core.Instance.GetDatosEstacion(this.idEstacion);
    // Verificar que la estacion contenga mas de una linea y pintar por default la primer linea    
    if (estacion.Lineas.length > 1) {
      this.PintarBotonesLineasEstacion(estacion);
      const bombasPrimerLinea = estacion.ObtenerBombasPorLinea(1);
      this.CrearItemsCarrusel(bombasPrimerLinea);
    } else
      this.CrearItemsCarrusel(estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Bomba));
    this.SetPerillaGeneral(0, estacion);
    this.SetIsCarouselCreated(true);
  }
  /**
   * Pinta los botones de las lineas de la estacion
   * @param {Estacion} estacion
   */
  PintarBotonesLineasEstacion(estacion) {
    // estacion.Lineas
    const lineasContainer = document.querySelector('.arranqueParo__Lineas');
    lineasContainer.innerHTML = "";
    estacion.Lineas.forEach((linea, index) => {
      const divLinea = CreateElement({
        nodeElement: "div",
        attributes: { id: `Linea__${linea.IdLinea}`, idLinea: linea.IdLinea, class: `botonLinea ${index == 0 ? 'lineaActive' : ''}` },
        innerText: linea.Nombre,
        events: new Map().set("click", [this.CambiarLinea]),
      });
      lineasContainer.append(divLinea);
      // TODO : Agregar al contenedor de botones de linea
    });
  }

  CambiarLinea = (e) => {
    document.querySelectorAll('.botonLinea').forEach(e => e.classList.remove('lineaActive'));
    e.currentTarget.classList.add('lineaActive')
    const estacion = Core.Instance.GetDatosEstacion(this.idEstacion);
    const idLinea = parseInt(e.currentTarget.getAttribute("idLinea"));
    const bombasPorLinea = estacion.ObtenerBombasPorLinea(idLinea);
    this.CrearItemsCarrusel(bombasPorLinea);
    this.SetPerillaGeneral(idLinea - 1, estacion);
  };
  SetPerillaGeneral(idLinea = 0, estacion) {
    const perillaGeneral = estacion.ObtenerPerillaGeneral(idLinea); //
    this.#PerillaGeneralText.mySignal = perillaGeneral;
    this.#PerillaGeneralText.innerText = perillaGeneral.GetValorPerillaGeneral();
    this.setUpdateElements(this.#PerillaGeneralText);
  }
  /**
   *
   * @param {[Signal]} bombas
   */
  CrearItemsCarrusel(bombas) {
    //Limpiar Papa
    this.ResetCarrusel();
    const estacion = Core.Instance.GetDatosEstacion(this.idEstacion);
    bombas.forEach((bomba, index) => {
      const signalPerillaBomba = estacion.ObtenerValorPerillaBomba(bomba.Ordinal);
      const carruselItem = CreateElement({
        nodeElement: "div",
        attributes: { class: "controlParo__carruselItem" },
        events: new Map().set("click", [this.clickBomba]),
      });
      carruselItem.mySignal = bomba;
      const modo = CreateElement({
        nodeElement: "div",
        attributes: {
          id: `AP_Perilla_${signalPerillaBomba.IdSignal}`,
          class: "arranqueParo__modo",
        },
        innerText: signalPerillaBomba.GetValorPerillaBomba(),
      });
      modo.mySignal = signalPerillaBomba;
      const bombaImg = CreateElement({
        nodeElement: "div",
        attributes: {
          id: `AP_Bomba_${bomba.IdSignal}`,
          class: "arranqueParo__bombaImg",
          style: bomba.GetImagenBombaPanelControl(),
        },
      });
      bombaImg.mySignal = bomba;
      const bombaNum = CreateElement({
        nodeElement: "div",
        attributes: { class: "arranqueParo__bombaNum" },
        innerText: bomba.Nombre,
      });
      this.#itemsCarrusel.push(carruselItem);
      this.setUpdateElements(modo, bombaImg);
      carruselItem.append(modo, bombaImg, bombaNum);
      carruselItem.style.left = `${index * 100}px`;
      this.#carruselContainer.append(carruselItem);
    });
    if (bombas.length > 3) this.refillCarrusel();
    else {
      document.querySelectorAll('.flechaControl').forEach(flecha => flecha.style.display = "none");
      if(bombas.length == 1){
        document.querySelector('.controlParo__carruselItem').style.left = "105px";
      }
    }
  }
  clickBomba = (e) => {
    /**
     * @type {Signal}
     */
    this.#bombaSeleccionada = e.currentTarget.mySignal;
    if (this.#carruselContainer.children.length > 3) {
      const container = e.currentTarget;
      const position = parseFloat(container.style.left.replace("px", ""));
      switch (position) {
        case 0:
          this.$btnNext.click();
          break;
        case 200:
          this.$btnPrev.click();
          break;
        default:
          this.BorrarSeleccion();
          this.SetSeleccionado(e.currentTarget);
          break;
      }
    } else {
      this.BorrarSeleccion();
      this.SetSeleccionado(e.currentTarget);
    }
  };
  /**
   * Guarda los elementos a actualizar
   * @param  {...HTMLElement} elementos
   */
  setUpdateElements(...elementos) {
    elementos.forEach((arg) => {
      this.#UpdateableElements[arg.id] = arg;
    });
  }
  deleteUpdateElements() {
    this.#UpdateableElements = {};
  }
  refillCarrusel() {
    [...this.#carruselContainer.children].reverse().forEach((item, index) => {
      const clone = item.cloneNode(true);
      clone.addEventListener("click", this.clickBomba);
      clone.mySignal = item.children[1].mySignal; // La posicion uno es el elemento bomba
      clone.style.left = `${(index + 1) * -100}px`;
      this.#carruselContainer.prepend(clone);
      const perillaClone = clone.children[0];
      perillaClone.id = perillaClone.id + "C";
      perillaClone.mySignal = item.children[0].mySignal;
      const bombaClone = clone.children[1];
      bombaClone.id = bombaClone.id + "C";
      bombaClone.mySignal = item.children[1].mySignal;
      this.setUpdateElements(perillaClone, bombaClone);
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
    const urlIzqOff = `url(${Core.Instance.ResourcesPath}Control/izq_off.png?v=${Core.Instance.version}) no-repeat`
    const urlizqOn = `url(${Core.Instance.ResourcesPath}Control/izq_on.png?v=${Core.Instance.version}) no-repeat`;
    this.$btnPrev = document.querySelector(".arranqueParo__Prev");
    this.$btnNext = document.querySelector(".arranqueParo__Next");
    this.$btnPrev.style.background = urlIzqOff;
    this.$btnNext.style.background = urlIzqOff;

    this.$btnPrev.addEventListener("mouseover", () => {
      this.$btnPrev.style.background = urlizqOn;
    })
    this.$btnPrev.addEventListener("mouseout", () => {
      this.$btnPrev.style.background = urlIzqOff;
    })
    this.$btnNext.addEventListener("mouseover", () => {
      this.$btnNext.style.background = urlizqOn;
    })
    this.$btnNext.addEventListener("mouseout", () => {
      this.$btnNext.style.background = urlIzqOff;
    })
    const $closePanelArranqueParo = document.querySelector(".arranqueParo__closePanel");

    // Agrega evento de click al boton de cerrar panel
    $closePanelArranqueParo.addEventListener("click", this.CloseArranqueParo);

    // Agregar evento de clic al botón de "prev"
    this.$btnPrev.addEventListener("click", this.MoverCarrusel);

    // Agregar evento de clic al botón de "next"
    this.$btnNext.addEventListener("click", this.MoverCarrusel);
    // Evento click boton accion
    const btnAccion = document.querySelector(
      ".arranqueParo__encenderApagarBomba"
    );
    btnAccion.addEventListener("click", this.CambiarAccion);
    btnAccion.prender = true;

    // Evento enviar comando
    const btnEnviarComando = document.querySelector(
      ".arranqueParo__confirmarimg"
    );
    btnEnviarComando.style.background = `url(${Core.Instance.ResourcesPath}Control/btnConfirm.png?v=${Core.Instance.version}) no-repeat`;
    btnEnviarComando.style.backgroundSize = `contain`;
    btnEnviarComando.style.backgroundPositionX = `center`;
    btnEnviarComando.addEventListener("mouseover", () => {
      btnEnviarComando.style.background = `url(${Core.Instance.ResourcesPath}Control/btnConfirm_on.png?v=${Core.Instance.version}) no-repeat`;
      btnEnviarComando.style.backgroundPositionX = `center`;
    });
    btnEnviarComando.addEventListener("mouseout", () => {
      btnEnviarComando.style.background = `url(${Core.Instance.ResourcesPath}Control/btnConfirm.png?v=${Core.Instance.version}) no-repeat`;
      btnEnviarComando.style.backgroundPositionX = `center`;
    });
    btnEnviarComando.addEventListener("click", this.EnviarComando);
  }
  CambiarAccion = (e) => {
    const btnAccion = e.currentTarget;
    btnAccion.children[1].style.background = `url(${Core.Instance.ResourcesPath
      }Control/${btnAccion.prender ? "BTN_STOP" : "BTN_ON"}.png)`;
    btnAccion.prender = !btnAccion.prender;
    this.#prenderBomba = btnAccion.prender;
  };
  ArmarCodigo() {
    return (
      (this.idEstacion << 8) |
      (this.#bombaSeleccionada.Ordinal << 4) |
      (this.#prenderBomba ? 1 : 2)
    );
  }
  async RequestComando() {
    const alertTitle = "Control Bombas";
    this.textoComando = `${this.#prenderBomba ? "prender" : "apagar"} la ${this.#bombaSeleccionada.Nombre}, de la estación ${Particular.Instance.Estacion.Nombre}`;
    ShowModal(`Mandando a ${this.#prenderBomba ? "prender" : "apagar"} la ${this.#bombaSeleccionada.Nombre}`, alertTitle, false);
    this.codigo = this.ArmarCodigo();
    const result = await Fetcher.Instance.RequestData(
      `${EnumControllerMapeo.INSERTCOMANDO}?IdProyecto=${Core.Instance.IdProyecto}`,
      RequestType.POST,
      {
        Usuario: `web24-${Login.Instace.userName}`,
        idEstacion: this.idEstacion,
        Codigo: this.codigo,
        RegModbus: 2020,
      },
      true
    );

    if (result.exito) {
      this.ObtenerEstadoComando();
    }
  }
  EnviarComando = async (e) => {
    const alertTitle = "Control Bombas";
    const estacion = Core.Instance.GetDatosEstacion(this.idEstacion);
    const enLinea = estacion.EstaEnLinea();
    if (enLinea && this.#bombaSeleccionada) {
      const signalBomba = estacion.ObtenerSignal(this.#bombaSeleccionada.IdSignal);
      const perillaBomba = estacion.ObtenerValorPerillaBomba(signalBomba.Ordinal);
      const perillaGeneral = estacion.ObtenerPerillaGeneral(0); //signalBomba.Lineas - 1
      if(estacion.IsFallaAc()){
        ShowModal("El sitio presenta falla en la energia", alertTitle, false);
      }
      if (perillaGeneral.GetValorPerillaGeneral() == EnumPerillaGeneralString[EnumPerillaGeneral.Remoto]) {
        if (perillaBomba.GetValorPerillaBomba() == EnumPerillaBombaString[EnumPerillaBomba.Remoto]) {
          if (signalBomba.Valor == EnumValorBomba.Arrancada || signalBomba.Valor == EnumValorBomba.Apagada) {
            if (this.#prenderBomba && signalBomba.Valor != EnumValorBomba.Arrancada) this.RequestComando();
            else if (!this.#prenderBomba && signalBomba.Valor != EnumValorBomba.Apagada) this.RequestComando();
            else ShowModal(this.#prenderBomba ? 'La bomba ya esta encendida' : 'La bomba ya esta apagada', alertTitle, false);
          } else
            ShowModal("La bomba debe estar encendida o apagada", alertTitle, false);
        } else
          ShowModal(
            `La perilla de la bomba debe estar en ${EnumPerillaBombaString[1]}`,
            alertTitle,
            false
          );
      } else {
        ShowModal("La perilla general debe estar en Remoto", alertTitle, false);
      }
    } else
      ShowModal(
        enLinea ? "Debe seleccionar una bomba" : "El sitio debe estar en linea",
        alertTitle,
        false
      );
  };
  BorrarSeleccion() {
    [...this.#carruselContainer.children].forEach((element) => {
      element.classList.remove("midItem");
      if (element.children.length > 3) {
        element.children[element.children.length - 1].remove();
      }
    });
  }
  SetSeleccionado(ContainerImagenBomba) {
    const hologram = CreateElement({
      nodeElement: "div",
      attributes: {
        class: "hologramaBase",
        style: `background: url(${Core.Instance.ResourcesPath}General/dial.gif?v=${Core.Instance.version})`
      },
    });
    if (this.#carruselContainer.children.length > 3) {
      if (ContainerImagenBomba.style.left == "100px") {
        ContainerImagenBomba.classList.add("midItem");
        ContainerImagenBomba.append(hologram);
        this.#bombaSeleccionada = ContainerImagenBomba.mySignal;
      }
    } else {
      ContainerImagenBomba.classList.add("midItem");
      ContainerImagenBomba.append(hologram);
      this.#bombaSeleccionada = ContainerImagenBomba.mySignal;
    }
  }
  /**
   * Evento para mover el carrusel
   * @param {Event} e
   */
  MoverCarrusel = (e) => {
    // Distincion para saber si va atras o adelante
    if (this.#carruselContainer.children.length > 3) {
      const isAtras = e.currentTarget.id == "carruselPrev_AP";
      this.BorrarSeleccion();
      this.transicionCarrusel(isAtras);
      if (!isAtras) {
        this.#carruselContainer.lastChild.style.cssText = `transition:none;left:${parseFloat(this.#carruselContainer.firstChild.style.left.replace("px", "") - 100)}px;opacity:0;`;
        this.#carruselContainer.prepend(this.#carruselContainer.lastChild);
      } else {
        this.#carruselContainer.firstChild.style.cssText = "transition:none;left:300px;opacity:0;";
        this.#carruselContainer.append(this.#carruselContainer.firstChild);
      }
    }
  };

  transicionCarrusel(isAtras) {
    [...this.#carruselContainer.children].forEach((item) => {
      const currentX = parseFloat(item.style.left.replace("px", ""));
      item.style.cssText = `transition:left ease .2s;left:${isAtras ? currentX - 100 : currentX + 100}px;opacity:1;`;
      this.SetSeleccionado(item);
    });
  }
  Update = () => {
    if (this.isVisible) {
      const estacionUpdate = Core.Instance.GetDatosEstacion(this.idEstacion);
      if (estacionUpdate.EstaEnLinea()) {
        Object.values(this.#UpdateableElements).forEach((elemento) => {
          /**
           * @type {Signal}
           */
          const signalUpdate = estacionUpdate.ObtenerSignal(
            elemento.mySignal.IdSignal
          );
          switch (signalUpdate.TipoSignal) {
            case EnumTipoSignal.Bomba:
              elemento.setAttribute("style", signalUpdate.GetImagenBombaPanelControl());
              break;
            case EnumTipoSignal.PerillaBomba:
              elemento.innerText = signalUpdate.GetValorPerillaBomba();
              break;
            case EnumTipoSignal.PerillaGeneral:
              elemento.innerText = signalUpdate.GetValorPerillaGeneral();
              break;
          }
        });
      } else
        this.CloseArranqueParo();

    }
  };
  CloseArranqueParo = () => {
    // Logica para cerrar el modal
    this.isVisible = false;
    this.SetIsCarouselCreated(false);
    const $panelArranqueParoContainer = document.querySelector(".arranqueParo__panelControl");
    const $panelArranqueParo = document.querySelector(".arranqueParo__Container");
    const $imgArranqueParo = document.getElementById("imgPanelArranqueParo");
    $panelArranqueParoContainer.style.opacity = "0";
    $panelArranqueParo.style.opacity = "0";
    $panelArranqueParo.style.transform = "translateY(100vh)";
    $imgArranqueParo.setAttribute("src", `${Core.Instance.ResourcesPath}Control/transition_inicio.png?v=${Core.Instance.version}`);
    this.ResetCarrusel();
  };
  ResetCarrusel() {
    this.deleteUpdateElements();
    this.#carruselContainer.innerHTML = "";
    this.#bombaSeleccionada = undefined;
  }
  ObtenerEstadoComando() {
    let estadoAux = EnumEstadoComando.Insertado;
    let timepoIni = new Date().getTime();
    let ticksPerMinute = 1000 * 60;
    let toleranciaMin = 3.5;
    let modalSetted = false;
    let usuario = Login.Instace.userName;
    let idEstacion = this.idEstacion;
    let codigo = this.codigo;
    let textoComando = this.textoComando

    let _interval = setInterval(async () => {

      const result = await Fetcher.Instance.RequestData(
        `${EnumControllerMapeo.READESTADOCOMANDO}?IdProyecto=${Core.Instance.IdProyecto}`,
        RequestType.POST,
        {
          Usuario: `web24-${usuario}`,
          idEstacion: idEstacion,
          Codigo: codigo,
          RegModbus: 2020,
        },
        true
      );

      if (estadoAux == EnumEstadoComando.Leido) {
        if (!modalSetted) {
          ShowModal("El comando se leyó exitosamente para ser ejecutado.", "Estado Comando", false);
          modalSetted = true;
        }
      } else if (estadoAux == EnumEstadoComando.Ejecutado) {
        if (!modalSetted) {
          ShowModal(`El comando ${textoComando} se ejecutó exitosamente.`, "Estado Comando", false);
          clearInterval(_interval);
          modalSetted = true;
        }
      } else if (estadoAux == EnumEstadoComando.Error) {
        if (!modalSetted) {
          ShowModal(`Hubo un error al ejecutar el comando ${textoComando}.`, "Estado Comando", false);
          clearInterval(_interval);
          modalSetted = true;
        }
      }

      if (estadoAux != result.estado) {
        modalSetted = false;
        estadoAux = result.estado;
      }

      if (new Date().getTime() - timepoIni > toleranciaMin * ticksPerMinute) {
        ShowModal(`Ejecutar el comando ${textoComando}, tomó más de lo esperado; Error al ejecutar comando.`, "Estado Comando", false);
        clearInterval(_interval);
      }
    }, 2000);


  }
  //#endregion
}
export { ArranqueParo };
