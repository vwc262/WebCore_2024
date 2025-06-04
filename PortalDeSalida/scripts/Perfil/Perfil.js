import { Core } from "../Core.js";
import { Configuracion } from "../../config/config.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";



class Perfil {


    static #_instance = undefined;
    /**
     * @returns {Perfil}
     */
    static get Instance() {
        if (!this.#_instance) {
            this.#_instance = new Perfil();
        }
        return this.#_instance;
    }

    constructor() {
        this.actualInterceptor = 0;
        this.actualFrame = 0;
        this.nombre_interceptores = null;
        this.config = Core.Instance.Configuracion;
    }

    onDialBtnInterceptoriclick(e) {
        const target = e.target;
        const interceptor = parseInt(target.getAttribute('interceptor'));
        const left = this.actualInterceptor > interceptor;
        const steps = Math.abs(this.actualInterceptor - interceptor);

        this.spinDial(steps, left);
    }

    onRightLeftBtnClick(e) {
        const target = e.target;
        const className = target.classList[1];
        const left = className.includes('left');

        this.spinDial(1, left);
    }

    spinDial(steps, left) {

        const dial_images = document.getElementsByClassName(this.dial_name);
        const total_interceptores = document.getElementsByClassName('dial_button_interceptor');
        const rightLeftBtn_dial = document.getElementsByClassName('dial_button');

        if (left ? this.actualInterceptor - steps < 0 : this.actualInterceptor + steps > total_interceptores.length - 1)
            return;

        const ticks = 24;
        const frame_step = dial_images.length / total_interceptores.length;
        let start = this.actualFrame;
        this.actualInterceptor += + (left ? -steps : steps);
        const stop = Math.round(this.actualInterceptor * frame_step);

        // if (stop == this.actualFrame) return;

        this.habilitarInteraccion('none', total_interceptores);
        this.habilitarInteraccion('none', rightLeftBtn_dial);

        this.pressButton(left);
        this.destellar();

        const interval = setInterval(() => {

            if (left) {
                if (start <= stop) {
                    this.habilitarInteraccion('all', total_interceptores); 3
                    this.habilitarInteraccion('all', rightLeftBtn_dial);
                    clearInterval(interval);
                }
                else {
                    dial_images[start].style.display = 'none';
                    start--;
                    this.actualFrame = start;
                }
            } else {
                if (start >= stop) {
                    this.habilitarInteraccion('all', total_interceptores);
                    this.habilitarInteraccion('all', rightLeftBtn_dial);
                    clearInterval(interval);
                }
                else {
                    start++;
                    this.actualFrame = start;
                    dial_images[start].style.display = 'block';
                }

            }

        }, ticks);
    }

    habilitarInteraccion(habilitar, coleccion) {
        for (const elemento of coleccion) {
            elemento.style.pointerEvents = `${habilitar}`;
        }
    }

    destellar() {

        const destellos = document.getElementsByClassName(this.destello);

        const ticks = 24;
        let actual_frame = 0;

        for (let index = 0; index < destellos.length; index++) {
            destellos[index].style.display = 'none';
        }

        const interval = setInterval(() => {
            if (actual_frame >= destellos.length - 1) {
                clearInterval(interval);
            }
            else {
                actual_frame++;
                destellos[actual_frame].style.display = 'block';
            }
        }, ticks);


        this.nombre_interceptores.innerHTML = `${this.interceptores[this.interceptores_keys[this.actualInterceptor]].nombre}`;
    }

    pressButton(left) {

        const button_presseds = document.getElementsByClassName((left ? this.btn_left_name : this.btn_right_name));

        const ticks = 24;
        let actual_frame = 0;

        const interval = setInterval(() => {

            if (actual_frame >= button_presseds.length - 1) {
                clearInterval(interval);
                this.unpressButton(left);
            }
            else {
                actual_frame++;
                button_presseds[actual_frame].style.display = 'block';
            }


        }, ticks);
    }

    unpressButton(left) {

        const button_presseds = document.getElementsByClassName((left ? this.btn_left_name : this.btn_right_name));

        const ticks = 24;
        let actual_frame = button_presseds.length - 1;

        const interval = setInterval(() => {

            if (actual_frame <= 0) {
                clearInterval(interval);
            }
            else {
                button_presseds[actual_frame].style.display = 'none';
                actual_frame--;
            }


        }, ticks);
    }

    distribuirElementosEnCircunferencia(
        anguloInicial, // donde empieza el primer elemento desde el lado izquierdo (en grados)
        gradosTotales,  // Grados totales del arco 
        cantidadElementos,  // Número de elementos a distribuir
        radio,  // Radio de la circunferencia en píxeles
        centroX,  // Coordenada X del centro relativo al contenedor
        centroY,   // Coordenada Y del centro relativo al contenedor
    ) {
        const posiciones = [];

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

    create() {
        const configuracionProyecto = Configuracion.GetConfiguracion(Core.Instance.IdProyecto);
        const widthRenderPerfil = configuracionProyecto.widthRender;
        const heightRender = configuracionProyecto.heightRender;

        EventsManager.Instance.Suscribirevento('OnMouseHoverTabla', new EventoCustomizado((data) => this.setHoverPerfil(data.isMouseOut, data.estacion, data.css)));
    }

}

export default Perfil;