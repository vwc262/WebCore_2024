import { ArranqueParo } from "./ArranqueParo/ArranqueParo.js";
import Login from "./Entities/Login/Login.js";
import { Particular } from "./Particular/Particular.js";
import { EnumModule } from "./Utilities/Enums.js";

const $btnHeader = document.querySelector(".header__buttons");
const $btnHome = document.querySelector(".headerBtn__Home");
const $datosHeader = document.querySelector(".header__datos-particular");
const $titleHeader = document.querySelector("#title");

let ultimoBotonSeleccionado = $btnHome;

$btnHeader.addEventListener("click", (ev) => {
  const table = document.querySelector(".aside__tabla");
  table.style.display = "block";
  if (ev.target.nodeName == "DIV") {
    [...ev.currentTarget.children].forEach((element) => {
      element.classList.remove("header__active");
    });
    const actualTarger = ev.target;
    actualTarger.classList.add("header__active");
    const isParticularActive = Module == EnumModule.Particular;
    const $btnBack = document.querySelector(".header__btnRegresar");
    switch (actualTarger.className) {
      case "headerBtn__Home header__active":
        SetActualModule(isParticularActive ? "Particular" : "Perfil");
        section__home.style.zIndex = isParticularActive ? "5" : "10";
        section__mapa.style.zIndex = "5";
        section__graficador.style.zIndex = "5";
        section__login.style.zIndex = "5";
        section__particular.style.zIndex = isParticularActive ? "10" : "5";
        ultimoBotonSeleccionado = actualTarger;
        $btnBack.style.opacity = "0";
        $titleHeader.innerText = "Tanques Padierna";
        $datosHeader.style.opacity = "0";
        break;
      case "headerBtn__Mapa header__active":
        SetActualModule("Mapa");
        section__home.style.zIndex = "5";
        section__mapa.style.zIndex = "10";
        section__graficador.style.zIndex = "5";
        section__login.style.zIndex = "5";
        section__particular.style.zIndex = "5";
        ultimoBotonSeleccionado = actualTarger;
        $btnBack.style.opacity = "0";
        $datosHeader.style.opacity = "0";
        $titleHeader.innerText = "Tanques Padierna";
        break;
      case "headerBtn__Graficador header__active":
        SetActualModule("Graficador");
        section__home.style.zIndex = "5";
        section__mapa.style.zIndex = "5";
        section__graficador.style.zIndex = "10";
        section__login.style.zIndex = "5";
        section__particular.style.zIndex = "5";
        ultimoBotonSeleccionado = actualTarger;
        $btnBack.style.opacity = "0";
        $datosHeader.style.opacity = "0";
        $titleHeader.innerText = "Tanques Padierna";
        break;
      case "headerBtn__Login header__active":
        section__home.style.zIndex = "5";
        section__mapa.style.zIndex = "5";
        section__graficador.style.zIndex = "5";
        section__particular.style.zIndex = "5";
        section__login.style.zIndex = "10";
        table.style.display = "none";
        $btnBack.style.opacity = "0";
        $datosHeader.style.opacity = "0";
        $titleHeader.innerText = "Tanques Padierna";
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
    // $modal.classList.add("modal--show");
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

Modal();

export { GoHome, GoBack, ShowModal, SetActualModule, Module };
