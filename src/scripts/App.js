import { Core } from "./Core.js";
import { Tabla } from "./Tabla/Tabla.js";
import { EnumNombreProyecto, EnumProyecto } from "./Utilities/Enums.js";
import Perfil from "./Perfil/Perfil.js";
import { Mapa } from "./Mapa/Mapa.js";
import { AdjustSize, ObtenerFormatoTituloProyecto } from "./Utilities/CustomFunctions.js";

class VwcApp {

  async Start() {
    await Core.Instance.Init(EnumProyecto.GustavoAMadero); // Espera a que tenga la informacion
    this.IniciarUI();
  }

  IniciarUI() {

    let title = document.getElementById('title__page');
    title.innerText = `VWC - ${ObtenerFormatoTituloProyecto(EnumNombreProyecto[Core.Instance.IdProyecto])}`;

    const $titleHeader = document.querySelector("#title");
    $titleHeader.innerText = `${ObtenerFormatoTituloProyecto(EnumNombreProyecto[Core.Instance.IdProyecto])}`;

    new Tabla().create(); // Inicio de tabla curva
    new Perfil().create(); // Inicio del perfil
    new Mapa().create();

    AdjustSize();
  }

}

export { VwcApp };

window.onresize = () => { AdjustSize(); };
