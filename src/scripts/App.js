import { Core } from "./Core.js";
import { Tabla } from "./Tabla/Tabla.js";
import { EnumNombreProyecto, EnumProyecto } from "./Utilities/Enums.js";
import Perfil from "./Perfil/Perfil.js";
import { Mapa } from "./Mapa/Mapa.js";
import { AdjustSize, ObtenerFormatoTituloProyecto } from "./Utilities/CustomFunctions.js";

class VwcApp {

  async Start() {
    await Core.Instance.Init(EnumProyecto.GustavoAMadero); // Espera a que tenga la informacion
    this.IniciarUI();
  }

  IniciarUI() {

    let title = document.getElementById('title__page');
    title.innerText = `VWC - ${ObtenerFormatoTituloProyecto(EnumNombreProyecto[Core.Instance.IdProyecto])}`;

    const $titleHeader = document.querySelector("#title");
    $titleHeader.innerText = `${ObtenerFormatoTituloProyecto(EnumNombreProyecto[Core.Instance.IdProyecto])}`;

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

    new Tabla().create(); // Inicio de tabla curva
    new Perfil().create(); // Inicio del perfil
    new Mapa().create();

    AdjustSize();
  }
}

export { VwcApp };

window.onresize = () => { AdjustSize(); };
