// Importa los módulos necesarios desde otros archivos
import { sitiosInfo } from "./Reportes.js"; // Importa la variable sitiosInfo desde Main.js
import { CreateVariables } from "./carrusel.js"; // Importa la función CreateVariables desde carrusel.js
import { projectName } from "./Reportes.js";
import { FetcherGraficador } from "./Fetcher.js";
import UIControlador from "./videoUI.js";

function InicialSelector() {  
  // Obtiene referencias a los elementos del DOM relacionados con el selector
  const optionMenu = document.querySelector(".select-menu"); // Menú de opciones
  const selectBtn = optionMenu.querySelector(".select-btn"); // Botón de selección
  const options = optionMenu.querySelector(".options"); // Contenedor de opciones
  const nameSitio = document.querySelector(".sitioTitle"); // Elemento donde se mostrará el nombre del sitio
  const imgSitioSeleccionado = document.querySelector(".sitioImg");

  // Crea la lista de opciones al cargar la página
  createList(options, optionMenu, nameSitio, imgSitioSeleccionado);

  // Establece el sitio predeterminado
  const sitioPredeterminado = sitiosInfo[0]; // Cambia el índice si deseas seleccionar otro sitio por defecto
  nameSitio.textContent = sitioPredeterminado.Nombre;
  imgSitioSeleccionado.setAttribute(
    "src",
    `${FetcherGraficador.getImage(projectName,`Sitios/${sitioPredeterminado.Id}/Particular`,'fondo','jpg')}`,
  );


  // Agrega un event listener al botón de selección
  selectBtn.addEventListener("click", () => {
    // Alterna la clase 'active' en el menú de opciones para mostrar u ocultar las opciones
    optionMenu.classList.toggle("active");
  });
}

function createList(
  optionContainer,
  optionMenu,
  nameSitio,
  imgSitioSeleccionado
) {
  // Limpia el contenedor de opciones
  optionContainer.innerHTML = "";
  // Itera sobre la información de los sitios y crea las opciones correspondientes en la lista
  sitiosInfo.forEach((Sitio, index) => {
    const option = document.createElement("li"); // Crea un elemento li para la opción
    option.classList.add("option");
    const optionText = document.createElement("span"); // Crea un elemento span para el texto de la opción
    optionText.classList.add(`option-text`, `${index % 2 == 0 ? 'normal' : 'blue'}`);
    optionText.textContent = Sitio.Id + " - " + Sitio.Nombre; // Establece el texto de la opción como el nombre del sitio
    option.appendChild(optionText); // Agrega el elemento de texto como hijo del elemento li
    optionContainer.appendChild(option); // Agrega el elemento li al contenedor de opciones

    // Agrega un event listener a la opción para manejar la selección
    option.addEventListener("click", () => {
      // Remueve la clase 'active' del menú de opciones para ocultarlo
      optionMenu.classList.remove("active");
      // Establece el nombre del sitio seleccionado en el elemento nameSitio
      nameSitio.textContent = Sitio.Nombre;
      // Llama a la función CreateVariables con el índice de la opción seleccionada para cargar el carrusel correspondiente
      UIControlador.indexSitio = sitiosInfo.indexOf(Sitio);
      CreateVariables(sitiosInfo.indexOf(Sitio), Sitio);

      imgSitioSeleccionado.setAttribute(
        "src",
        `${FetcherGraficador.getImage(projectName,`Sitios/${Sitio.Id}/Particular`,'fondo','jpg')}`,
      );
    });
  });
}

// Exporta la función InicialSelector para ser utilizada en otros archivos
export default InicialSelector;
