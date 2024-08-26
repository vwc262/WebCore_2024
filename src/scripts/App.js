import { Core } from "./Core.js";
import { Configuracion } from "../config/config.js";
import { Tabla } from "./Tabla/Tabla.js";
import { EnumNombreProyecto, EnumProyecto } from "./Utilities/Enums.js";
import Perfil from "./Perfil/Perfil.js";
import { EventoCustomizado, EventsManager } from "./Managers/EventsManager.js";
import { Mapa } from "./Mapa/Mapa.js";
import { AdjustSize, ObtenerFormatoTituloProyecto } from "./Utilities/CustomFunctions.js";
import { PerfilPozos } from "./Perfil/PerfilPozos.js";
import { ShowModal } from "./uiManager.js";

class VwcApp {
  projectName = EnumProyecto.PlantasPotabilizadoras;
  constructor() {
    this.isPerfilTipoPozos = EnumNombreProyecto[this.projectName].toLowerCase().includes('lerma');
  }
  async Start() {
    //UIReportes.PrepararChart();
    await Core.Instance.Init(this.projectName); // Espera a que tenga la informacion
    this.version = Core.Instance.version;
    this.IniciarHeader();
    
    const config = Configuracion.GetConfiguracion(Core.Instance.IdProyecto);

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
    if(EnumProyecto.PlantasPotabilizadoras == Core.Instance.IdProyecto){
      const $titleHeader = document.querySelector("#title");
      $titleHeader.classList = `${$titleHeader.classList} Cutzamala_Title`;

      document.body.classList = `${document.body.classList} Cutzamala_Body`;

      const header = document.getElementsByTagName("header")[0]
      header.classList = `${header.classList} Cutzamala_Header`;
      
      const conagua_logos = document.getElementsByClassName("conagua_logos")[0];
      conagua_logos.classList = `${conagua_logos.classList} display_logos_cutzamala`;
      
      const conagua_med_amb_logo = document.getElementById("conagua_med_amb_logo");
      conagua_med_amb_logo.setAttribute("src", `${Core.Instance.ResourcesPath}General/Logo_Medio_Amb_conagua.png?v=${Core.Instance.version}`);
      
      const header__buttons = document.getElementsByClassName("header__buttons")[0];
      header__buttons.classList = `${header__buttons.classList} header__buttons_cutzamala`;

      const particular__header = document.getElementsByClassName("particular__header")[0];
      particular__header.classList = `${particular__header.classList} Cutzamala_particular__header`;
      
      const etiquetaSitioPerfil = document.getElementsByClassName("etiquetaSitioPerfil");
      for(var element of etiquetaSitioPerfil) {
        element.classList = `${element.classList} etiquetaSitioPerfil_Cutzamala`;
      };

      const bottomGlowColumn = document.getElementsByClassName("bottomGlowColumn");
      for(var element of bottomGlowColumn) {
        element.classList = `${element.classList} bottomGlowColumn_Cutzamala`;
      };

      const curved_Row_variables = document.getElementsByClassName("curved-Row-variables");
      for(var element of curved_Row_variables) {
        element.classList = `${element.classList} Cutzamala_curved-Row-variables`;
      };

      const contenedor_resumen = document.getElementsByClassName("contenedor-resumen")[0];
      contenedor_resumen.classList = `${contenedor_resumen.classList} Cutzamala_contenedor-resumen`;

     }
  }

  onLoad() {
    const loadscreen = document.querySelector(".sec-loading");
    loadscreen.style.display = 'none';

    const Content_on_load = document.querySelector(".Content_on_load");
    Content_on_load.style.display = 'flex';
  }

  isApple() {
    return (/iPad|iPhone|iPod/.test(navigator.userAgent));
  }

  IniciarHeader() {
    const titulo = `${ObtenerFormatoTituloProyecto(EnumNombreProyecto[Core.Instance.IdProyecto])}`;
    let $title = document.getElementById('title__page');
    $title.innerText = `VWC - ${titulo}`;

    const $titleHeader = document.querySelector("#title");
    $titleHeader.innerText = titulo;

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
    if (this.isPerfilTipoPozos) {
      PerfilPozos.Instace.create();
    }
    else {
      new Perfil().create(); // Inicio del perfil
    }
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
