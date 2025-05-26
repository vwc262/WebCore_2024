import { Particular } from "./Particular/Particular.js";
import { EnumModule } from "./Utilities/Enums.js";

const $btnHeader = document.querySelector(".header__buttons");
const $btnHome = document.querySelector(".headerBtn__Home");

let ultimoBotonSeleccionado = $btnHome;

[...$btnHeader.children].forEach(btn => btn.addEventListener("click", (ev) => {

  let lastTarget = document.getElementsByClassName('header__active')[0];
  lastTarget.classList.remove("header__active");

  const target = ev.target;
  target.classList.add("header__active");

  const isParticularActive = Module == EnumModule.Particular;

  section__home.style.display = "none";
  section__mapa.style.display = "none";
  section__graficador.style.display = "none";
  section__particular.style.display = "none";

  Particular.Instance.MostrarFallaAc(false);

  switch (target.className) {
    case "headerBtn__Home header__active":
      SetActualModule(isParticularActive ? "Particular" : "Perfil");

      section__home.style.display = isParticularActive ? "none" : "block";
      section__particular.style.display = isParticularActive ? "block" : "none";

      ultimoBotonSeleccionado = target;
      $asidetabla.style.display = "block";
      if (isParticularActive) {
        Particular.Instance.mostrarDetalles();
      } else {

      }

      break;
    case "headerBtn__Mapa header__active":
      SetActualModule("Mapa");

      section__mapa.style.display = "block";
      ultimoBotonSeleccionado = target;
      $asidetabla.style.display = "block";
      break;
    case "headerBtn__Graficador header__active":
      SetActualModule("Graficador");

      section__graficador.style.display = "block";
      ultimoBotonSeleccionado = target;
      $asidetabla.style.display = "none";
      break;
  }
}));

function GoHome() {
  $btnHome.click();
}

function GoBack() {
  ultimoBotonSeleccionado?.click();
}

var Module = EnumModule.Perfil;
/**
 *
 * @param {keyof EnumModule} enumModule
 */
const SetActualModule = function (enumModule) {
  Module = EnumModule[enumModule];
};

export { GoHome, GoBack, SetActualModule, Module };
