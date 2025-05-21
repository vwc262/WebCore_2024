import { Core } from "../Core.js";
import { Configuracion } from "../../config/config.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";

class Perfil {

    constructor() {

        this.InitializeDial();
    }

    InitializeDial() {

        this.dial_interceptores = document.getElementsByClassName("dial_secuencias_interceptores")[0];
        this.contenedor_botones = document.getElementsByClassName("contenedor_botones")[0];

        this.cargarImagenesDial(25, 'interceptor');
        this.cargarImagenesDial(25, 'left');
        this.cargarImagenesDial(25, 'right');

        const interceptores = Core.Instance.Configuracion.interceptores;
        const interceptores_keys = Object.keys(interceptores);

        const posiciones = this.distribuirElementosEnCircunferencia(220, interceptores_keys.length, 200, 250, 200);

        interceptores_keys.forEach((key, index) => {

            const dial_button_interceptor = document.createElement('div');
            dial_button_interceptor.classList = 'dial_button_interceptor';
            dial_button_interceptor.innerHTML = `${interceptores[key].abreviacion}`;

            const pos = posiciones[index];

            dial_button_interceptor.style.left = `${pos.left}px`;
            dial_button_interceptor.style.top = `${pos.top}px`;

            dial_button_interceptor.addEventListener('click', this.onclick);
            this.contenedor_botones.append(dial_button_interceptor);
        });
    }

    onclick() {

    }

    distribuirElementosEnCircunferencia(
        gradosTotales,  // Grados totales del arco 
        cantidadElementos,  // Número de elementos a distribuir
        radio,  // Radio de la circunferencia en píxeles
        centroX,  // Coordenada X del centro relativo al contenedor
        centroY  // Coordenada Y del centro relativo al contenedor
    ) {
        const posiciones = [];
        const anguloInicial = 200; // Empezamos desde el lado izquierdo (180 grados)

        // Convertir grados a radianes
        const gradosToRad = (grados) => grados * (Math.PI / 180);

        // Calcular el ángulo entre cada elemento
        const anguloEntreElementos = gradosTotales / (cantidadElementos - 1);

        for (let i = 0; i < cantidadElementos; i++) {
            // Calcular el ángulo para este elemento (empezando desde la izquierda)
            const angulo = gradosToRad(anguloInicial - (i * anguloEntreElementos));

            // Calcular las coordenadas x e y en la circunferencia
            const x = centroX + radio * Math.cos(angulo);
            const y = centroY - radio * Math.sin(angulo); // Restamos porque en CSS Y aumenta hacia abajo

            posiciones.push({
                left: x,
                top: y
            });
        }

        return posiciones;
    }

    cargarImagenesDial(frames, image_name) {
        for (let index = 0; index < frames; index++) {
            const elem = document.createElement("img");

            elem.classList = 'elemento_dial';
            elem.style.background = `url(${Core.Instance.ResourcesPath}/secuencias/${image_name}_${index}.png?v=${Core.Instance.version}) no-repeat`;

            this.dial_interceptores.append(elem);
        }
    }

    create() {
        const configuracionProyecto = Configuracion.GetConfiguracion(Core.Instance.IdProyecto);
        const widthRenderPerfil = configuracionProyecto.widthRender;
        const heightRender = configuracionProyecto.heightRender;

        EventsManager.Instance.Suscribirevento('OnMouseHoverTabla', new EventoCustomizado((data) => this.setHoverPerfil(data.isMouseOut, data.estacion, data.css)));

    }

}

export default Perfil;