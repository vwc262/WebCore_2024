import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { EnumEnlace } from "../Utilities/Enums.js";
import { RowEstacion } from "./RowEstacion.js";

/**
 * @returns {Interceptor}
 */
class Interceptor {
    /**
     * 
     * @param {estacion} Estacion 
     */
    /**
     * @type {HTMLElement}
     */
    HTMLUpdateElements = {};

    constructor(container, config) {

        let key_interceptor = config.key;
        this.nombre_interceptor = config.nombre;
        this.estaciones = config.ids;
        this.estacionesEnlaces = [];

        this.interceptor_div = document.createElement('div');
        this.interceptor_div.classList = 'interceptor';

        let row_div = document.createElement('div');
        row_div.classList = 'interceptor_row';

        let id_interceptor_div = document.createElement('div');
        id_interceptor_div.classList = 'id_interceptor';
        id_interceptor_div.innerHTML = `${key_interceptor}`;

        let nombre_interceptor_div = document.createElement('div');
        nombre_interceptor_div.classList = 'nombre_interceptor';
        nombre_interceptor_div.innerHTML = `${this.nombre_interceptor}`;

        let resumen_interceptor_div = document.createElement('div');
        resumen_interceptor_div.classList = 'resumen_interceptor';

        let online_num = document.createElement('div');
        online_num.id = "online_num";
        online_num.innerHTML = "5";
        this.alojarElementoDinamico([online_num]);

        let offline_num = document.createElement('div');
        offline_num.id = "offline_num";
        offline_num.innerHTML = "10";
        this.alojarElementoDinamico([offline_num]);

        let onlie_img = document.createElement('img');
        onlie_img.src = `${Core.Instance.ResourcesPath}Tabla/total_online.png?v=${Core.Instance.version}`;

        let offline_img = document.createElement('img');
        offline_img.src = `${Core.Instance.ResourcesPath}Tabla/total_offline.png?v=${Core.Instance.version}`;

        resumen_interceptor_div.append(online_num, onlie_img, offline_num, offline_img)

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

        alojarElementoDinamico(elementos) {
        elementos.forEach((elemento) => {
            this.HTMLUpdateElements[elemento.id] = elemento;
        });
    }

    Init() {

        this.root.addEventListener('click', this.onclick.bind(this));
        this.root.addEventListener('onmouseover', this.onmouseover);

        this.estaciones.forEach(idEstacion => {
            let estacion = Core.Instance.GetDatosEstacion(idEstacion);
            this.estacionesEnlaces.push(estacion)
            let rowEstacion = new RowEstacion(this.estaciones_interceptor_div, estacion, this.nombre_interceptor);
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
        let onfflineCount = 0;
        let totalSites = 0;

        this.estacionesEnlaces.forEach(estacion => {
            totalSites++;
            if(estacion.Enlace == EnumEnlace.FueraLinea){
                onfflineCount++;
            }
        });
    }

    suscribirEventos() {
        EventsManager.Instance.Suscribirevento(
            "Update",
            new EventoCustomizado(() => this.update())
        );
        // EventsManager.Instance.Suscribirevento(
        //     "Onevento",
        //     new EventoCustomizado((data) => {

        //     })
        // );
    }
}

export { Interceptor };