import { Core } from "./Core.js";
import { TablaSimplificada } from "./TablaSimplificada.js";
import { EnumNombreProyecto, EnumProyecto } from "../Utilities/Enums.js";
import { ObtenerFormatoTituloProyecto } from "../Utilities/CustomFunctions.js";

class VwcApp {
  async Start() {
    await Core.Instance.Init(EnumProyecto.PozosSistemaLerma); // Espera a que tenga la informacion
    this.IniciarUI();
  }
  IniciarUI() {
    const $titleHeader = document.querySelector(".titleProyecto");
    $titleHeader.innerText = `${ObtenerFormatoTituloProyecto(
      EnumNombreProyecto[Core.Instance.IdProyecto]
    )}`;
    new TablaSimplificada().create();
  }
}

export { VwcApp };
