import { Core } from "../Core.js";
import { Configuracion } from "../../config/config.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";

class Perfil {

    constructor(sitios) {
    }

    create() {
        const configuracionProyecto = Configuracion.GetConfiguracion(Core.Instance.IdProyecto);
        const widthRenderPerfil = configuracionProyecto.widthRender;
        const heightRender = configuracionProyecto.heightRender;

        EventsManager.Instance.Suscribirevento('OnMouseHoverTabla', new EventoCustomizado((data) => this.setHoverPerfil(data.isMouseOut, data.estacion, data.css)));

    }

}

export default Perfil;