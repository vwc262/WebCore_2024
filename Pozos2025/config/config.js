import { EnumProyecto } from "../scripts/Utilities/Enums.js";
import { PozosPAI } from "./PozosPAI.js";

var Configuracion = {
    /**
     * 
     * @param {EnumProyecto} EnumProyecto 
     */
    GetConfiguracion(enumProyecto) {
        let config = PozosPAI;
        switch (enumProyecto) {            
            case EnumProyecto.PozosPAI:
                config = PozosPAI;
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