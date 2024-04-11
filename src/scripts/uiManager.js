import { ArranqueParo } from "./ArranqueParo/ArranqueParo.js";
import Login from "./Entities/Login/Login.js";
import { Particular } from "./Particular/Particular.js";

const $btnHeader = document.querySelector(".header__buttons");
const btnHome = document.querySelector(".headerBtn__Home");

let ultimoBotonSeleccionado = btnHome;

$btnHeader.addEventListener("click", (ev) => {
  const table = document.querySelector(".aside__tabla");
  table.style.display = "block";
  if (ev.target.nodeName == "DIV") {
    [...ev.currentTarget.children].forEach((element) => {
      element.classList.remove("header__active");
    });
    const actualTarger = ev.target;
    actualTarger.classList.add("header__active");
    switch (actualTarger.className) {
      case "headerBtn__Home header__active":
        section__home.style.zIndex = "10";
        section__mapa.style.zIndex = "5";
        section__graficador.style.zIndex = "5";
        section__login.style.zIndex = "5";
        section__particular.style.zIndex = "5";
        ultimoBotonSeleccionado = actualTarger;
        break;
      case "headerBtn__Mapa header__active":
        section__home.style.zIndex = "5";
        section__mapa.style.zIndex = "10";
        section__graficador.style.zIndex = "5";
        section__login.style.zIndex = "5";
        section__particular.style.zIndex = "5";
        ultimoBotonSeleccionado = actualTarger;
        break;
      case "headerBtn__Graficador header__active":
        section__home.style.zIndex = "5";
        section__mapa.style.zIndex = "5";
        section__graficador.style.zIndex = "10";
        section__login.style.zIndex = "5";
        section__particular.style.zIndex = "5";
        ultimoBotonSeleccionado = actualTarger;
        break;
      case "headerBtn__Login header__active":
        section__home.style.zIndex = "5";
        section__mapa.style.zIndex = "5";
        section__graficador.style.zIndex = "5";
        section__particular.style.zIndex = "5";
        section__login.style.zIndex = "10";
        table.style.display = "none";
        Login.Instace.create();
        break;
    }
  }
});

function GoHome() {
  btnHome.click();
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

Modal();

export { GoHome, GoBack, ShowModal };
