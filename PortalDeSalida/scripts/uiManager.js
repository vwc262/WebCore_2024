import { EventsManager } from "./Managers/EventsManager.js";
import { Particular } from "./Particular/Particular.js";
import { EnumModule } from "./Utilities/Enums.js";

const $btnHeader = document.querySelector(".header__buttons");
const $btnHome = document.querySelector(".headerBtn__Home");
const headerBtn__Reset = document.getElementsByClassName('headerBtn__Reset')[0];
const headerBtn__Exterior = document.getElementsByClassName('headerBtn__Exterior')[0];
const headerBtn__Subterraneo = document.getElementsByClassName('headerBtn__Subterraneo')[0];

let ultimoBotonSeleccionado = $btnHome;

let divs = [...$btnHeader.children].filter(h => h.tagName == 'DIV');
divs.forEach(btn => btn.addEventListener("click", (ev) => {

  let lastTarget = document.getElementsByClassName('header__active')[0];
  lastTarget.classList.remove("header__active");

  const target = ev.currentTarget;
  target.classList.add("header__active");

  // const isParticularActive = Module == EnumModule.Particular;

  // section__home.style.display = "none";
  // section__mapa.style.display = "none";
  // section__graficador.style.display = "none";
  // // section__particular.style.display = "none";

  // headerBtn__Reset.style.display = "none";
  // headerBtn__Exterior.style.display = "none";
  // headerBtn__Subterraneo.style.display = "none";

  // Particular.Instance.MostrarFallaAc(false);

  switch (target.className) {
    case "headerBtn__Home header__active":
      SetActualModule("Perfil");
      HiddenCanvas();
      HiddenCameras();

      section__home.style.display = "block";
      ultimoBotonSeleccionado = target;

      break;

    case "headerBtn__Mapa header__active":
      SetActualModule("Mapa");
      HiddenCanvas();
      HiddenCameras();

      section__mapa.style.display = "block";
      ultimoBotonSeleccionado = target;
      break;

    case "headerBtn__Graficador header__active":
      SetActualModule("Graficador");
      HiddenCanvas();
      HiddenCameras();

      section__graficador.style.display = "block";
      ultimoBotonSeleccionado = target;
      break;

    case "headerBtn__Reset header__active":
      HiddenCameras();
      EventsManager.Instance.EmitirEvento("reset_Camara");

      ultimoBotonSeleccionado = target;
      break;

    case "headerBtn__Exterior header__active":
    case "headerBtn__Subterraneo header__active":
      let isExterior = target.className.includes('headerBtn__Exterior');

      headerBtn__Reset.style.display = "block";
      headerBtn__Exterior.style.display = "block";
      headerBtn__Subterraneo.style.display = "block";
      // section__particular.style.display = "block";
      // Particular.Instance.setParticularScene(isExterior);
      break
  }
}));

function GoHome() {
  $btnHome.click();
}

function GoBack() {
  ultimoBotonSeleccionado?.click();
}

function HiddenCameras() {
  headerBtn__Reset.style.display = "none";
  headerBtn__Exterior.style.display = "none";
  headerBtn__Subterraneo.style.display = "none";
}

function HiddenCanvas() {
  section__home.style.display = "none";
  section__mapa.style.display = "none";
  section__graficador.style.display = "none";
  // section__particular.style.display = "none";
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
