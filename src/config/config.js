import { EnumProyecto } from "../scripts/Utilities/Enums.js";
import { AduanaConfig } from "./AduanaConfig.js";
import { PozosAIFAConfig } from "./AIFA.js";
import { ChalmitaConfig } from "./ChalmitaConfig.js";
import { ChiconautlaConfig, NombresLargosChiconautla } from "./ChiconautlaConfig.js";
import { ClimatologicasHidrometricasConfig } from "./ClimatologicasHidrometricas2024Config.js";
import { EncharcamientosConfig } from "./EncharcamientosConfig.js";
import { GAMPonchoConfig } from "./GAMPonchoConfig.js";
import { GustavoAMaderoConfig } from "./GustavoAMaderoConfig.js";
import { LineaMoradaConfig } from "./LineaMorada.js";
import { PadiernaConfig } from "./PadiernaConfig.js";
import { PlantasPotabilizadoras } from "./PlantasPotabilizadoras.js";
import { PozosSistemaLermaConfig } from "./PozosSistemaLermaConfig.js";
import { SantaCatarinaConfig } from "./SantaCatarinaConfig.js";
import { TeoloyucanConfig } from "./Teoloyucan.js";


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
            case EnumProyecto.Lerma:
                config = PozosSistemaLermaConfig;
                break;
            case EnumProyecto.PlantasPotabilizadoras:
                config = PlantasPotabilizadoras;
                break;
            case EnumProyecto.ClimatologicasHidrometricas:
                config = ClimatologicasHidrometricasConfig
                break;
            case EnumProyecto.PruebasCampo:
                config = GAMPonchoConfig;
                break;
            case EnumProyecto.Teoloyucan:
                config = TeoloyucanConfig;
                break;
            case EnumProyecto.LineaMorada:
                config = LineaMoradaConfig;
                break;
            case EnumProyecto.PozosAIFA:
                config = PozosAIFAConfig;
                break;
            case EnumProyecto.Chalmita:
                config = ChalmitaConfig;
                break;
            case EnumProyecto.PozosReyesFerrocarril:
                config = undefined;
                break;
            case EnumProyecto.Aduana:
                config = AduanaConfig;
                break;
        }

        return config;
    },

    GetNombresLargos(enumProyecto) {
        let nombres = undefined;
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
            case EnumProyecto.ClimatologicasHidrometricas:
                nombres = undefined;
                break;
            case EnumProyecto.Chalmita:
                nombres = undefined;
                break;
        }
        return nombres;
    }

}

export { Configuracion };
