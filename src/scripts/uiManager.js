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
  Particular.Instance.MostrarFallaAc(false);
  const table = document.querySelector(".aside__tabla");
  if (ev.target.nodeName == "DIV") {
    table.style.display = "block";
    [...ev.currentTarget.children].forEach((element) => {
      element.classList.remove("header__active");
    });
    const btnCarruselGraficador = document.querySelector('.btnCarrusel');
    btnCarruselGraficador.style.display = "none";
    const actualTarger = ev.target;
    actualTarger.classList.add("header__active");
    const isParticularActive = Module == EnumModule.Particular;
    const $btnBack = document.querySelector(".header__btnRegresar");
    const $panelBombas = document.querySelector(".arranqueParo__panelControl");
    const $asidetabla = document.querySelector(".aside__tabla");
    $btnBack.removeEventListener('click', Particular.Instance.backParticular);
    $btnBack.removeEventListener('click', backGraficador);
    
    section__home.style.display = "none";
    section__mapa.style.display = "none";
    section__graficador.style.display = "none";
    section__login.style.display = "none";
    section__particular.style.display= "none";


    // section__home.style.zIndex = "5";
    // section__mapa.style.zIndex = "5";
    // section__graficador.style.zIndex = "5";
    // section__login.style.zIndex = "5";
    // section__particular.style.zIndex = "5";

    $datosHeader.style.opacity = "0";
    $datosHeader.style.display = "none";
    $btnBack.style.opacity = "0";
    $titleHeader.innerText = `${ObtenerFormatoTituloProyecto(EnumNombreProyecto[Core.Instance.IdProyecto])}`;
    switch (actualTarger.className) {
      case "headerBtn__Home header__active":
        SetActualModule(isParticularActive ? "Particular" : "Perfil");
        
        // section__home.style.zIndex = isParticularActive ? "5" : "10";
        // section__particular.style.zIndex = isParticularActive ? "10" : "5";

        section__home.style.display= isParticularActive ? "none" : "block";
        section__particular.style.display = isParticularActive ? "block" : "none";

        $datosHeader.style.display = "flex";
        ultimoBotonSeleccionado = actualTarger;
        $asidetabla.style.display = "block";
        $panelBombas.style.pointerEvents = isParticularActive ? "all" : "none";
        if (isParticularActive) {
          Particular.Instance.mostrarDetalles();
          $btnBack.style.opacity = "1";
          $btnBack.addEventListener('click', Particular.Instance.backParticular);
        } else
          CerrarPanelBombas($panelBombas);

        break;
      case "headerBtn__Mapa header__active":
        SetActualModule("Mapa");

        // section__mapa.style.zIndex = "10";
        section__mapa.style.display = "block";

        ultimoBotonSeleccionado = actualTarger;
        $asidetabla.style.display = "block";
        CerrarPanelBombas($panelBombas);
        break;
      case "headerBtn__Graficador header__active":
        SetActualModule("Graficador");
        btnCarruselGraficador.style.display="block";

        // section__graficador.style.zIndex = "10";
        section__graficador.style.display = "block";

        ultimoBotonSeleccionado = actualTarger;
        $btnBack.style.opacity = isReporteadorCreated.secondPhase ? 1 : 0;
        $btnBack.style.pointerEvents = isReporteadorCreated.secondPhase ? 'auto' : "none";
        $btnBack.addEventListener('click', backGraficador);
        $asidetabla.style.display = "none";
        inicializarReporteador();
        CerrarPanelBombas($panelBombas);
        break;
      case "headerBtn__Login header__active":
        // section__login.style.zIndex = "10";
        section__login.style.display = "block";
        table.style.display = "none";
        Login.Instace.create();
        CerrarPanelBombas($panelBombas);
        break;
    }
  }

  function CerrarPanelBombas($panelBombas) {
    $panelBombas.style.pointerEvents = "none";
    $panelBombas.style.opacity = 0;
    ArranqueParo.Instance.CloseArranqueParo();
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
  const $aceptarModal = document.querySelector(".modal__Aceptar");

  $panelControl_Particulares.addEventListener("click", (e) => {
    e.preventDefault();
    ArranqueParo.Instance.Create(Particular.Instance.Estacion.IdEstacion);
  });

  $closeModal.addEventListener("click", (e) => {
    e.preventDefault();
    $modal.classList.remove("modal--show");
  });

  $aceptarModal.addEventListener("click", (e) => {
    e.preventDefault();
    $modal.classList.remove("modal--show");
    location.reload();
  });
}

const ShowModal = (txtToShow, title, flag) => {
  const $modal = document.querySelector(".modal");
  $modal.classList.add("modal--show");
  $modal.querySelector(".modal__title").innerText = title;
  $modal.querySelector(".modal__paragraph").innerText = txtToShow;
  if (flag) {
    $modal.querySelector(".modal__Aceptar").style.display = "block";
    $modal.querySelector(".modal__Aceptar").style.pointerEvents = "auto";
  }
  else{
    {
      $modal.querySelector(".modal__close").style.display = "block";
      $modal.querySelector(".modal__close").style.pointerEvents = "auto";
    }
  }
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
