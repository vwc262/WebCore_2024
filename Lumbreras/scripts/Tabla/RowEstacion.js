import { infoRowEstacion } from "./infoRowEstacion.js";


/**
 * @returns {RowEstacion}
 */
class RowEstacion {

    /**
     * 
     * @param {estacion} Estacion 
     */
    constructor(container, estacion) {
        this.estacion = estacion;

        let row_est_div = document.createElement('div');
        row_est_div.classList = 'estacion_row';

        let data_row = document.createElement('div');
        data_row.classList = 'data_row';

        let id_estacion_div = document.createElement('div');
        id_estacion_div.classList = 'ColumnaID';
        id_estacion_div.innerHTML = `${this.estacion.IdEstacion}`;

        let nombre_estacion_div = document.createElement('div');
        nombre_estacion_div.classList = 'Columna_Nombre';

        let nombre_estacion = document.createElement('div');
        nombre_estacion.innerHTML = `${this.estacion.Nombre}`;

        let estado_estacion = document.createElement('img');
        estado_estacion.src = ``;

        let valor_estacion = document.createElement('div');
        valor_estacion.classList = 'Columna_Nivel';
        valor_estacion.id = `Tabla_nivel_${this.estacion.IdEstacion}`;
        valor_estacion.innerHTML = `${this.estacion.Signals[0].Valor}`;

        let fecha_estacion = document.createElement('div');
        fecha_estacion.classList = 'Columna_Fecha';
        fecha_estacion.id = `Tabla_fecha_${this.estacion.IdEstacion}`;
        fecha_estacion.innerHTML = `${this.estacion.Tiempo.split("T")[0]}`;

        let hora_estacion = document.createElement('div');
        hora_estacion.classList = 'Columna_hora';
        hora_estacion.id = `Tabla_hora_${this.estacion.IdEstacion}`;
        hora_estacion.innerHTML = `${this.estacion.Tiempo.split("T")[1]}`;

        this.signals_estacion_div = document.createElement('div');
        this.signals_estacion_div.classList = 'signals_estacion';

        nombre_estacion_div.append(estado_estacion, nombre_estacion)
        data_row.append(id_estacion_div, nombre_estacion_div, valor_estacion, fecha_estacion, hora_estacion)
        row_est_div.append(data_row, this.signals_estacion_div);

        container.appendChild(row_est_div);

        this.root = row_est_div;
    }

    Init() {

        this.root.addEventListener('click', this.onclick.bind(this));
        this.root.addEventListener('onmouseover', this.onmouseover);

        let inforowEstacion = new infoRowEstacion(this.signals_estacion_div, this.estacion);
        inforowEstacion.Init();

        this.suscribirEventos();
        this.update();
    }


    onmouseover() {

    }

    onclick() {
        // info_estacion_row
        
        this.signals_estacion_div.style.display = this.signals_estacion_div.style.display === "none" || this.signals_estacion_div.style.display === "" ? "flex" : "none";
    }


    update() {

    }

    suscribirEventos() {
        // EventsManager.Instance.Suscribirevento(
        //     "Update",
        //     new EventoCustomizado(() => this.update())
        // );
        // EventsManager.Instance.Suscribirevento(
        //     "Onevento",
        //     new EventoCustomizado((data) => {

        //     })
        // );
    }
}
export { RowEstacion }