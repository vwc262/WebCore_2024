// Importar la función setElementProperty desde el módulo utilities.js
import { sitiosInfo } from "./Reportes.js"; // Importa sitiosInfo del módulo Main.js
import UIReportes from "./UIReportes.js";
import { CreateVariables } from "./carrusel.js"; // Importa CreateVariables del módulo carrusel.js
import { setElementProperty } from "./utilities.js"; // Importa setElementProperty del módulo utilities.js

// Definición del objeto UIControlador
const UIControlador = {
  indexSitio:0,
  // Objeto que contiene referencias a elementos del DOM relacionados con la interfaz de usuario
  overlays: {
    calendario: document.querySelector(".calendarioContainer"), // Referencia al contenedor del calendario
    imgSitio: document.querySelector(".SitioContainer"), // Referencia al contenedor de la imagen del sitio
    signals: document.querySelector(".listaSignalsContainer"), // Referencia al contenedor de las señales
    seleccionarSitio: document.querySelector(".select-menu"), // Referencia al menú de selección del sitio
    carruselContainer: document.querySelector(".carrusel-Main__Container"), // Referencia al contenedor del carrusel
    variablesContainer: document.querySelector(".variables__Container"), // Referencia al contenedor del carrusel
    //bntGraficar: document.querySelector(".headerIcon"), // Referencias al boton de graficar
  },

  btnGraficar: {
    bntGraficar: document.querySelector(".headerIcon"), // Referencias al boton de graficar
  },

  graficaUI: {
    // Objeto que contiene referencias a elementos del DOM relacionados con la interfaz de usuario de la gráfica
    grafica: document.querySelector("#chartdiv"), // Referencia a la gráfica
    btnReturn: document.querySelector(".btnReturn"), // Referencia al botón de retorno
    btnPDF: document.querySelector(".btnPDF"), // Referencia al botón de retorno
    btnCSV: document.querySelector(".btnCSV"), // Referencia al botón de retorno
  },

  // Método para mostrar la interfaz de usuario del video
  showUIVideoInit: function () {
    CreateVariables(UIControlador.indexSitio, sitiosInfo[UIControlador.indexSitio]); // Llama a CreateVariables con el índice del sitio predeterminado

    // Llama a la función setElementProperty para establecer la propiedad de opacidad en 1 para los elementos seleccionados
    setElementProperty(Object.values(UIControlador.overlays), {
      opacity: 1, // Establece la opacidad en 1
      "pointer-events": "auto", // Habilita eventos de puntero
    });

    if (UIReportes.idSignalsAGraficar.length > 0) {
      setElementProperty(Object.values(UIControlador.btnGraficar), {
        opacity: 1, // Establece la opacidad en 1
        "pointer-events": "auto", // Habilita eventos de puntero
      });
    }
  },

  // Método para ocultar inmediatamente la interfaz de usuario
  hideUIimmediately: function (elementos) {
    setElementProperty(elementos, { opacity: 0, "pointer-events": "none" }); // Establece la opacidad en 0 y deshabilita eventos de puntero
  },

  // Método para mostrar la interfaz de usuario de la gráfica de video
  showVideoGrafica: function () {
    setElementProperty(Object.values(UIControlador.graficaUI), {
      opacity: 1, // Establece la opacidad en 1
      "pointer-events": "auto", // Habilita eventos de puntero
    });
    UIReportes.Peticion();
  },
};

// Exportar el objeto UIControlador para ser utilizado en otros módulos
export default UIControlador;
