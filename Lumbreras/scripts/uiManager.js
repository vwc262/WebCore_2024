import { Core } from "./Core.js";
import { Particular } from "./Particular/Particular.js";
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

    const actualTarger = ev.target;
    actualTarger.classList.add("header__active");
    const isParticularActive = Module == EnumModule.Particular;
    const $btnBack = document.querySelector(".header__btnRegresar");
    const $asidetabla = document.querySelector(".aside__tabla");
    $btnBack.removeEventListener('click', Particular.Instance.backParticular);

    section__home.style.display = "none";
    section__mapa.style.display = "none";
    section__graficador.style.display = "none";
    section__particular.style.display = "none";

    $datosHeader.style.opacity = "0";
    $datosHeader.style.display = "none";
    $btnBack.style.opacity = "0";
    $titleHeader.innerText = `${ObtenerFormatoTituloProyecto(EnumNombreProyecto[Core.Instance.IdProyecto])}`;
    switch (actualTarger.className) {
      case "headerBtn__Home header__active":
        SetActualModule(isParticularActive ? "Particular" : "Perfil");

        section__home.style.display = isParticularActive ? "none" : "block";
        section__particular.style.display = isParticularActive ? "block" : "none";

        $datosHeader.style.display = "flex";
        ultimoBotonSeleccionado = actualTarger;
        $asidetabla.style.display = "block";
        if (isParticularActive) {
          Particular.Instance.mostrarDetalles();
          $btnBack.style.opacity = "1";
          $btnBack.addEventListener('click', Particular.Instance.backParticular);
        } else {

        }

        break;
      case "headerBtn__Mapa header__active":
        SetActualModule("Mapa");

        section__mapa.style.display = "block";
        ultimoBotonSeleccionado = actualTarger;
        $asidetabla.style.display = "block";
        break;
      case "headerBtn__Graficador header__active":
        SetActualModule("Graficador");

        section__graficador.style.display = "block";
        ultimoBotonSeleccionado = actualTarger;
        $asidetabla.style.display = "none";
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
  
  const $modal = document.querySelector(".modal");
  const $closeModal = document.querySelector(".modal__close");
  const $aceptarModal = document.querySelector(".modal__Aceptar");

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
  else {
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

Modal();

export { GoHome, GoBack, ShowModal, SetActualModule, Module };
