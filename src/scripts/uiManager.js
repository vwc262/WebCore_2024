import { ArranqueParo } from "./ArranqueParo/ArranqueParo.js";
import { Core } from "./Core.js";
import Login from "./Entities/Login/Login.js";
import { Particular } from "./Particular/Particular.js";
import { FetcherGraficador } from "./Reporteador/Fetcher.js";
import { inicializarReporteador, isReporteadorCreated } from "./Reporteador/Reportes.js";
import UIControlador from "./Reporteador/videoUI.js";
import controladorVideo from "./Reporteador/videos.js";
import { ObtenerFormatoTituloProyecto } from "./Utilities/CustomFunctions.js";
import { EnumModule, EnumNombreProyecto } from "./Utilities/Enums.js";

const $btnHeader = document.querySelector(".header__buttons");
const $btnHome = document.querySelector(".headerBtn__Home");
const $datosHeader = document.querySelector(".header__datos-particular");
const $titleHeader = document.querySelector("#title");

let ultimoBotonSeleccionado = $btnHome;

$btnHeader.addEventListener("click", (ev) => {
  const table = document.querySelector(".aside__tabla");
  if (ev.target.nodeName == "DIV") {
    table.style.display = "block";
    [...ev.currentTarget.children].forEach((element) => {
      element.classList.remove("header__active");
    });
    const actualTarger = ev.target;
    actualTarger.classList.add("header__active");
    const isParticularActive = Module == EnumModule.Particular;
    const $btnBack = document.querySelector(".header__btnRegresar");
    const $panelBombas = document.querySelector(".arranqueParo__panelControl");
    const $asidetabla = document.querySelector(".aside__tabla");
    $btnBack.removeEventListener('click', Particular.Instance.backParticular);
    $btnBack.removeEventListener('click', backGraficador);
    section__home.style.zIndex = "5";
    section__mapa.style.zIndex = "5";
    section__graficador.style.zIndex = "5";
    section__login.style.zIndex = "5";
    section__particular.style.zIndex = "5";
    $datosHeader.style.opacity = "0";
    $datosHeader.style.display = "none";
    $btnBack.style.opacity = "0";
    $titleHeader.innerText = `${ObtenerFormatoTituloProyecto(EnumNombreProyecto[Core.Instance.IdProyecto])}`;
    $panelBombas.style.pointerEvents = "none";
    switch (actualTarger.className) {
      case "headerBtn__Home header__active":
        SetActualModule(isParticularActive ? "Particular" : "Perfil");
        section__home.style.zIndex = isParticularActive ? "5" : "10";
        section__particular.style.zIndex = isParticularActive ? "10" : "5";
        ultimoBotonSeleccionado = actualTarger;
        $asidetabla.style.display = "block";
        $panelBombas.style.pointerEvents = isParticularActive ? "all" : "none";
        if (isParticularActive){
          $btnBack.style.opacity = "1";
          $btnBack.addEventListener('click', Particular.Instance.backParticular);
        }
        break;
      case "headerBtn__Mapa header__active":
        SetActualModule("Mapa");
        section__mapa.style.zIndex = "10";
        ultimoBotonSeleccionado = actualTarger;
        $asidetabla.style.display = "block";
        break;
      case "headerBtn__Graficador header__active":
        SetActualModule("Graficador");
        section__graficador.style.zIndex = "10";
        ultimoBotonSeleccionado = actualTarger;
        $btnBack.style.opacity = isReporteadorCreated.secondPhase ? 1 : 0;
        $btnBack.style.pointerEvents = isReporteadorCreated.secondPhase ? 'auto' : "none";
        $btnBack.addEventListener('click', backGraficador);
        $asidetabla.style.display = "none";
        inicializarReporteador();
        break;
      case "headerBtn__Login header__active":
        section__login.style.zIndex = "10";
        table.style.display = "none";
        Login.Instace.create();
        break;
    }
  }
});

function GoHome() {
  $btnHome.click();
}

function GoBack() {
  ultimoBotonSeleccionado?.click();
}

function Modal() {
  const $panelControl_Particulares = document.querySelector(
    ".particular__panelControl"
  );

  const $modal = document.querySelector(".modal");
  const $closeModal = document.querySelector(".modal__close");

  $panelControl_Particulares.addEventListener("click", (e) => {
    e.preventDefault();
    ArranqueParo.Instance.Create(Particular.Instance.Estacion.IdEstacion);
  });

  $closeModal.addEventListener("click", (e) => {
    e.preventDefault();
    $modal.classList.remove("modal--show");
  });
}

const ShowModal = (txtToShow, title) => {
  const $modal = document.querySelector(".modal");
  $modal.classList.add("modal--show");
  $modal.querySelector(".modal__title").innerText = title;
  $modal.querySelector(".modal__paragraph").innerText = txtToShow;
};

var Module = EnumModule.Perfil;
/**
 *
 * @param {keyof EnumModule} enumModule
 */
const SetActualModule = function (enumModule) {
  Module = EnumModule[enumModule];
};


const backGraficador = () => {
  const $btnBack = document.querySelector(".header__btnRegresar");
  $btnBack.style.opacity = 0;
  $btnBack.style.pointerEvents = "none";
  UIControlador.hideUIimmediately(Object.values(UIControlador.graficaUI));
  document.querySelector(".sinHistoricos").style.opacity = 0;
  controladorVideo.initVideo(
    // URL del video a cargar
    `${FetcherGraficador.getImage(EnumNombreProyecto[Core.Instance.IdProyecto], 'Reportes', '12-Cortinilla_Center_Return', 'mp4')}`,
    // Función para mostrar la interfaz de usuario del video
    UIControlador.showUIVideoInit
  );
  isReporteadorCreated.secondPhase = false;

}

Modal();

export { GoHome, GoBack, ShowModal, SetActualModule, Module };
