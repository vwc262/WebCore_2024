import { Core } from "./Core.js";
import { Configuracion } from "../config/config.js";
import { Tabla } from "./Tabla/Tabla.js";
import { EnumNombreProyecto, EnumProyecto } from "./Utilities/Enums.js";
import Perfil from "./Perfil/Perfil.js";
import { EventoCustomizado, EventsManager } from "./Managers/EventsManager.js";
import { Mapa } from "./Mapa/Mapa.js";
import { AdjustSize, ObtenerFormatoTituloProyecto } from "./Utilities/CustomFunctions.js";
import { AppGraficador } from "./reporteador/AppGraficador.js";
import News from "./news/news.js";

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


    this.inicializarBotonHeader("imgHome", 'home');
    this.inicializarBotonHeader("imgMapa", 'icomapa');
    this.inicializarBotonHeader("imgGraficador", 'graficador');
    this.inicializarBotonHeader("imgExterior", 'exterior');
    this.inicializarBotonHeader("imgSubterraneo", 'subterraneo');

    if (this.isApple()) {
      let html = document.getElementsByTagName('html')[0];

      html.style['-webkit-user-drag'] = 'auto';
      html.style['-moz-user-drag'] = 'auto';
      html.style['-o-user-drag'] = 'auto';
      html.style['-webkit-user-drag'] = 'auto';
    }

    new Tabla().create(); // Inicio de tabla
    const perfil = new Perfil().create(); // Inicio del perfil
    new Mapa().create();
    new News().Init();

    AppGraficador.Instance.Start();

    this.suscribirEventos();
  }

  inicializarBotonHeader(id, fondo){
    const navButton = document.getElementById(id);
    navButton.setAttribute("src", `${Core.Instance.ResourcesPath}Iconos/${fondo}.png?v=${Core.Instance.version}`);
    navButton.addEventListener('mouseover', (e) => { e.target.setAttribute("src", `${Core.Instance.ResourcesPath}Iconos/${fondo}_over.png?v=${Core.Instance.version}`); });
    navButton.addEventListener('mouseleave', (e) => { e.target.setAttribute("src", `${Core.Instance.ResourcesPath}Iconos/${fondo}.png?v=${Core.Instance.version}`); });
  }

  suscribirEventos() {
    EventsManager.Instance.Suscribirevento('Update', new EventoCustomizado(() => this.update()));
  }

  update() {

  }
}

export { VwcApp };

window.onresize = () => { AdjustSize(); };
