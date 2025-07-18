import { Core } from "../Core.js";
import { Configuracion } from "../../config/config.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import Perfil3D from "./Perfil3D.js";


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
    btn_left_name = 'Boton_01/SDial_b1_';
    btn_right_name = 'Boton_02/SDial_b2_';
    destello = 'Seleccion/Secuencia_Select';

    constructor() {
        this.actualInterceptor = 0;
        this.actualFrame = 0;
        this.nombre_interceptores = null;
        this.config = Core.Instance.Configuracion;
    }

    InitializeDial() {

        const sombra = document.getElementsByClassName("dial_sombra")[0];
        sombra.setAttribute('src', `${Core.Instance.ResourcesPath}secuencias/Dial_01/sombra.png?v=${Core.Instance.version}`);

        const dial_interceptores = document.getElementsByClassName("dial_interceptores")[0];
        dial_interceptores.setAttribute('src', `${Core.Instance.ResourcesPath}secuencias/Dial_01/Dial_Ramales.png?v=${Core.Instance.version}`);

        const destello_container = document.getElementsByClassName("contenedor_destello")[0];

        this.nombre_interceptores = document.getElementsByClassName("nombre_interceptores")[0];

        this.dial_interceptores = document.getElementsByClassName("dial_secuencias_interceptores")[0];
        this.contenedor_botones = document.getElementsByClassName("contenedor_botones")[0];

        this.interceptores = Core.Instance.Configuracion.interceptores;
        this.interceptores_keys = Object.keys(this.interceptores);

        this.cargarImagenesDial(this.dial_interceptores, this.interceptores_keys.length, this.dial_name);
        this.cargarImagenesDial(this.dial_interceptores, 6, this.btn_left_name);
        this.cargarImagenesDial(this.dial_interceptores, 6, this.btn_right_name);
        this.cargarImagenesDial(destello_container, 7, this.destello);

        document.getElementsByClassName(this.dial_name)[this.actualInterceptor].style.display = 'block';
        document.getElementsByClassName(this.btn_left_name)[0].style.display = 'block';
        document.getElementsByClassName(this.btn_right_name)[0].style.display = 'block';

        const posiciones = this.distribuirElementosEnCircunferencia(190, 200, this.interceptores_keys.length, 285, 450, 430);

        this.interceptores_keys.forEach((key, index) => {

            const dial_button_interceptor = document.createElement('div');
            dial_button_interceptor.classList = 'dial_button_interceptor';

            const pos = posiciones[index];

            dial_button_interceptor.style.left = `${pos.left}px`;
            dial_button_interceptor.style.top = `${pos.top}px`;

            dial_button_interceptor.setAttribute('interceptor', index);

            dial_button_interceptor.addEventListener('click', this.onDialBtnInterceptoriclick.bind(this));
            this.contenedor_botones.append(dial_button_interceptor);

            EventsManager.Instance.Suscribirevento(
                "Interceptor_Click",
                new EventoCustomizado((data) => {
                    this.onInterceptorClick(data);
                })
            );
        });

        const rightLeftBtn_dial = document.getElementsByClassName('dial_button');

        for (const elemento of rightLeftBtn_dial) {
            elemento.addEventListener('click', this.onRightLeftBtnClick.bind(this));
        }


        this.contenedor_botones.children[0].click();
    }

    onDialBtnInterceptoriclick(e) {
        const target = e.target;
        const interceptor = parseInt(target.getAttribute('interceptor'));
        const left = this.actualInterceptor > interceptor;
        const steps = Math.abs(this.actualInterceptor - interceptor);

        this.spinDial(steps, left);

        EventsManager.Instance.EmitirEvento(`Interceptor_Dial_Click_${interceptor}`);
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
        this.actualInterceptor += (left ? -steps : steps);
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
                destellos[destellos.length - 1].style.display = 'none';
            }
            else {
                actual_frame++;
                for (let index = 0; index < destellos.length; index++) {
                    destellos[index].style.display = 'none';
                }
                destellos[actual_frame].style.display = 'block';
            }
        }, ticks);


        this.nombre_interceptores.src = `${Core.Instance.ResourcesPath}secuencias/Seleccion/${this.interceptores[this.interceptores_keys[this.actualInterceptor]].abreviacion}.png?v=${Core.Instance.version}`;
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

    cargarImagenesDial(container, frames, image_name) {
        for (let index = 0; index < frames; index++) {
            const elem = document.createElement("img");

            elem.classList = `elemento_dial ${image_name}`;
            elem.setAttribute('src', `${Core.Instance.ResourcesPath}secuencias/${image_name}${(index < 10 ? '0' : '')}${index}.png?v=${Core.Instance.version}`);

            container.append(elem);
        }
    }

    onInterceptorClick(data) {
        const interceptor = data.key;
        const left = this.actualInterceptor > interceptor;
        const steps = Math.abs(this.actualInterceptor - interceptor);

        this.spinDial(steps, left);
    }

    create() {
        const configuracionProyecto = Configuracion.GetConfiguracion(Core.Instance.IdProyecto);
        const widthRenderPerfil = configuracionProyecto.widthRender;
        const heightRender = configuracionProyecto.heightRender;

        EventsManager.Instance.Suscribirevento('OnMouseHoverTabla', new EventoCustomizado((data) => this.setHoverPerfil(data.isMouseOut, data.estacion, data.css)));

        this.InitializeDial();

        new Perfil3D().create();
    }

}

export default Perfil;