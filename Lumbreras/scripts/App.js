import { Core } from "./Core.js";
import { Configuracion } from "../config/config.js";
import { Tabla } from "./Tabla/Tabla.js";
import { EnumNombreProyecto, EnumProyecto } from "./Utilities/Enums.js";
import Perfil from "./Perfil/Perfil.js";
import { EventoCustomizado, EventsManager } from "./Managers/EventsManager.js";
import { Mapa } from "./Mapa/Mapa.js";
import { AdjustSize, ObtenerFormatoTituloProyecto } from "./Utilities/CustomFunctions.js";
import { AppGraficador } from "./reporteador/AppGraficador.js";

class VwcApp {
  projectName = EnumProyecto.Lumbreras;
  constructor() {

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
    const config = Core.Instance.Configuracion;

    const titulo = `${ObtenerFormatoTituloProyecto(EnumNombreProyecto[Core.Instance.IdProyecto])}`;
    let $title = document.getElementById('title__page');
    let $header_image = document.getElementById('header_image');
    $title.innerText = `VWC - ${titulo}`;

    const $titleHeader = document.querySelector("#title");
    $titleHeader.innerText = titulo;

    $header_image.setAttribute("src", `${Core.Instance.ResourcesPath}General/Segiagua.png?v=${Core.Instance.version}`);

  }

  IniciarUI() {

    const $imgHome = document.getElementById("imgHome");
    $imgHome.setAttribute("src", `${Core.Instance.ResourcesPath}Iconos/home.png?v=${Core.Instance.version}`);

    const $imgMapa = document.getElementById("imgMapa");
    $imgMapa.setAttribute("src", `${Core.Instance.ResourcesPath}Iconos/icomapa.png?v=${Core.Instance.version}`);

    const $imgGraficador = document.getElementById("imgGraficador");
    $imgGraficador.setAttribute("src", `${Core.Instance.ResourcesPath}Reportes/graficador.png?v=${Core.Instance.version}`);

    const $imgRegresar = document.getElementById("imgRegresar");
    $imgRegresar.setAttribute("src", `${Core.Instance.ResourcesPath}General/ToPerfil.gif?v=${Core.Instance.version}`);

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

    new Tabla().create(); // Inicio de tabla
    new Perfil().create(); // Inicio del perfil
    new Mapa().create();
    AppGraficador.Instance.Start();

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
