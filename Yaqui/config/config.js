import { EnumProyecto } from "../scripts/Utilities/Enums.js";
import { AduanaConfig } from "./AduanaConfig.js";
import { PozosAIFAConfig } from "./AIFA.js";
import { ChalmitaConfig } from "./ChalmitaConfig.js";
import { ChiconautlaConfig, NombresLargosChiconautla } from "./ChiconautlaConfig.js";
import { ClimatologicasHidrometricasConfig } from "./ClimatologicasHidrometricas2024Config.js";
import { GAMPonchoConfig } from "./GAMPonchoConfig.js";
import { GustavoAMaderoConfig } from "./GustavoAMaderoConfig.js";
import { IztapalapaConfig } from "./IztapalapaConfig.js";
import { LineaMoradaConfig } from "./LineaMorada.js";
import { PadiernaConfig } from "./PadiernaConfig.js";
import { PozosSistemaLermaConfig } from "./PozosSistemaLermaConfig.js";
import { SantaCatarinaConfig } from "./SantaCatarinaConfig.js";
import { TeoloyucanConfig } from "./Teoloyucan.js";
import { CarteroYaquiConfig } from "./CarteroYaquiConfig.js";


var Configuracion = {
    /**
     * 
     * @param {EnumProyecto} EnumProyecto 
     */
    GetConfiguracion(enumProyecto) {
        let config = {};
        switch (enumProyecto) {
            case EnumProyecto.GustavoAMadero:
                config = GustavoAMaderoConfig;
                break;
            case EnumProyecto.Padierna:
                config = PadiernaConfig;
                break;
            case EnumProyecto.Lerma:
                config = PozosSistemaLermaConfig;
                break;
            case EnumProyecto.Iztapalapa:
                config = IztapalapaConfig;
                break;
            case EnumProyecto.Chalmita:
                config = ChalmitaConfig;
                break;
            case EnumProyecto.Yaqui:
                config = undefined;
                break;
            case EnumProyecto.SistemaCutzamala:
                config = undefined;
                break;
            case EnumProyecto.PruebasCampo:
                config = GAMPonchoConfig;
                break;
            case EnumProyecto.SantaCatarina:
                config = SantaCatarinaConfig;
                break;
            case EnumProyecto.Chiconautla:
                config = ChiconautlaConfig;
                break;
            case EnumProyecto.Sorpasso:
                config = undefined;
                break;
            case EnumProyecto.EscudoNacional:
                config = undefined;
                break;
            case EnumProyecto.ClimatologicasHidrometricas:
                config = ClimatologicasHidrometricasConfig
                break;
            case EnumProyecto.Teoloyucan:
                config = TeoloyucanConfig;
                break;
            case EnumProyecto.Pruebas:
                config = undefined;
                break;
            case EnumProyecto.LineaMorada:
                config = LineaMoradaConfig;
                break;
            case EnumProyecto.PozosAIFA:
                config = PozosAIFAConfig;
                break;
            case EnumProyecto.PozosZumpango:
                config = undefined;
                break;
            case EnumProyecto.PaseoDelRio:
                config = undefined;
                break;
            case EnumProyecto.Aduana:
                config = AduanaConfig;
                break;
            case EnumProyecto.PozosPAI:
                config = undefined;
                break;
            case EnumProyecto.PozosCoyoacan:
                config = undefined;
                break;
            case EnumProyecto.PozosAzcapotzalco:
                config = undefined;
                break;
            case EnumProyecto.PozosPAI:
                config = undefined;
                break;
            case EnumProyecto.Encharcamientos:
                config = undefined
                break;
            case EnumProyecto.Lumbreras:
                config = undefined;
                break;
            case EnumProyecto.Ramales:
                config = undefined;
                break;
            case EnumProyecto.PortalDeSalida:
                config = undefined;
                break;
            case EnumProyecto.Cutzamala:
                config = undefined;
                break;
            case EnumProyecto.Ramales2026:
                config = undefined;
                break;
            case EnumProyecto.PozosTlahuac:
                config = undefined;
                break;
            case EnumProyecto.PozosCDMX:
                config = undefined;
                break;
            case EnumProyecto.Cartero:
                config = undefined;
                break;
            case EnumProyecto.CarteroYaqui:
                config = CarteroYaquiConfig;
                break;
            case EnumProyecto.MilpaAlta:
                config = undefined;
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
