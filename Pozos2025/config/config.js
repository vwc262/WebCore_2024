import { EnumProyecto } from "../scripts/Utilities/Enums.js";
import { PozosCoyoacan } from "./PozosCoyoacan.js";
import { PozosAzcapotzalco } from "./PozosAzcapotzalco.js";

var Configuracion = {
    /**
     * 
     * @param {EnumProyecto} EnumProyecto 
     */
    GetConfiguracion(enumProyecto) {
        let config = {};
        switch (enumProyecto) {
            case EnumProyecto.PozosCoyoacan:
                config = PozosCoyoacan;
                break;
            case EnumProyecto.PozosAzcapotzalco:
                config = PozosAzcapotzalco;
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