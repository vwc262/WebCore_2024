import { Estacion } from "../Entities/Estacion.js";
import { Fetcher } from "./Fetcher/Fetcher.js";
import { GlobalData } from "./Global/GlobalData.js";
import { initLista } from "./lista.js";
window.onload = () => {
  console.log("page is fully loaded");
  initLista();
  RequestInfraestructura();
};
async function RequestInfraestructura() {
  var result = await Fetcher.Instance.RequestData('GetInfraestructuraUniversal', 'GET', {}, false);
  let estacionesCrudas = JSON.parse(result);
  estacionesCrudas.forEach(element => {
    new Estacion(element);
  });  
}
