import { EnumProyecto } from "../scripts/Utilities/Enums.js";
import { ChiconautlaConfig } from "./ChiconautlaConfig.js";
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
            case EnumProyecto.Chiconautla:
                config = ChiconautlaConfig;
                break;
        }

        return config;
    }

}

export { Configuracion };