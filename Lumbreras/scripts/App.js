import { Core } from "./Core.js";
import { Configuracion } from "../config/config.js";
import { Tabla } from "./Tabla/Tabla.js";
import { EnumNombreProyecto, EnumProyecto, EnumTipoHeader } from "./Utilities/Enums.js";
import Perfil from "./Perfil/Perfil.js";
import { EventoCustomizado, EventsManager } from "./Managers/EventsManager.js";
import { Mapa } from "./Mapa/Mapa.js";
import { AdjustSize, ObtenerFormatoTituloProyecto } from "./Utilities/CustomFunctions.js";
import { ShowModal } from "./uiManager.js";

class VwcApp {
  projectName = EnumProyecto.Lumbreras;
  constructor() {
    this.isPerfilTipoPozos = EnumNombreProyecto[this.projectName].toLowerCase().includes('lerma');
  }
  async Start() {

    await Core.Instance.Init(this.projectName); // Espera a que tenga la informacion
    this.version = Core.Instance.version;

    this.IniciarHeader();
    AdjustSize();

    if (this.version != -99) {
      this.IniciarUI();
      this.onLoad();
    }
    else {
      const tabla = document.querySelector(".aside__tabla");
      tabla.remove();

      const buttonHeader = document.querySelector(".header__buttons");
      buttonHeader.remove();

      const containerLoading = document.querySelector(".containerLoading");
      containerLoading.remove();
    }
  }

  onLoad() {
    const Content_on_load = document.querySelector(".Content_on_load");
    Content_on_load.style.display = 'flex';
  }

  isApple() {
    return (/iPad|iPhone|iPod/.test(navigator.userAgent));
  }

  IniciarHeader() {
    const config = Configuracion.GetConfiguracion(Core.Instance.IdProyecto);

    const titulo = `${ObtenerFormatoTituloProyecto(EnumNombreProyecto[Core.Instance.IdProyecto])}`;
    let $title = document.getElementById('title__page');
    let $header_image = document.getElementById('header_image');
    let $headerImagen = document.getElementsByClassName('headerImagen')[0];
    $title.innerText = `VWC - ${titulo}`;

    const $titleHeader = document.querySelector("#title");
    $titleHeader.innerText = titulo;

    $header_image.setAttribute("src", `${Core.Instance.ResourcesPath}General/${config.tipoHeader}.png?v=${Core.Instance.version}`);

  }

  IniciarUI() {

    const $imgHome = document.getElementById("imgHome");
    $imgHome.setAttribute("src", `${Core.Instance.ResourcesPath}Iconos/home.png?v=${Core.Instance.version}`);

    const $imgMapa = document.getElementById("imgMapa");
    $imgMapa.setAttribute("src", `${Core.Instance.ResourcesPath}Iconos/icomapa.png?v=${Core.Instance.version}`);

    const $imgGraficador = document.getElementById("imgGraficador");
    $imgGraficador.setAttribute("src", `${Core.Instance.ResourcesPath}Reportes/graficador.png?v=${Core.Instance.version}`);

    const $imgLogin = document.getElementById("imgLogin");
    $imgLogin.setAttribute("src", `${Core.Instance.ResourcesPath}Control/login_btn.png?v=${Core.Instance.version}`);

    const $imgRegresar = document.getElementById("imgRegresar");
    $imgRegresar.setAttribute("src", `${Core.Instance.ResourcesPath}General/ToPerfil.gif?v=${Core.Instance.version}`);

    const $loginVid1 = document.getElementById("loginVid1");
    $loginVid1.setAttribute("src", `${Core.Instance.ResourcesPath}Control/login_loop.mp4?v=${Core.Instance.version}`);

    const $imgContolPanel = document.getElementById("imgContolPanel");
    $imgContolPanel.setAttribute("src", `${Core.Instance.ResourcesPath}Control/controlPanel.png?v=${Core.Instance.version}`);

    const $imgClose = document.getElementById("imgClose");
    $imgClose.setAttribute("src", `${Core.Instance.ResourcesPath}General/close_nrm.png?v=${Core.Instance.version}`);

    const $imgPanelArranqueParo = document.getElementById("imgPanelArranqueParo");
    $imgPanelArranqueParo.setAttribute("src", `${Core.Instance.ResourcesPath}Control/transition.gif?v=${Core.Instance.version}`);

    const $imgEncender = document.getElementById("imgEncender");
    $imgEncender.style.background = `url(${Core.Instance.ResourcesPath}Control/BTN_ON.png?v=${Core.Instance.version})`

    const $imgModal = document.getElementById("imgModal");
    $imgModal.style.background = `url(${Core.Instance.ResourcesPath}Control/modalbackground.png?v=${Core.Instance.version}) no-repeat`;
    $imgModal.style.backgroundSize = `contain`;

    if (this.isApple()) {
      let html = document.getElementsByTagName('html')[0];

      html.style['-webkit-user-drag'] = 'auto';
      html.style['-moz-user-drag'] = 'auto';
      html.style['-o-user-drag'] = 'auto';
      html.style['-webkit-user-drag'] = 'auto';
    }

    new Tabla().create(); // Inicio de tabla curva
    new Perfil().create(); // Inicio del perfil
    new Mapa().create();

    this.suscribirEventos();
  }

  suscribirEventos() {
    EventsManager.Instance.Suscribirevento('Update', new EventoCustomizado(() => this.update()));
  }

  update() {
    if (Core.Instance.version != this.version) {
      this.version = Core.Instance.version;
      ShowModal("Se ha detectado un cambio de versión", "Cambio de versión", true);
    }
  }
}

export { VwcApp };

window.onresize = () => { AdjustSize(); };
