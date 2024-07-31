import { EnumProyecto } from "../scripts/Utilities/Enums.js";
import { ChiconautlaConfig, NombresLargosChiconautla } from "./ChiconautlaConfig.js";
import { EncharcamientosConfig } from "./EncharcamientosConfig.js";
import { GustavoAMaderoConfig } from "./GustavoAMaderoConfig.js";
import { PadiernaConfig } from "./PadiernaConfig.js";
import { PlantasPotabilizadoras } from "./PlantasPotabilizadoras.js";
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
            case EnumProyecto.PlantasPotabilizadoras:
                config = PlantasPotabilizadoras;
                break;
        }

        return config;
    },

    GetNombresLargos(enumProyecto) {
        let nombres = {};
        switch (enumProyecto) {
            case EnumProyecto.Padierna:
                nombres = undefined;
                break;
            case EnumProyecto.SantaCatarina:
                nombres = undefined;
                break;
            case EnumProyecto.GustavoAMadero:
                nombres = undefined;
                break;
            case EnumProyecto.Chiconautla:
                nombres = NombresLargosChiconautla;
                break;
            case EnumProyecto.Encharcamientos:
                nombres = undefined;
                break;
            case EnumProyecto.PozosSistemaLerma:
                nombres = undefined;
                break;
            case EnumProyecto.PlantasPotabilizadoras:
                nombres = undefined;
                break;
        }
        return nombres;
    }

}

export { Configuracion };