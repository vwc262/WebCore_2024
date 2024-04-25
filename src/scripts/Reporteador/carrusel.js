// Importa las variables y funciones necesarias desde otros archivos
import { sitiosInfo } from "./Reportes.js"; // Importa la variable sitiosInfo desde Main.js
import UIReportes from "./UIReportes.js";
import { GhostVariable } from "./graficar.js";
import { setElementProperty } from "./utilities.js"; // Importa la función setElementProperty desde utilities.js
import { FetcherGraficador } from "./Fetcher.js";
import { projectName } from "./Reportes.js";

// Variable global para el movimiento del carrusel
let movimiento = 0;

// Definir la correspondencia entre TipoSignal y la ruta de la imagen
const tipoSignalImagenMap = {
  1: `nivel`, // Nivel
  2: `presion`, // Presion
  3: `gasto`, // Gasto
  4: `totalizado`, // Totalizado
  5: `valvulaflotador`, // ValvulaAnalogica
  6: `valvulaflotador`, // ValvulaDiscreta
  7: `bomba`, // Bomba
  // 8: `nivel`, // PerillaBomba (no se grafican)
  // 9: `nivel`, // PerillaGeneral (no se grafican)
  // 10: `voltaje`, // Voltaje (no se grafican)
  // 11: `enlace`, // Enlace (no se grafican)
  // 12: `nivel`, // FallaAC (no se grafican)
  // 13: `tiempo`, // Tiempo (no se grafican)
  // 14: `nivel`, // Mantenimiento (no se grafican)
  // 15: `nivel`, // Puerta Abierta (no se grafican)
};

const threeSignals = [740, 135, 18, 135, 362, -19.9134];
const twoSignals = [362, -19.9134, 362, 210];

const coloresSignals = [
  "#2E8B57",
  "#4682B4",
  "#ADFF2F",
  "#CD5C5C",
  "#C71585",
  "#483D8B",
  "#CFCFCF",
];
const rotates = [
  "hue-rotate(323deg)",
  "hue-rotate(0deg)",
  "hue-rotate(235deg)",
  "hue-rotate(176deg)",
  "hue-rotate(114deg)",
  "hue-rotate(74deg)",
  "hue-rotate(0deg)",
];

var SitioSeleccionado = {};

// Función para crear las variables en función de los datos proporcionados
function CreateVariables(index, Sitio) {
  SitioSeleccionado = Sitio;
  // Obtiene referencias a los elementos del DOM
  const signalsContainer = sitiosInfo[index].SignalsDescriptionContainer; // Contenedor de señales del sitio web
  const variablesContainer = document.querySelector(".variables__Container"); // Contenedor de variables
  const variablesContainerMain = document.querySelector(
    ".carrusel-Main__Container"
  ); // Contenedor de variables
  const btnMoverContainer = document.querySelector(".btnCarrusel"); // Botón de control del carrusel

  if (signalsContainer.length > 0) {
    // Limpia el contenedor de variables
    clearVariablesContainer(variablesContainer);
    // Crea elementos HTML para cada señal en el contenedor de variables
    const totalSignals = createVariableElements(
      variablesContainer,
      signalsContainer
    );
    //const signalCount = element.querySelector(".variableSignal");

    if (totalSignals >= 4) {
      // Configura los controles del carrusel
      setupCarouselControls(signalsContainer.length);
      // Mueve el carrusel a la posición inicial
      btnMoverContainer.style.opacity = "1";
      btnMoverContainer.style.pointerEvents = "auto";
      moveCarousel();
    } else {
      setSignalsCarousel();
      btnMoverContainer.style.opacity = "0";
      btnMoverContainer.style.pointerEvents = "none";
    }
    updateColors();

    // Establece la opacidad y eventos del botón de mover carrusel
    variablesContainerMain.style.opacity = "1";
    variablesContainer.style.pointerEvents = "auto";
  } else {
    variablesContainerMain.style.opacity = "0";
    variablesContainer.style.pointerEvents = "none";
  }
}

// Función para limpiar el contenedor de variables
function clearVariablesContainer(container) {
  container.innerHTML = "";
}

// Función para crear elementos HTML para cada señal en el contenedor de variables
function createVariableElements(container, signalsByType) {
  let tolalSignals = 0;
  signalsByType.forEach((signalByType, index) => {
    signalByType.SignalsDescription.forEach((signal) => {
      // Agregar el ID basado en el TipoSignal de la señal actual
      const tipoSignal = signalByType.TipoSignal;
      // Verificar si hay una imagen correspondiente para este tipo de señal
      if (tipoSignal in tipoSignalImagenMap) {
        tolalSignals++;
        const divElement = document.createElement("div");
        const holo = document.createElement("div");
        holo.setAttribute("class", "holo");
        // divElement.setAttribute("idEstacion", `${SitioSeleccionado.Id}`);
        divElement.className = `variableSignal variable_${signal.IdSignal}`;
        divElement.setAttribute("signal", signal.IdSignal);

        // divElement.setAttribute("idSignal", `${signal.IdSignal}`);

        container.appendChild(divElement);

        // Agrega un evento de clic a cada elemento .variableSignal
        divElement.addEventListener("pointerdown", (ev) => {
          // Aquí puedes colocar el código que deseas ejecutar cuando se haga clic en cada elemento
          CreateSignalItem(signal, SitioSeleccionado.Id);
          cloneImageSignal(divElement, ev);
        });

        divElement.addEventListener("pointerup", () => {
          // Valida si la signal existe para mover el ghost
          if (
            UIReportes.idSignalsAGraficar.find(
              (signalSel) => signalSel.IdSignal == signal.IdSignal
            ) != undefined
          )
            moveImgClon();
          else disapir();
          // Cambia los colores de las dignals
          updateColors();
        });

        const nombreSignal = signal.Nombre;
        // Establecer el fondo del div con la imagen correspondiente
        divElement.style.background = `url(${FetcherGraficador.getImage(
          projectName,
          "Reportes",
          tipoSignalImagenMap[tipoSignal],
          "png"
        )})`;
        divElement.setAttribute("sname", nombreSignal); // Se lee desde CSS .variableSignal::after
        divElement.appendChild(holo);
      }
    });
  });
  return tolalSignals;
}

function moveImgClon() {
  if (UIReportes.idSignalsAGraficar.length <= 6) {
    var imgClon = document.querySelector(".imgClon");
    // Obtener el destino
    var destinoDeVariable = document.querySelector(".signalContent");
    var coordsDestino = destinoDeVariable.getBoundingClientRect();
    imgClon.style.transition = "none";
    imgClon.style.opacity = 1;
    imgClon.style.transform = `scale(${1}, ${1})`;
    imgClon.style.transition = "all 0.6s ease";
    imgClon.style.left = 1420  + "px";
    imgClon.style.top = 350 + "px";
    setTimeout(() => {
      disapir();
    }, 500);
  }
}

// Funcion para escalar la imagen de la signal
function disapir() {
  var imgClon = document.querySelector(".imgClon");
  imgClon.style.transform = `scale(${1}, ${0})`; // Escala la imagen de la signal
  imgClon.style.opacity = 0; // Oculta la imagen de la signal  
}

function cloneImageSignal(divElement, ev) {
  // buscar la imagen clon  
  var imgClon = document.querySelector(".imgClon");
  var bodyScale = parseFloat(document.body.style.transform.split("(")[1].replace(")",""));
  const difX = 1920 / (1920 * bodyScale);  
  imgClon.style.transition = "none";
  imgClon.style.background = divElement.style.background;
  imgClon.style.opacity = 1;
  imgClon.style.width = "200px";
  imgClon.style.height = "200px";
  imgClon.style.position = "absolute";
  imgClon.style.zIndex = "12";
  imgClon.style.left =  -100 + ev.x * difX  + "px";
  imgClon.style.top =  -100 + ev.y * difX + "px";
  imgClon.style.transform = `scale(${1}, ${1})`;
  imgClon.style.pointerEvents = "none";
}

// Configura los controles del carrusel
function setupCarouselControls(totalSignals) {
  const btnNext = document.getElementById("next");
  const btnPrev = document.getElementById("prev");
  const btnCerrarModal = document.getElementById("closeModal");

  asignarEventos(
    ["pointerdown", "pointerup"],
    [btnNext, btnPrev],
    totalSignals
  );

  btnCerrarModal.removeEventListener("click", cerrarModal);
  btnCerrarModal.addEventListener("click", cerrarModal);
}

function cerrarModal() {
  const btnCerrarModal = document.querySelector(".modalValidation");
  btnCerrarModal.style.pointerEvents = "none";
  btnCerrarModal.style.opacity = 0;
}

// Funcion para asignar los eventos del boton que mueve las Signals
function asignarEventos(arregloDeEventos, arregloDeElementos, parametros) {
  arregloDeElementos.forEach((element) => {
    arregloDeEventos.forEach((evento) => {
      element.removeEventListener(evento, onClickCarousel);
      element.addEventListener(evento, onClickCarousel);
      element.total = parametros;
    });
  });
  updateColors();
}

// Función para mover el carrusel
function moveCarousel() {
  // Obtiene todas las variables y el contenedor del carrusel del DOM
  const variables = document.querySelectorAll(".variableSignal"); // Selección de todos los elementos con la clase "variableSignal"
  const container = document.querySelector(".variables__Container"); // Selección del contenedor de variables del carrusel
  const step = (360 * (Math.PI / 180)) / variables.length; // Calcula el ángulo de cada variable en radianes
  const dimensions = container.getBoundingClientRect(); // Obtiene las dimensiones y posición del contenedor de variables en relación con la ventana del navegador
  var bodyScale = parseFloat(document.body.style.transform.split("(")[1].replace(")",""));
  

  // Itera sobre todas las variables para calcular y establecer su posición en el carrusel
  variables.forEach((variable, index) => {
    // Calcula la posición X e Y de la variable en función de su índice y el movimiento actual del carrusel
    const widthMedios = (dimensions.width / bodyScale) * 0.4; // Mitad del ancho del contenedor de variables
    const hegihtMedios = (dimensions.height / bodyScale) * 0.4; // Mitad de la altura del contenedor de variables
    const positionX =
      widthMedios * Math.cos(step * (index - movimiento)) + widthMedios; // Calcula la posición X usando la fórmula de la circunferencia
    const positionY =
      hegihtMedios * Math.sin(step * (index - movimiento)) + hegihtMedios; // Calcula la posición Y usando la fórmula de la circunferencia
    // Establece las propiedades CSS del elemento div para posicionarlo en el carrusel
    setElementProperty([variable], {
      position: "absolute", // Posicionamiento absoluto
      left: `${positionX}px`, // Posición horizontal
      top: `${positionY}px`, // Posición vertical
      width: "200px", // Ancho del elemento
      height: "200px", // Altura del elemento
      cursor: "pointer", // Cambia el cursor cuando se pasa sobre el elemento
      backgroundSize: "contain", // Ajusta el tamaño del background dependiendo del contenedor
      backgroundRepeat: "no-repeat", // Evita que el background se repita
      "z-index": "11",
    });
    variable.style.setProperty("--coordY", positionY >= 135 ? "195px" : "0px");
    variable.style.setProperty("--coordX", "65px");
  });
}

function setSignalsCarousel() {
  // Obtiene todas las variables y el contenedor del carrusel del DOM
  const variables = document.querySelectorAll(".variableSignal"); // Selección de todos los elementos con la clase "variableSignal"
  let i = 0;

  // Itera sobre todas las variables para calcular y establecer su posición en el carrusel
  variables.forEach((variable, index) => {
    let positionX = 0;
    let positionY = 0;
    if (variables.length == 3) {
      positionX = threeSignals[i];
      positionY = threeSignals[i + 1];
      i = i + 2;
    }
    if (variables.length == 2) {
      positionX = twoSignals[i];
      positionY = twoSignals[i + 1];
      i = i + 2;
    }
    // Establece las propiedades CSS del elemento div para posicionarlo en el carrusel
    setElementProperty([variable], {
      position: "absolute", // Posicionamiento absoluto
      left: `${positionX}px`, // Posición horizontal
      top: `${positionY}px`, // Posición vertical
      width: "200px", // Ancho del elemento
      height: "200px", // Altura del elemento
      cursor: "pointer", // Cambia el cursor cuando se pasa sobre el elemento
      backgroundSize: "contain", // Ajusta el tamaño del background dependiendo del contenedor
      backgroundRepeat: "no-repeat", // Evita que el background se repita
      "z-index": "11",
    });
    variable.style.setProperty("--coordY", positionY >= 135 ? "195px" : "0px");
    variable.style.setProperty("--coordX", "65px");
  });
}

// Función para manejar los eventos de hacer clic en los botones de siguiente y anterior
function onClickCarousel(e) {
  const documentButton = document.querySelector(".btnCarrusel");
  let urlButton = "";
  // Incrementa o decrementa el movimiento dependiendo de la dirección
  movimiento += (e.currentTarget.id == "next" ? 1 : -1) % e.currentTarget.total;

  switch (e.type) {
    case "pointerdown":
      urlButton = `${FetcherGraficador.getImage(
        projectName,
        "Reportes",
        `perilla_push_${e.currentTarget.id == "next" ? "l" : "r"}`,
        "png"
      )}`;
      break;
    case "pointerup":
      urlButton = `${FetcherGraficador.getImage(
        projectName,
        "Reportes",
        `perilla_idle`,
        "png"
      )}`;
      break;
  }
  documentButton.style.background = `url(${urlButton})`;
  documentButton.style.backgroundRepeat = `no-repeat`;
  documentButton.style.backgroundSize = `contain`;

  // Mueve el carrusel a la nueva posición
  moveCarousel();
}
function GetSitio(idEstacion) {
  const sitio = sitiosInfo.find((sitioEstacion) => {
    return sitioEstacion.Id == idEstacion;
  });
  return sitio;
}
function CreateSignalItem(signal, IdEstacion) {
  if (UIReportes.idSignalsAGraficar.length >= 6) {
    const modal = document.querySelector(".modalValidation");
    modal.style.pointerEvents = "auto";
    modal.style.opacity = 1;
    return;
  }

  const signalContainer = document.querySelector(".signalContent");
  const signalItem = document.createElement("div");
  signalItem.classList.add("signalItem");
  signalItem.setAttribute("signal", signal.IdSignal);
  signalItem.removeEventListener("click", cleanSignal);
  signalItem.addEventListener("click", cleanSignal);

  // Crear elementos de icono 1
  const icon1 = createIcon(
    "icon1",
    `${FetcherGraficador.getImage(
      projectName,
      "Reportes",
      `${tipoSignalImagenMap[signal.IdTipoSignal]}`,
      "png"
    )}`
  );

  // Crear elemento de nombre de señal
  const itemSignalName = createItemSignalName(signal, IdEstacion);

  // Crear elementos de icono 2
  const icon2 = createIcon(
    "icon2",
    `${FetcherGraficador.getImage(projectName, "Reportes", `led`, "png")}`
  );

  // Verificar si el elemento ya está apendizado
  const existingItem = signalContainer.querySelector(
    `.signalItem[data-tipo="${signal.IdSignal}"]`
  );
  if (existingItem) {
    borrarVariableAGraficar(existingItem);
  } else {
    // Si el elemento no está apendizado, se crea y se agrega al contenedor
    signalItem.setAttribute("data-tipo", signal.IdSignal); // Se añade un atributo para identificar el tipo de señal
    signalItem.classList.add(`variable_${signal.IdSignal}`);
    signalContainer.appendChild(signalItem);
    signalItem.appendChild(icon1);
    signalItem.appendChild(itemSignalName);
    signalItem.appendChild(icon2);
    const sitio = GetSitio(IdEstacion);
    UIReportes.idSignalsAGraficar.push({
      IdSignal: signal.IdSignal,
      IdTipoSignal: signal.IdTipoSignal,
      Color: coloresSignals[UIReportes.idSignalsAGraficar.length],
      Rotate: rotates[UIReportes.idSignalsAGraficar.length],
      Nombre: `${signal.Nombre} - (${sitio.Nombre})`,
    });
  }

  updateColors();

  const buttonGraficador = document.querySelector(".headerIcon");

  if (UIReportes.idSignalsAGraficar.length == 0) {
    buttonGraficador.style.pointerEvents = "none";
    buttonGraficador.style.opacity = 0;
  } else {
    buttonGraficador.style.pointerEvents = "auto";
    buttonGraficador.style.opacity = 1;
  }
}

function borrarVariableAGraficar(elemeoABorrar) {
  const IdSignal = parseInt(elemeoABorrar.getAttribute("signal"));
  const signalContainer = document.querySelector(".signalContent");
  const idSignalsActuales = UIReportes.idSignalsAGraficar.filter(
    (signalSel) => signalSel.IdSignal != IdSignal
  );
  // Si el elemento ya está apendizado, se elimina
  signalContainer.removeChild(elemeoABorrar);

  UIReportes.idSignalsAGraficar = idSignalsActuales;
}

function updateColors() {
  const iconSignalCarrusel = document.querySelectorAll(".variableSignal");
  iconSignalCarrusel.forEach((iconSignal) => {
    iconSignal.style.filter = "grayscale(1)";
  });
  UIReportes.idSignalsAGraficar.forEach((signalColor, index) => {
    signalColor.Color = coloresSignals[index];
    signalColor.Rotate = rotates[index];

    const elementos = document.querySelectorAll(
      `.variable_${signalColor.IdSignal}`
    );
    elementos.forEach((elemento) => {
      if (elemento.children.length > 1) {
        const hijos = elemento.children;
        hijos[0].style.filter = signalColor.Rotate; // 0 es imagen icono
        if (hijos[1]) hijos[1].style.color = signalColor.Color; // 1 es el texto
      } else elemento.style.filter = signalColor.Rotate;
    });
  });
}

// Función para crear elementos de icono
function createIcon(className, src) {
  const icon = document.createElement("div");
  icon.classList.add(className);
  const iconImg = document.createElement("img");
  iconImg.setAttribute("src", src);
  icon.appendChild(iconImg);
  return icon;
}

// Función para crear el elemento de nombre de señal
function createItemSignalName(signal, idEstacion) {
  const sitio = GetSitio(idEstacion);
  const itemSignalName = document.createElement("div");
  itemSignalName.classList.add("itemSignalName");
  itemSignalName.innerText = `${signal.Nombre} (${sitio.Nombre}) `;
  return itemSignalName;
}

function cleanSignals() {
  // Selecciona el elemento signalFooterImg
  const signalFooterImg = document.querySelector(".signalFooterImg");
  // Selecciona el contenedor de señales
  const signalContent = document.querySelector(".signalContent");

  // Agrega un event listener para el evento de clic
  signalFooterImg.addEventListener("click", () => {
    // Verifica si signalContent tiene contenido
    if (signalContent.innerHTML.trim() !== "") {
      // Limpia el contenido de signalContent
      signalContent.innerHTML = "";
      UIReportes.idSignalsAGraficar = [];
      updateColors();
    }
  });
}

function cleanSignal(ev) {
  const signalContent = ev.currentTarget;
  borrarVariableAGraficar(signalContent);
  console.log(signalContent);
  updateColors();
}

// Llama a la función para agregar el evento de clic al elemento signalFooterImg
cleanSignals();

// Exporta la función CreateVariables para ser utilizada en otros archivos
export { CreateVariables };
