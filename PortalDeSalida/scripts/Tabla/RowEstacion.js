import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { EnumSemaforo } from "../Utilities/Enums.js";
import { infoRowEstacion } from "./infoRowEstacion.js";

/**
 * @returns {RowEstacion}
 */
class RowEstacion {

    /**
     * 
     * @param {estacion} Estacion 
     */
    /**
     * @type {HTMLElement}
     */
    HTMLUpdateElements = {};

    /**
     * 
     * @param {HTMLElement} container 
     * @param {Estacion} estacion 
     * @param {String} interceptor 
     */
    constructor(container, estacion, interceptor) {
        this.HTMLUpdateElements = {};
        this.estacion = estacion;
        this.interceptor = interceptor;

        let row_est_div = document.createElement('div');
        row_est_div.classList = 'estacion_row';

        let data_row = document.createElement('div');
        data_row.classList = 'data_row';
        data_row.addEventListener('mouseover', this.onmouseover.bind(this));
        data_row.addEventListener('mouseout', this.onmouseout.bind(this));

        let id_estacion_div = document.createElement('div');
        id_estacion_div.classList = 'Columna_ID estacion_ID';
        id_estacion_div.innerHTML = `${this.estacion.IdEstacion}`;

        let nombre_estacion_div = document.createElement('div');
        nombre_estacion_div.classList = 'Columna_Nombre estacionNombre';

        let estado_estacion = document.createElement('img');
        estado_estacion.classList = 'Columna_EstacionEnlace';
        estado_estacion.id = `Tabla_enlace_${this.estacion.IdEstacion}`;
        estado_estacion.src = `${Core.Instance.ResourcesPath}Tabla/sitio_offline.png?v=${Core.Instance.version}`;
        this.alojarElementoDinamico([estado_estacion]);

        let nombre_estacion = document.createElement('div');
        nombre_estacion.classList = 'Columna_EstacionNombre';
        nombre_estacion.innerHTML = `${this.estacion.Nombre}`;

        let alerta_estacion = document.createElement('img');
        alerta_estacion.id = `Tabla_alerta_${this.estacion.IdEstacion}`;
        alerta_estacion.classList = 'alertaEstacion Columna_EstacionAlerta'
        alerta_estacion.src = `${Core.Instance.ResourcesPath}Tabla/sitioAlerta.png?v=${Core.Instance.version} 0% 0% / contain no-repeat`;
        this.alojarElementoDinamico([alerta_estacion]);

        // let valor_estacion = document.createElement('div');
        // valor_estacion.classList = 'Columna_Nivel estacion_Nivel';
        // valor_estacion.id = `Tabla_nivel_${this.estacion.IdEstacion}`;
        // valor_estacion.innerHTML = `${this.estacion?.Signals.length > 0 ? this.estacion?.Signals?.[0]?.Valor + " m" : "NA"}`;
        // this.alojarElementoDinamico([valor_estacion]);

        let fecha_estacion = document.createElement('div');
        fecha_estacion.classList = 'Columna_Fecha estacion_Fecha';
        fecha_estacion.id = `Tabla_fecha_${this.estacion.IdEstacion}`;
        fecha_estacion.innerHTML = `${this.estacion.ObtenerFecha().split(" ")[0]}`;
        this.alojarElementoDinamico([fecha_estacion]);

        let hora_estacion = document.createElement('div');
        hora_estacion.classList = 'Columna_Hora estacion_Hora';
        hora_estacion.id = `Tabla_hora_${this.estacion.IdEstacion}`;
        hora_estacion.innerHTML = `${this.estacion.ObtenerFecha().split(" ")[1]}`;
        this.alojarElementoDinamico([hora_estacion]);

        this.signals_estacion_div = document.createElement('div');
        this.signals_estacion_div.classList = 'signals_estacion';

        nombre_estacion_div.append(estado_estacion, nombre_estacion, alerta_estacion);
        // data_row.append(id_estacion_div, nombre_estacion_div, valor_estacion, fecha_estacion, hora_estacion);
        data_row.append(id_estacion_div, nombre_estacion_div, fecha_estacion, hora_estacion);
        row_est_div.append(data_row, this.signals_estacion_div);

        container.appendChild(row_est_div);

        this.root = row_est_div;
    }

    /**
     * 
     * @param {[HTMLElement]} elementos 
     */
    alojarElementoDinamico(elementos) {
        elementos.forEach((elemento) => {
            this.HTMLUpdateElements[elemento.id] = elemento;
        });
    }

    Init() {

        this.root.addEventListener('click', this.onclick.bind(this));

        let inforowEstacion = new infoRowEstacion(this.signals_estacion_div, this.estacion, this.interceptor);
        inforowEstacion.Init();

        this.suscribirEventos();
        this.update();
    }


    onmouseover() {
        EventsManager.Instance.EmitirEvento(
            "OnMouseHoverEstacion",
            this.estacion
        );
    }

    onmouseout() {
        // EventsManager.Instance.EmitirEvento(
        //     "OnMouseOutEstacion",
        //     this.estacion
        // );
    }

    onclick() {
        // this.signals_estacion_div.style.display = this.signals_estacion_div.style.display === "none" || this.signals_estacion_div.style.display === "" ? "flex" : "none";
    }

    cerrarTodo() {
        this.signals_estacion_div.style.display = "none";
    }

    update = () => {
        if (this.estacion) {
            const estacionUpdate = Core.Instance.GetDatosEstacion(this.estacion.IdEstacion);
            const valor = estacionUpdate?.Signals?.[0]?.Valor;

            const offline = !estacionUpdate.EstaEnLinea();
            let enlace = offline == true ? "offline" : "online";
            let mostrarAlerta = false;

            let estado_estacion = this.HTMLUpdateElements[`Tabla_enlace_${estacionUpdate.IdEstacion}`];
            let alerta_estacion = this.HTMLUpdateElements[`Tabla_alerta_${this.estacion.IdEstacion}`];
            // let valor_estacion = this.HTMLUpdateElements[`Tabla_nivel_${estacionUpdate.IdEstacion}`];
            let fecha_estacion = this.HTMLUpdateElements[`Tabla_fecha_${estacionUpdate.IdEstacion}`];
            let hora_estacion = this.HTMLUpdateElements[`Tabla_hora_${estacionUpdate.IdEstacion}`];
            let formatoFecha = estacionUpdate.ObtenerFecha().split(" ");

            for (const signal of estacionUpdate.Signals) {
                const semaforo = signal.GetEnumSemaforo();

                if (semaforo === EnumSemaforo.Critico || semaforo === EnumSemaforo.Preventivo) {
                    mostrarAlerta = true;
                    break;
                }
            }

            estado_estacion.src = `${Core.Instance.ResourcesPath}Tabla/sitio_${enlace}.png?v=${Core.Instance.version}`;
            // valor_estacion.innerHTML = `${estacionUpdate.Signals.length > 0 ? estacionUpdate.Signals[0].DentroRango ? estacionUpdate.Signals[0].Valor + " m" : '--- m' : "NA"}`;
            // valor_estacion.style.color = `${estacionUpdate.Signals[0]?.GetColorSemaforo('floralwhite')}`;
            fecha_estacion.innerHTML = `${formatoFecha[0]}`;
            hora_estacion.innerHTML = `${formatoFecha[1]}`;
            alerta_estacion.style.display = mostrarAlerta ? 'flex' : 'none';
        }
    };

    suscribirEventos() {
        EventsManager.Instance.Suscribirevento(
            "Update",
            new EventoCustomizado(this.update)
        );
        EventsManager.Instance.Suscribirevento(
            "Cerrar",
            new EventoCustomizado(() => this.cerrarTodo())
        );
    }
}
export { RowEstacion }