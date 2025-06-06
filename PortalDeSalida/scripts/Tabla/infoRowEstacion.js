import { Core } from "../Core.js";
import { EventsManager } from "../Managers/EventsManager.js";
import { Particular } from "../Particular/Particular.js";
import { EnumUnidadesSignal } from "../Utilities/Enums.js";

/**
 * @returns {infoRowEstacion}
 */
class infoRowEstacion {
    HTMLUpdateElements = {};

    /**
     * 
     * @param {HTMLElement} container 
     * @param {Estacion} estacion 
     * @param {String} interceptor 
     */
    constructor(container, estacion, interceptor) {
        this.estacion = estacion;
        this.interceptor = interceptor;

        let info_div = document.createElement('div');
        info_div.classList = 'info_estacion_row';

        let signals_div = document.createElement('div');
        signals_div.classList = 'signals_div';

        let gradiant_div = document.createElement('div');
        gradiant_div.classList = 'gradiant_div';

        let btn_goParticular = document.createElement('button');
        btn_goParticular.classList = "btn_goParticular";
        btn_goParticular.style.background = `url(${Core.Instance.ResourcesPath}Tabla/goToPerfil.png?v=${Core.Instance.version})`

        let img_estacion_div = document.createElement('div');
        img_estacion_div.classList = 'ImgEstacion';
        img_estacion_div.style.background = `url(${Core.Instance.ResourcesPath}Tabla/sitio.jpg?v=${Core.Instance.version}) 0% 0% / contain no-repeat`;

        img_estacion_div.append(btn_goParticular)

        /* =========== creacion de signals ===================== */

        this.estacion.Signals.forEach(signal => {
            if (signal.TipoSignal == 1) {

                let signal_div = document.createElement('div');
                signal_div.classList = 'signal_estacion';

                let nivel_div = document.createElement('div');
                nivel_div.classList = 'nivel_div';

                let semaforos_div = document.createElement('div');
                semaforos_div.classList = 'semaforos_div';

                let signal_nombre = document.createElement('div');
                signal_nombre.classList = 'signal_nombre sub_titulo';
                signal_nombre.innerHTML = `${signal.Nombre}`;

                let signal_valor = document.createElement('div');
                signal_valor.id = `signal_${signal.IdSignal}`;
                signal_valor.classList = 'signal_valor textoValor sub_titulo';
                signal_valor.innerHTML = `${signal.Valor} m`;
                this.alojarElementoDinamico([signal_valor]);

                let semaforo_altura = document.createElement('div');
                semaforo_altura.classList = 'semaforoCont  sub_titulo';
                semaforo_altura.innerHTML = `${signal.Semaforo?.Altura ? 'Altura<br>' + signal.Semaforo.Altura + ' m': 'ND'}`;

                let semaforo_prev = document.createElement('div');
                semaforo_prev.classList = 'semaforoCont  sub_titulo';
                semaforo_prev.innerHTML = `${signal.Semaforo?.Preventivo ? '<span style="color: yellow;">Prev.<br> </span>' + signal.Semaforo.Preventivo + ' m' : 'ND'}`;

                let semaforo_critc = document.createElement('div');
                semaforo_critc.classList = 'semaforoCont  sub_titulo';
                semaforo_critc.innerHTML = `${signal.Semaforo?.Critico ? '<span style="color: red;">Crit.<br> </span>' + signal.Semaforo.Critico + ' m' : 'ND'}`;

                semaforos_div.append(semaforo_altura, semaforo_prev, semaforo_critc);
                nivel_div.append(signal_nombre, semaforos_div)
                signal_div.append(nivel_div, signal_valor);
                signals_div.append(signal_div);

            }
            else if (signal.TipoSignal == 3 || signal.TipoSignal == 24) {

                let signal_div = document.createElement('div');
                signal_div.classList = 'signal_estacion';

                let nivel_div = document.createElement('div');
                nivel_div.classList = 'nivel_div';

                let signal_nombre = document.createElement('div');
                signal_nombre.classList = 'signal_nombre sub_titulo';
                signal_nombre.innerHTML = `${signal.Nombre}`;

                let signal_valor = document.createElement('div');
                signal_valor.id = `signal_${signal.IdSignal}`;
                signal_valor.classList = 'signal_valor textoValor sub_titulo';
                signal_valor.innerHTML = `${signal.Valor} ${EnumUnidadesSignal[signal.TipoSignal]}`;
                this.alojarElementoDinamico([signal_valor]);

                nivel_div.append(signal_nombre)
                signal_div.append(nivel_div, signal_valor);
                signals_div.append(signal_div);

            }
        });

        this.root = btn_goParticular;
        gradiant_div.append(img_estacion_div)
        info_div.append(gradiant_div, signals_div);
        container.appendChild(info_div);
    }

        alojarElementoDinamico(elementos) {
        elementos.forEach((elemento) => {
            this.HTMLUpdateElements[elemento.id] = elemento;
        });
    }

    Init() {
        this.root.addEventListener('click', this.onclick.bind(this));
        this.update();
    }

    onclick() {
        Particular.Instance.setEstacion(this.estacion);
        Particular.Instance.mostrarDetalles(this.interceptor);

        // EventsManager.Instance.EmitirEvento("Cerrar");
    }

    update() {
        if (this.estacion) {
            const estacionUpdate = Core.Instance.GetDatosEstacion(this.estacion.IdEstacion);
            
            estacionUpdate.Signals.forEach(signal => {
                if(signal.TipoSignal == 1){
                    let valor_signal = this.HTMLUpdateElements[`signal_${signal.IdSignal}`];
                    valor_signal.innerHTML = `${signal.DentroRango? signal.Valor : "---"} ${EnumUnidadesSignal[signal.TipoSignal]}`;
                    valor_signal.style.color = `${signal.GetColorSemaforo('floralwhite')}`;
                }
            })
        }
    }

    suscribirEventos() {
        EventsManager.Instance.Suscribirevento(
            "Update",
            new EventoCustomizado(this.update)
        );
    }
}
export { infoRowEstacion }