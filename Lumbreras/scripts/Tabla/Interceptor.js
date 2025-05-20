import { Core } from "../Core.js";

/**
 * @returns {Interceptor}
 */
class Interceptor {


    constructor(container, config) {

        let key_interceptor = config.key;
        let nombre_interceptor = config.nombre;
        this.estaciones = config.ids;

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

        row_div.append(id_interceptor_div, nombre_interceptor_div, resumen_interceptor_div);
        container.appendChild(row_div);

        this.root = row_div;

        this.Init();

    }

    Init() {

        this.estaciones.forEach(idEstacion => {
            let estacion = Core.Instance.GetDatosEstacion(idEstacion);
            console.log(estacion);

            let div = document.createElement('div');

            div.addEventListener('click', this.onclick);
            div.addEventListener('onmouseover', this.onmouseover);
        });

        this.suscribirEventos();
        this.update();
    }


    onmouseover() {

    }

    onclick() {

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