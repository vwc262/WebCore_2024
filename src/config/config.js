import { EnumProyecto } from "../scripts/Utilities/Enums.js";
import { ChiconautlaConfig } from "./ChiconautlaConfig.js";
import { EncharcamientosConfig } from "./EncharcamientosConfig.js";
import { GustavoAMaderoConfig } from "./GustavoAMaderoConfig.js";
import { PadiernaConfig } from "./PadiernaConfig.js";
import { PozosSistemaLermaConfig } from "./PozosSistemaLermaConfig.js";
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
            case EnumProyecto.Encharcamientos:
                config = EncharcamientosConfig;
                break;
            case EnumProyecto.PozosSistemaLerma:
                config = PozosSistemaLermaConfig;
                break;
        }

        return config;
    }

}

export { Configuracion };