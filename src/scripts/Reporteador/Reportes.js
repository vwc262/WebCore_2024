// Importar el módulo UIControlador desde videoUI.js
import { EnumPeticiones, EnumProyecto, EnumNameProjecto, FetcherGraficador } from "./Fetcher.js";
import UIReportes from "./UIReportes.js";
import initCalendario from "./calendario.js";
import { initGraficador } from "./graficar.js";
import InicialSelector from "./selectSite.js";
import UIControlador from "./videoUI.js";
import { setStyleProperty } from "./utilities.js";
import { Configuracion } from "../../config/config.js";

// Importar el módulo controladorVideo desde videos.js
import controladorVideo from "./videos.js";
import { moveCarousel } from "./carrusel.js";
import { Core } from "../Core.js";

export var projectName = EnumNameProjecto.TanquesPadierna;

export var sitiosInfo = [];

export var isReporteadorCreated = { iscreated: false, secondPhase: false };

// Cuando la ventana se carga completamente, ejecutar la siguiente función
async function inicializarReporteador() {
  if (!isReporteadorCreated.iscreated) {

    inicializarImages();
    // peticion de estaciones del proyecto
    const jsonData = await FetcherGraficador.request({
      action: `${EnumPeticiones.READ}`,
    });

    sitiosInfo = jsonData.Sites.filter(s => s.SignalsDescriptionContainer.length > 0);

    // Inicializar el video utilizando el método initVideo del controladorVideo
    // Se pasa la URL del video y la función showUIVideo del UIControlador como argumentos
    controladorVideo.initVideo(
      // URL del video a cargar
      `${FetcherGraficador.getImage(projectName, 'Reportes', '3-Cortinilla', 'mp4')}`,
      // Función para mostrar la interfaz de usuario del video
      UIControlador.showUIVideoInit
    );

    InicialSelector();
    initCalendario();
    initGraficador();
  }
  moveCarousel();
  // CreateVariables(UIControlador.indexSitio, sitiosInfo[UIControlador.indexSitio]); // Llama a CreateVariables con el índice del sitio predeterminado
  isReporteadorCreated.iscreated = true;
};

function inicializarImages() {
  const modal = document.querySelector(".modalValidation");

  let config = Configuracion.GetConfiguracion(Core.Instance.IdProyecto);
  modal.style.background = `url(${FetcherGraficador.getImage(projectName, 'Control', 'modalbackground', 'png')})`;

  const returnImage = document.querySelector(".btnReturnImage")
  returnImage.setAttribute('src', `${FetcherGraficador.getImage(projectName, 'General', 'ToPerfil', 'gif')}`)

  const pdfImage = document.querySelector(".btnPDF")
  pdfImage.setAttribute('src', `${FetcherGraficador.getImage(projectName, 'Reportes', 'PDF', 'png')}`)

  const csvImage = document.querySelector(".btnCSV")
  csvImage.setAttribute('src', `${FetcherGraficador.getImage(projectName, 'Reportes', 'csv', 'png')}`)

  const buttonSelect = document.querySelector(".sBtn-Select")
  buttonSelect.setAttribute('src', `${FetcherGraficador.getImage(projectName, 'Reportes', 'Flecha_metal', 'png')}`)

  const buttonGraficar = document.querySelector(".buttonGraficar")
  buttonGraficar.setAttribute('src', `${FetcherGraficador.getImage(projectName, 'Reportes', 'graficar', 'gif')}`)

  const btnCarrusel = document.querySelector(".btnCarrusel")
  btnCarrusel.setStyleProperty({ 'background-image': `url(${FetcherGraficador.getImage(projectName, 'Reportes', 'perilla_idle', 'png')})`, 'background-size': "contain" });

  const btnSignalFooterImg = document.querySelector(".signalFooterImg")
  btnSignalFooterImg.setStyleProperty({ 'background-image': `url(${FetcherGraficador.getImage(projectName, 'Reportes', 'borrar', 'png')})`, 'background-size': "cover" });
  btnSignalFooterImg.addEventListener('mouseover', () => {
    btnSignalFooterImg.setStyleProperty({ 'background-image': `url(${FetcherGraficador.getImage(projectName, 'Reportes', 'borrar_h', 'png')})`, 'background-size': "cover" });
  })
  btnSignalFooterImg.addEventListener('mouseleave', () => {
    btnSignalFooterImg.setStyleProperty({ 'background-image': `url(${FetcherGraficador.getImage(projectName, 'Reportes', 'borrar', 'png')})`, 'background-size': "cover" });
  })

  const btnPromedios = document.querySelector(".promedios")
  btnPromedios.setStyleProperty({ 'background-image': `url(${FetcherGraficador.getImage(projectName, 'Reportes', `${config.promedios? 'borrar' : 'borrar_h'}`, 'png')})`, 'background-size': "cover" });

  // Agrega un event listener para el evento de clic
  btnPromedios.addEventListener("click", function () {

    if (config.promedios != undefined) {
      config.promedios = !config.promedios;
    }
    else {
      config.promedios = true;
    }

    btnPromedios.setStyleProperty({ 'background-image': `url(${FetcherGraficador.getImage(projectName, 'Reportes', `${config.promedios? 'borrar' : 'borrar_h'}`, 'png')})`, 'background-size': "cover" });
  })

  const btnSitios = document.querySelector(".select-menu .options")
  btnSitios.setStyleProperty({ 'background-image': `url(${FetcherGraficador.getImage(projectName, 'Reportes', 'panel_sitios', 'png')})`, 'background-size': "cover" });

}

export { inicializarReporteador };