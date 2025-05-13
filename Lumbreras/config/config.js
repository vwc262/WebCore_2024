import { LumbrerasConfig } from "./LumbrerasConfig.js";

var Configuracion = {
    /**
     * 
     *
     */
    GetConfiguracion() {
        let config = LumbrerasConfig;

        return config;
    },

    GetNombresLargos() {
        let nombres = `Sistema de drenaje produndo`
        return nombres;
    }

}

export { Configuracion };
