import UIReportes from "./UIReportes.js";
import UIControlador from "./videoUI.js";
import controladorVideo from "./videos.js";
import { isReporteadorCreated, projectName } from "./Reportes.js";
import { FetcherGraficador, getNombreProyectoIdProyecto } from "./Fetcher.js";
import { PDFExporter } from "./PdfExporter.js";
import ControladorCSV from "./CSVController.js";
import { Core } from "../Core.js";

function initGraficador() {
  setBtnGraficar();
  setBtnReturn();
  Cerrar();
  setEventsOfficeButtons();

}

function setBtnGraficar() {
  const btnGraficar = document.querySelector(".headerIcon");
  const videoGraficador = `${FetcherGraficador.getImage(
    projectName,
    "Reportes",
    "10-Cortinilla_Center",
    "mp4"
  )}`;
  
  btnGraficar.addEventListener("click", () => {
    const $imgRegresar = document.getElementById("imgRegresar");
    const $btnGraficar = document.querySelector(".headerIcon");

    $btnGraficar.style.pointerEvents="none"
    $imgRegresar.parentNode.style.opacity = 1;    
    $imgRegresar.parentNode.style.pointerEvents = "auto";
    UIControlador.hideUIimmediately(Object.values(UIControlador.overlays));
    controladorVideo.initVideo(videoGraficador, UIControlador.showVideoGrafica);
    isReporteadorCreated.secondPhase = true;
  });
}

function setBtnReturn() {
  const btnReturn = document.querySelector(".btnReturn");
  const txtSinHistoricos = document.querySelector(".sinHistoricos");
  const videoGraficadorReverse = `${FetcherGraficador.getImage(
    projectName,
    "Reportes",
    "12-Cortinilla_Center_Return",
    "mp4"
  )}`;

  btnReturn.addEventListener("click", () => {
    UIControlador.hideUIimmediately(Object.values(UIControlador.graficaUI));
    txtSinHistoricos.style.opacity = "0";

    controladorVideo.initVideo(
      videoGraficadorReverse,
      UIControlador.showUIVideoInit
    );
  });
}

function setEventsOfficeButtons() {
  const btnPDF = document.querySelector(".btnPDF");
  const btnCSV = document.querySelector(".btnCSV");

  //btnPDF.removeEventListener("click",)
  btnPDF.addEventListener("click", () => {
    PDFExporter.INSTANCE.descargarPDF(UIReportes.root, `${getNombreProyectoIdProyecto(Core.Instance.IdProyecto)}`, UIReportes.fechaInicial, UIReportes.fechaFinal, UIReportes.idSignalsAGraficar);
  });

  btnCSV.addEventListener("click", () => {
    ControladorCSV.ObtenerCSV(UIReportes, `${getNombreProyectoIdProyecto(Core.Instance.IdProyecto)}`, UIReportes.fechaInicial, UIReportes.fechaFinal, UIReportes.idSignalsAGraficar);
  });
}

function Cerrar() {

}

function GhostVariable() {
  // Seleccionar todos los elementos con la clase "variableSignal"
  const variablesAMover = document.querySelectorAll(".variableSignal");
  // Obtener el destino
  var destinoDeVariable = document.querySelector(".signalContent");
  var coordsDestino = destinoDeVariable.getBoundingClientRect();

  // Iterar sobre cada elemento seleccionado
  variablesAMover.forEach((variable) => {
    // Agregar un event listener para el clic en cada elemento
    variable.addEventListener("click", function () {
      console.log(coordsDestino);
      console.log(variable.getBoundingClientRect());

      variable.style.left = 1920 - coordsDestino.x + 500 + "px";
      variable.style.top = coordsDestino.y - 615 + "px";
    });
  });
}

// Funcion para crear el archivo CSV "excel" y descargarlo


export { initGraficador, GhostVariable };
