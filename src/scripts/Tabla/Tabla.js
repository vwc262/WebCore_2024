import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { EnumEnlace, EnumTipoSignal } from "../Utilities/Enums.js";
import { ExtraRowVariables } from "./ExtraRowVariables.js";
import { Row } from "./Row.js";
import { RowVariables } from "./RowVariables.js";

/**
 * @returns {Tabla}
 */
class Tabla {
    /**
     * @type {[Row]}
     */
    rows = [];

    /**
     * @type {[RowVariables]}
     */
    rowVariables = [];

    constructor() {

        /**
         * @type {HTMLElement}
         */
        this.tBody = document.querySelector('.curved-tBody');
        this.tBodyVariablesContainer = document.querySelector('.curved-table-variables-container');

        this.cantidadElementos = Core.Instance.data.length;
        this.indice = 0;
        this.offset = {
            extraRows: 0,
            actualIndex: 0,
        };
        this.elementosVisibles = 15;

        this.extraRows = [];

        this.curvedRows = document.getElementsByClassName('curved-Row');
        this.curvedRowsVariables = document.getElementsByClassName('curved-Row-variables');

        // Mouse wheel event
        this.tBody.addEventListener('wheel', (event) => {
            let upwards = event.wheelDelta > 0 || event.detail < 0;
            this.setScrollDirection(upwards);
        });

        // Mouse wheel event (older browsers)
        this.tBody.addEventListener('mousewheel', (event) => {
            let upwards = event.wheelDelta > 0 || event.detail < 0;
            this.setScrollDirection(upwards);
        });

        // Touch move event
        this.tBody.addEventListener('touchmove', (event) => {
            console.log('Touch move event');
            // Your code here
        });

        this.btnTabla = document.querySelector('.btnTabla');
        this.btnTabla.style.background = `url("${Core.Instance.ResourcesPath}General/btn_abrir.png?v=10")`;
        this.btnTabla.addEventListener('click', () => {

            let visible = this.tBodyVariablesContainer.getAttribute('visible');
            if (visible == null || visible == undefined) visible = false;
            else if (visible == '0') visible = false;
            else visible = true;

            this.tBodyVariablesContainer.setAttribute('visible', `${visible ? '0' : '1'}`);
            this.tBodyVariablesContainer.style = `right:${visible ? '-455' : '475'}px;`;
            this.btnTabla.style.background = `url("${Core.Instance.ResourcesPath}General/${visible ? 'btn_abrir' : 'btn_abrirrotate'}.png?v=10")`;
        });

        this.columns = {
            1: Core.Instance.data.filter(estacion => estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Nivel).length > 0),
            2: Core.Instance.data.filter(estacion => estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Presion).length > 0),
            3: Core.Instance.data.filter(estacion => estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Gasto).length > 0),
            4: Core.Instance.data.filter(estacion => estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Totalizado).length > 0),
            5: Core.Instance.data.filter(estacion => estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.ValvulaAnalogica).length > 0),
            6: Core.Instance.data.filter(estacion => estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.ValvulaDiscreta).length > 0),
            7: Core.Instance.data.filter(estacion => estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Bomba).length > 0),
            9: Core.Instance.data.filter(estacion => estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.PerillaGeneral).length > 0),
            10: Core.Instance.data.filter(estacion => estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Voltaje).length > 0),
            12: Core.Instance.data.filter(estacion => estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.FallaAC).length > 0),
            15: Core.Instance.data.filter(estacion => estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.PuertaAbierta).length > 0),
        }

        Object.keys(this.columns).forEach(key => {
            if (this.columns[key].length == 0) {
                let th = document.querySelector(`.thContainer[tag="${key}"]`);
                th.remove();
                delete this.columns[key];
            } else this.columns[key] = [];
        });

        this.online = document.querySelector('.texto-resumen[tag="online"]');
        this.offline = document.querySelector('.texto-resumen[tag="offline"]');
        this.mantenimiento = document.querySelector('.texto-resumen[tag="mantenimiento"]');

        Object.keys(EnumTipoSignal).forEach(key => {
            let th = document.querySelector(`.thContainer[tag="${EnumTipoSignal[key]}"]`);
            if (th != null) {
                let img = th.firstElementChild;
                img.setAttribute('src', `${Core.Instance.ResourcesPath}Encabezados/${key}.png?v=0`);
            }
        });

        let fondoTabla = document.querySelector(`.fondo-tabla`);
        fondoTabla.setAttribute('src', `${Core.Instance.ResourcesPath}General/fondoTabla.png?v=0`);

        let fondoTablaVariables = document.querySelector(`.fondo-tabla-variables`);
        fondoTablaVariables.setAttribute('src', `${Core.Instance.ResourcesPath}General/tablaVariables.png?v=0`);

        let summaryFondo = document.querySelector(`.contenedor-resumen`);
        summaryFondo.style.background = `url(${Core.Instance.ResourcesPath}General/Summary.png?v=0)`;

    }

    /**
     * 
     * @param {boolean} upwards direccion (hacia arriba)
     */
    setScrollDirection(upwards) {
        this.indice += upwards ? 1 : -1

        this.refreshTable();
    }

    refreshTable() {

        if (this.indice < -(this.cantidadElementos - this.elementosVisibles) /*- (this.cantidadElementos - this.elementosVisibles + this.indice < this.offset.extraRows ? this.offset.extraRows : 0)*/) {
            this.indice = -(this.cantidadElementos - this.elementosVisibles) /*- (this.cantidadElementos - this.elementosVisibles + this.indice < this.offset.extraRows ? this.offset.extraRows : 0)*/;
        }
        if (this.indice > 0) {
            this.indice = 0;
        }

        let indexCurvedRows = 0;
        let indexEstacion = -this.indice;

        Object.keys(this.extraRows).forEach(key => {
            this.extraRows[key].rowContainer.remove();
            delete this.extraRows[key];
        });

        for (let indexRow = -this.indice; indexRow < Core.Instance.data.length; indexRow++) {
            const estacion = Core.Instance.data[indexEstacion];
            let row = this.rows[indexRow];
            let rowVariables = this.rowVariables[indexRow];

            row.IdEstacion = estacion.IdEstacion;
            rowVariables.IdEstacion = estacion.IdEstacion;

            if (this.curvedRows[indexCurvedRows] != undefined) {
                this.curvedRows[indexCurvedRows].innerHTML = '';
                this.curvedRows[indexCurvedRows].appendChild(row.rowContainer);

                this.curvedRowsVariables[indexCurvedRows].innerHTML = '';
                this.curvedRowsVariables[indexCurvedRows].style.background = 'linear-gradient(90deg, rgba(70, 95, 138, 0.35) 0%, rgba(70, 95, 138, 0.35) 60%, rgba(0, 0, 0, 0.75) 90%)';
                this.curvedRowsVariables[indexCurvedRows].appendChild(rowVariables.rowContainer);

                if (indexRow >= this.offset.actualIndex && indexRow < this.offset.actualIndex + this.offset.extraRows) {
                    for (let ordinalSignal = 1; ordinalSignal <= this.offset.extraRows; ordinalSignal++) {

                        indexRow++;
                        indexCurvedRows++;

                        if (this.curvedRows[indexCurvedRows] != undefined) {
                            const columns = {};
                            Object.keys(this.columns).forEach(key => { columns[key] = []; });
                            this.extraRows.push(new ExtraRowVariables(estacion.IdEstacion, columns, ordinalSignal));
                            this.extraRows[this.extraRows.length - 1].create();

                            this.curvedRows[indexCurvedRows].innerHTML = '';

                            this.curvedRowsVariables[indexCurvedRows].innerHTML = '';
                            this.curvedRowsVariables[indexCurvedRows].style.background = 'linear-gradient(90deg, rgba(24, 64, 89, 0.5) 0%, rgba(24, 64, 89, 0.3) 60%, rgba(0, 0, 0, 0) 90%)';
                            this.curvedRowsVariables[indexCurvedRows].appendChild(this.extraRows[this.extraRows.length - 1].rowContainer);
                        }

                    }
                }
            }

            row.Update();
            rowVariables.Update(indexRow);

            indexEstacion++;
            indexCurvedRows++;

            // if (indexCurvedRows >= this.elementosVisibles )
            //     return;
        }
    }

    create() {
        let indexCurvedRows = 0;
        for (let indexEstacion = -this.indice; indexEstacion < Core.Instance.data.length; indexEstacion++) {
            const estacion = Core.Instance.data[indexEstacion];

            const columns = {};
            Object.keys(this.columns).forEach(key => { columns[key] = []; });

            this.rows.push(new Row(estacion.IdEstacion,
                function (mouseover, IdEstacion) {
                    this.hoverRow(mouseover, IdEstacion);
                }.bind(this)));
            this.rowVariables.push(new RowVariables(estacion.IdEstacion, columns, 0, this.offset, indexEstacion,
                function () {
                    this.refreshTable();
                }.bind(this), function (mouseover, IdEstacion) {
                    this.hoverRow(mouseover, IdEstacion);
                }.bind(this)));

            const row = this.rows[this.rows.length - 1];
            row.create();
            const rowVariables = this.rowVariables[this.rowVariables.length - 1];
            rowVariables.create();

            if (this.curvedRows[indexCurvedRows] != undefined) {
                this.curvedRows[indexCurvedRows].innerHTML = '';
                this.curvedRows[indexCurvedRows].appendChild(row.rowContainer);

                this.curvedRowsVariables[indexCurvedRows].innerHTML = '';
                this.curvedRowsVariables[indexCurvedRows].appendChild(rowVariables.rowContainer);
            }

            indexCurvedRows++;
        }

        let onlineCount = Core.Instance.data.filter(estacion => estacion.Enlace != EnumEnlace.FueraLinea).length;
        let offlineCount = Core.Instance.data.length - onlineCount;

        this.online.innerHTML = onlineCount
        this.offline.innerHTML = offlineCount;
        this.mantenimiento.innerHTML = 0;

        this.suscribirEventos();
        this.update();
    }

    hoverRow(mouseover, IdEstacion) {
        let row = this.rows.find((f) => f.IdEstacion == IdEstacion);
        let rowVariable = this.rowVariables.find((f) => f.IdEstacion == IdEstacion);

        row.rowContainer.style.background = `${mouseover ? 'rgba(87,168,152,0.35)' : 'rgba(87,168,152,0.0)'} `;
        rowVariable.rowContainer.style.background = `${mouseover ? 'rgba(87,168,152,0.35)' : 'rgba(87,168,152,0.0)'} `;
    }

    update() {

        let onlineCount = Core.Instance.data.filter(estacion => estacion.Enlace != EnumEnlace.FueraLinea).length;
        let offlineCount = Core.Instance.data.length - onlineCount;

        this.online.innerHTML = onlineCount
        this.offline.innerHTML = offlineCount;
        this.mantenimiento.innerHTML = 0;
    }

    suscribirEventos() {
        EventsManager.Instance.Suscribirevento('Update', new EventoCustomizado(() => this.update()));
    }
}

export { Tabla };