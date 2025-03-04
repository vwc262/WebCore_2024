import { EnumProyecto } from "../scripts/Utilities/Enums.js";
import { Climatologicas } from "./Climatologicas.js";
import { SistemaCutzamala } from "./SistemaCutzamala.js";

var Configuracion = {
    /**
     * 
     * @param {EnumProyecto} EnumProyecto 
     */
    GetConfiguracion(enumProyecto) {
        let config = SistemaCutzamala;
        switch (enumProyecto) {            
            case EnumProyecto.ClimatologicasHidrometricas:
                config = Climatologicas;
                break;
        }
        return config;
    },

    GetNombresLargos(enumProyecto) {
        let nombres = undefined;
        return nombres;
    }

}

export { Configuracion };