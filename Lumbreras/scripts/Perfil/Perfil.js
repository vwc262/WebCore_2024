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

    dial_name = 'Dial_01/SDial00';
    btn_left_name = 'Boton_01/SDial_b1_00';
    btn_right_name = 'Boton_02/Secuencia_Dial00';

    constructor() {
        this.actualInterceptor = 0;
    }

    InitializeDial() {

        this.dial_interceptores = document.getElementsByClassName("dial_secuencias_interceptores")[0];
        this.contenedor_botones = document.getElementsByClassName("contenedor_botones")[0];


        this.cargarImagenesDial(26, this.dial_name);
        this.cargarImagenesDial(6, this.btn_left_name);
        this.cargarImagenesDial(6, this.btn_right_name);

        document.getElementsByClassName(this.dial_name)[this.actualInterceptor].style.display = 'block';
        document.getElementsByClassName(this.btn_left_name)[0].style.display = 'block';
        document.getElementsByClassName(this.btn_right_name)[0].style.display = 'block';

        const interceptores = Core.Instance.Configuracion.interceptores;
        const interceptores_keys = Object.keys(interceptores);

        const posiciones = this.distribuirElementosEnCircunferencia(190, 200, interceptores_keys.length, 285, 455, 440);

        interceptores_keys.forEach((key, index) => {

            const dial_button_interceptor = document.createElement('div');
            dial_button_interceptor.classList = 'dial_button_interceptor';
            dial_button_interceptor.innerHTML = `${interceptores[key].abreviacion}`;

            const pos = posiciones[index];

            dial_button_interceptor.style.left = `${pos.left}px`;
            dial_button_interceptor.style.top = `${pos.top}px`;

            dial_button_interceptor.setAttribute('interceptor', index);

            dial_button_interceptor.addEventListener('click', this.onDialBtnInterceptoriclick.bind(this));
            this.contenedor_botones.append(dial_button_interceptor);
        });

        const rightLeftBtn_dial = document.getElementsByClassName('dial_button');

        for (const elemento of rightLeftBtn_dial) {
            elemento.addEventListener('click', this.onRightLeftBtnClick);
        }

    }

    onDialBtnInterceptoriclick(e) {
        const target = e.target;
        const interceptor = parseInt(target.getAttribute('interceptor'));
        const toLeft = this.actualInterceptor > interceptor;

        const steps = Math.abs(this.actualInterceptor - interceptor);

        this.pressButton(toLeft);
        this.spinDial(steps, toLeft);
    }

    onRightLeftBtnClick(e) {
        const target = e.target;
        const className = target.classList[1];
        const toLeft = className.includes('left');

        Perfil.Instance.pressButton(toLeft);
        Perfil.Instance.spinDial(1, toLeft);
    }

    spinDial(steps, left) {
        const dial_images = document.getElementsByClassName(this.dial_name);

        if (left ? this.actualInterceptor - steps < 0 : this.actualInterceptor + steps > dial_images.length - 1)
            return;

        const ticks = 24;
        const stop = this.actualInterceptor + (left ? -steps : steps);

        const interval = setInterval(() => {

            if (left) {
                if (this.actualInterceptor <= stop) clearInterval(interval);
                else {
                    dial_images[this.actualInterceptor].style.display = 'none';
                    this.actualInterceptor--;
                }
            } else {
                if (this.actualInterceptor >= stop) clearInterval(interval);
                else {
                    this.actualInterceptor++;
                    dial_images[this.actualInterceptor].style.display = 'block';
                }

            }

        }, ticks);
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

    cargarImagenesDial(frames, image_name) {
        for (let index = 0; index < frames; index++) {
            const elem = document.createElement("img");

            elem.classList = `elemento_dial ${image_name}`;
            elem.setAttribute('src', `${Core.Instance.ResourcesPath}secuencias/${image_name}${(index < 10 ? '0' : '')}${index}.png?v=${Core.Instance.version}`);

            this.dial_interceptores.append(elem);
        }
    }

    create() {
        const configuracionProyecto = Configuracion.GetConfiguracion(Core.Instance.IdProyecto);
        const widthRenderPerfil = configuracionProyecto.widthRender;
        const heightRender = configuracionProyecto.heightRender;

        EventsManager.Instance.Suscribirevento('OnMouseHoverTabla', new EventoCustomizado((data) => this.setHoverPerfil(data.isMouseOut, data.estacion, data.css)));

        this.InitializeDial();
    }

}

export default Perfil;