import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { infoRowEstacion } from "./infoRowEstacion.js";

/**
 * @returns {RowEstacionBuscador}
 */
class RowEstacionBuscador {

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
        row_est_div.classList = 'estacion_rowBuscador';

        let data_row = document.createElement('div');
        data_row.classList = 'data_rowBuscador';

        let id_estacion_div = document.createElement('div');
        id_estacion_div.classList = 'Columna_ID estacion_ID';
        id_estacion_div.innerHTML = `${this.estacion.IdEstacion}`;

        let nombre_estacion_div = document.createElement('div');
        nombre_estacion_div.classList = 'Columna_Nombre estacionNombre';

        let nombre_estacion = document.createElement('div');
        nombre_estacion.innerHTML = `${this.estacion.Nombre}`;

        let estado_estacion = document.createElement('img');
        estado_estacion.id = `Tabla_enlace_${this.estacion.IdEstacion}`;
        estado_estacion.src = `${Core.Instance.ResourcesPath}Tabla/sitio_offline.png?v=${Core.Instance.version}`;
        this.alojarElementoDinamico([estado_estacion]);

        let valor_estacion = document.createElement('div');
        valor_estacion.classList = 'Columna_Nivel estacion_Nivel';
        valor_estacion.id = `Tabla_nivel_${this.estacion.IdEstacion}`;
        valor_estacion.innerHTML = `${this.estacion.Signals[0].Valor} m`;
        this.alojarElementoDinamico([valor_estacion]);

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
        this.signals_estacion_div.classList = 'signals_estacionBuscador';

        nombre_estacion_div.append(estado_estacion, nombre_estacion)
        data_row.append(id_estacion_div, nombre_estacion_div, valor_estacion, fecha_estacion, hora_estacion)
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
        this.root.addEventListener('onmouseover', this.onmouseover);

        let inforowEstacion = new infoRowEstacion(this.signals_estacion_div, this.estacion, this.interceptor);
        inforowEstacion.Init();

        this.suscribirEventos();
        this.update();
    }


    onmouseover() {

    }

    onclick() {
        this.signals_estacion_div.style.display = this.signals_estacion_div.style.display === "none" || this.signals_estacion_div.style.display === "" ? "flex" : "none";
    }

    cerrarTodo() {
       this.signals_estacion_div.style.display = "none";
    }

    update = () => {
        if (this.estacion) {
            const estacionUpdate = Core.Instance.GetDatosEstacion(this.estacion.IdEstacion);

            const offline = !estacionUpdate.EstaEnLinea();
            let enlace = offline == true ? "offline" : "online";

            let estado_estacion = this.HTMLUpdateElements[`Tabla_enlace_${estacionUpdate.IdEstacion}`];
            let valor_estacion = this.HTMLUpdateElements[`Tabla_nivel_${estacionUpdate.IdEstacion}`];
            let fecha_estacion = this.HTMLUpdateElements[`Tabla_fecha_${estacionUpdate.IdEstacion}`];
            let hora_estacion = this.HTMLUpdateElements[`Tabla_hora_${estacionUpdate.IdEstacion}`];
            let formatoFecha = estacionUpdate.ObtenerFecha().split(" ");

            estado_estacion.src = `${Core.Instance.ResourcesPath}Tabla/sitio_${enlace}.png?v=${Core.Instance.version}`;
            valor_estacion.innerHTML = `${estacionUpdate.Signals[0].Valor} m`;
            valor_estacion.style.color = `${estacionUpdate.Signals[0].GetValorColor()}`;
            fecha_estacion.innerHTML = `${formatoFecha[0]}`;
            hora_estacion.innerHTML = `${formatoFecha[1]}`;
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
export { RowEstacionBuscador }