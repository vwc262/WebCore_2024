import { Core } from "./Core.js";
import { TablaSimplificada } from "./TablaSimplificada.js";
import { EnumProyecto } from "../Utilities/Enums.js";

class VwcApp {
  async Start() {
    await Core.Instance.Init(EnumProyecto.Padierna); // Espera a que tenga la informacion
    this.IniciarUI();
  }
  IniciarUI() {
    new TablaSimplificada().create();
  }
}

export { VwcApp };
