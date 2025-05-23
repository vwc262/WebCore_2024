import { Core } from "../Core.js";
import { EventsManager } from "../Managers/EventsManager.js";
import { Particular } from "../Particular/Particular.js";

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

        let btn_goParticular = document.createElement('button');
        btn_goParticular.classList = "btn_goParticular";
        btn_goParticular.style.background = `url(${Core.Instance.ResourcesPath}Tabla/goToPerfil.png?v=${Core.Instance.version})`

        let img_estacion_div = document.createElement('div');
        img_estacion_div.classList = 'ImgEstacion';
        img_estacion_div.style.background = `url(${Core.Instance.ResourcesPath}Tabla/sitio.jpg?v=${Core.Instance.version})`;

        img_estacion_div.append(btn_goParticular)

        /* =========== creacion de signals ===================== */

        this.estacion.Signals.forEach(signal => {
            if (signal.TipoSignal == 1) {

                let signal_div = document.createElement('div');
                signal_div.classList = 'signal_estacion';

                let signal_nombre = document.createElement('div');
                signal_nombre.classList = 'signal_nombre';
                signal_nombre.innerHTML = `${signal.Nombre}`;

                let signal_valor = document.createElement('div');
                signal_valor.id = `signal_${signal.IdSignal}`;
                signal_valor.classList = 'signal_valor';
                signal_valor.innerHTML = `${signal.Valor} m`;
                this.alojarElementoDinamico([signal_valor]);

                signal_div.append(signal_nombre, signal_valor);
                signals_div.append(signal_div);

            }
        });

        this.root = btn_goParticular;

        info_div.append(img_estacion_div, signals_div);
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

        EventsManager.Instance.EmitirEvento("Cerrar");
    }

    update() {
        if (this.estacion) {
            const estacionUpdate = Core.Instance.GetDatosEstacion(this.estacion.IdEstacion);
            
            estacionUpdate.Signals.forEach(signal => {
                if(signal.TipoSignal == 1){
                    let valor_signal = this.HTMLUpdateElements[`signal_${signal.IdSignal}`];
                    valor_signal.innerHTML = `${estacionUpdate.Signals[0].Valor} m`;
                    valor_signal.style.color = `${estacionUpdate.Signals[0].GetValorColor()}`;
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