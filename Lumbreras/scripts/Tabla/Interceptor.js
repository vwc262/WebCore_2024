import { Core } from "../Core.js";
import { RowEstacion } from "./RowEstacion.js";

/**
 * @returns {Interceptor}
 */
class Interceptor {

    constructor(container, config) {

        let key_interceptor = config.key;
        let nombre_interceptor = config.nombre;
        this.estaciones = config.ids;

        this.interceptor_div = document.createElement('div');
        this.interceptor_div.classList = 'interceptor';

        let row_div = document.createElement('div');
        row_div.classList = 'interceptor_row';

        let id_interceptor_div = document.createElement('div');
        id_interceptor_div.classList = 'id_interceptor';
        id_interceptor_div.innerHTML = `${key_interceptor}`;

        let nombre_interceptor_div = document.createElement('div');
        nombre_interceptor_div.classList = 'nombre_interceptor';
        nombre_interceptor_div.innerHTML = `${nombre_interceptor}`;

        let resumen_interceptor_div = document.createElement('div');
        resumen_interceptor_div.classList = 'resumen_interceptor';

        this.estaciones_interceptor_div = document.createElement('div');
        this.estaciones_interceptor_div.classList = 'estaciones_interceptor';

        /* ============ Header Estaciones ================*/

        let estaciones_header_div = document.createElement('div');
        estaciones_header_div.classList = 'estaciones_header';

        let id_estacion = document.createElement('div');
        id_estacion.classList = 'Columna_ID';
        id_estacion.innerHTML = 'ID';

        let nombre_estacion = document.createElement('div');
        nombre_estacion.classList = 'Columna_Nombre';
        nombre_estacion.innerHTML = 'Nombre';

        let nivel_estacion = document.createElement('div');
        nivel_estacion.classList = 'Columna_Nivel';
        nivel_estacion.innerHTML = 'Nivel';

        let fecha_estacion = document.createElement('div');
        fecha_estacion.classList = 'Columna_Fecha';
        fecha_estacion.innerHTML = 'Fecha';

        let hora_estacion = document.createElement('div');
        hora_estacion.classList = 'Columna_hora';
        hora_estacion.innerHTML = 'Hora';

        estaciones_header_div.append(id_estacion, nombre_estacion, nivel_estacion, fecha_estacion, hora_estacion);
        this.estaciones_interceptor_div.append(estaciones_header_div);

        /* ============== apendizar divs =================== */

        row_div.append(id_interceptor_div, nombre_interceptor_div, resumen_interceptor_div);
        this.interceptor_div.append(row_div, this.estaciones_interceptor_div);

        container.appendChild(this.interceptor_div);

        this.root = row_div;

    }

    Init() {

        this.root.addEventListener('click', this.onclick.bind(this));
        this.root.addEventListener('onmouseover', this.onmouseover);

        this.estaciones.forEach(idEstacion => {
            let estacion = Core.Instance.GetDatosEstacion(idEstacion);
            let rowEstacion = new RowEstacion(this.estaciones_interceptor_div, estacion);
            rowEstacion.Init();
        });

        this.suscribirEventos();
        this.update();
    }


    onmouseover() {
        
    }
    
    onclick() {
        this.estaciones_interceptor_div.style.display = this.estaciones_interceptor_div.style.display === "none" || this.estaciones_interceptor_div.style.display === "" ? "flex" : "none";
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

export { Interceptor };