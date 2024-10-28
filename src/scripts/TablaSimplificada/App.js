import { Core } from "./Core.js";
import { TablaSimplificada } from "./TablaSimplificada.js";
import { EnumNombreProyecto, EnumProyecto, EnumNombreProyectoFolder } from "../Utilities/Enums.js";
import { ObtenerFormatoTituloProyecto } from "../Utilities/CustomFunctions.js";

class VwcApp {
  async Start() {
    const href = window.location.href;
    let idProyecto = 0;
    if (href.includes("localhost") || href.includes("127.0.0")) {
      idProyecto = EnumProyecto.LineaMorada; // Cambiar a mano para debug
    }
    else {
      let localHostSplit = href.split("/");
      let localHostFolder = localHostSplit[3];
      idProyecto = EnumNombreProyectoFolder[localHostFolder]
    }
    await Core.Instance.Init(idProyecto); // Espera a que tenga la informacion
    this.IniciarUI();
  }
  IniciarUI() {
    const $titleHeader = document.querySelector(".titleProyecto");
    var title = `${ObtenerFormatoTituloProyecto(
      EnumNombreProyecto[Core.Instance.IdProyecto]
    )}`;
    $titleHeader.innerText = title;
    document.title = title
    new TablaSimplificada().create();
  }
}

export { VwcApp };
