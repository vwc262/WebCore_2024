import { EnumProyecto } from "../scripts/Utilities/Enums.js";
import { GustavoAMaderoConfig } from "./GustavoAMaderoConfig.js";
import { PadiernaConfig } from "./PadiernaConfig.js";
import { SantaCatarinaConfig } from "./SantaCatarinaConfig.js";


var Configuracion = {
    /**
     * 
     * @param {EnumProyecto} EnumProyecto 
     */
    GetConfiguracion(enumProyecto) {
        let config = {};
        switch (enumProyecto) {
            case EnumProyecto.Padierna:
                config = PadiernaConfig;
                break;
            case EnumProyecto.SantaCatarina:
                config = SantaCatarinaConfig;
                break;
            case EnumProyecto.GustavoAMadero:
                config = GustavoAMaderoConfig;
                break;
        }

        return config;
    }

}

export { Configuracion };