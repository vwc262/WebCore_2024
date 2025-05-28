import { Estacion } from "../Entities/Estacion.js";
import { Fetcher } from "./Fetcher/Fetcher.js";
import { GlobalData } from "./Global/GlobalData.js";
import { initLista } from "./lista.js";
import { crearElementoDesdeEstacion } from "./lista_creador.js";

window.onload = () => {
  console.log("page is fully loaded");
  initLista();
  RequestInfraestructura();
};

async function RequestInfraestructura() {
  var result = await Fetcher.Instance.RequestData(
    "GetInfraestructuraUniversal",
    "GET",
    {},
    false
  );
  let estacionesCrudas = JSON.parse(result);

  estacionesCrudas.forEach((element) => {
    new Estacion(element);
  });

  // Obtener todas las estaciones ya creadas
  const estaciones = GlobalData.Instance.getEstaciones();

  // Contenedor donde se insertarán los elementos
  const contenedor = document.querySelector(".lista_contenido_principal");

  estaciones.forEach((estacion) => {
    const item = crearElementoDesdeEstacion(estacion);
    contenedor.appendChild(item);
  });
}
