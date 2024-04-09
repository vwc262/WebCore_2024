import { EnumProyecto } from "../../Utilities/Enums.js";

/**
 * @returns {Credentials}
 */
class Credentials {
    /**
     * 
     * @param {string} usuario 
     * @param {string} psw 
     * @param {EnumProyecto} idProyecto      
     */
    constructor(usuario, psw, idProyecto) {
        this.usuario = usuario;
        this.contrasena = psw;
        this.idProyectp = idProyecto;
    }
}

export { Credentials };