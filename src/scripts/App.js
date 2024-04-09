import { Core } from "./Core.js";
import { Tabla } from "./Tabla/Tabla.js";
import { EnumProyecto } from "./Utilities/Enums.js";
import Perfil from "./Perfil/Perfil.js";
import { Particular } from "./Particular/Particular.js";
import { Mapa } from "./Mapa/Mapa.js";

class VwcApp {
  async Start() {
    await Core.Instance.Init(EnumProyecto.Padierna); // Espera a que tenga la informacion
    this.IniciarUI();
  }
  IniciarUI() {
    new Tabla().create(); // Inicio de tabla curva
    new Perfil().create(); // Inicio del perfil
    new Mapa().create();
  }
}

export { VwcApp };
