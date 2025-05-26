import { Configuracion } from "../../config/config.js";
import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import Signal from "../Entities/Signal.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { Clamp, CreateElement } from "../Utilities/CustomFunctions.js";
import {
  EnumModule,
  EnumTipoSignal,
  EnumEnlace,
  EnumProyecto,
  EnumSemaforo,
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

    this.headerBtn__Exterior = null;
    this.headerBtn__Subterraneo = null;

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
      const estacionUpdate = Core.Instance.GetDatosEstacion(
        this.Estacion.IdEstacion
      );

      this.$headerDate.innerText = estacionUpdate.ObtenerFecha();
      this.setEnlaceParticular(estacionUpdate);

      estacionUpdate.Signals.forEach((signal) => {
        let signalActualizar =
          this.HTMLUpdateElements[`valor_nivel_${signal.IdSignal}`];

        if (signalActualizar) {
          signalActualizar.innerHTML = `${signal.GetValorString(false, true)}`;
          signalActualizar.style.color = signal.GetColorSemaforo('floralwhite');
        }

        let $imgNivelAgua = this.HTMLUpdateElements[`particular_nivel_${signal.IdSignal}`];
        if ($imgNivelAgua) {
          $imgNivelAgua.setAttribute("src", estacionUpdate.ObtenerRenderNivelOBomba(signal, "Particular"));

          if (signal.DentroRango == 1) $imgNivelAgua.classList.add('turbulence');
          else $imgNivelAgua.classList.remove('turbulence')
        }

        let barraNivel = this.HTMLUpdateElements[`barraNivel_${signal.IdSignal}`];
        if (barraNivel) this.setBaraNivel(barraNivel, signal);
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

    this.headerBtn__Exterior = document.getElementsByClassName('headerBtn__Exterior')[0];
    this.headerBtn__Exterior.style.display = 'block';
    this.headerBtn__Subterraneo = document.getElementsByClassName('headerBtn__Subterraneo')[0];


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
    this.createNivelesTexto();

    // crear imagenes niveles
    this.createNivelesImagen();

    this.Update();
  }

  backParticular = () => {
    SetActualModule("Perfil");
    GoHome();
  }

  createNivelesTexto() {
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

        const cristalBarra = CreateElement({
          nodeElement: "div",
          attributes: {
            class: "cristalBarra",
            style: `background: url(${Core.Instance.ResourcesPath}General/Barra_Nivel.png?v=${Core.Instance.version}); background-size: 100% 100%; background-repeat: no-repeat`
          },
        });

        barraContainer.append(barraNivel, cristalBarra);
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
            id: `valor_nivel_${nivel.IdSignal}`,
          },
          innerHTML: `${nivel.GetValorString(false, true)}`,
        });

        const etiquetaAltura = CreateElement({
          nodeElement: "div",
          attributes: {
            class: "etiqueta__Altura",
          },
          innerHTML: ` [m], altura: ${nivel.Semaforo?.Altura || 'ND'} [m]`,
        });

        this.alojarElementoDinamico([barraNivel, etiquetaValor]);

        signalItem.append(etiquetaNombre, etiquetaValor, etiquetaAltura);
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

    let max_height = 180;
    let altura = signal.Semaforo?.Altura || 1.0;
    let amount = Clamp((signal.Valor / altura) * max_height, 0, max_height);
    let color = signal.GetColorSemaforo();

    barraNivel.style.height = `${amount + 20}px`;
    barraNivel.style.backgroundColor = color;
  }

  setEnlaceParticular(estacion) {

    const estado = estacion.ObtenerEstadoEnlace();

    this.$headerStatus.innerHTML = estado.textoEnlace;
    this.$headerStatus.style.color = estado.color;
  }

  createNivelesImagen() {
    let estacionUpdate = Core.Instance.GetDatosEstacion(this.Estacion.IdEstacion);
    const $nivelContainer = document.getElementById("particular__aguaNivel");
    $nivelContainer.innerHTML = "";

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
