import Linea from "./Linea.js";
import Signal from "./Signal.js";
import { Core } from "../Core.js";
import {
    EnumTipoSignal,
    EnumModule,
    EnumTipoSignalNomenclatura,
    EnumDentroLimite,
    EnumEnlace,
} from "../Utilities/Enums.js";

class Estacion {
    constructor(estacionCruda) {
        this.IdEstacion = estacionCruda.idEstacion;
        this.Nombre = estacionCruda.nombre;
        this.Latitud = estacionCruda.latitud;
        this.Longitud = estacionCruda.longitud;
        this.Tiempo = estacionCruda.tiempo;
        this.Enlace = estacionCruda.enlace;
        this.Abreviacion = estacionCruda.abreviacion;
        this.TipoEstacion = estacionCruda.TipoEstacion;
        this.Lineas = this.#EstablecerLineas(estacionCruda.lineas);
        /**
         * @type {[Signal]}
         */
        this.Signals = this.#EstablecerSignals(estacionCruda.signals);
    }
    /**
     *
     * @param {jsonArray} lineasCrudas
     * @returns {[Linea]}
     */
    #EstablecerLineas(lineasCrudas) {
        return lineasCrudas.map((lineaCruda) => new Linea(lineaCruda));
    }
    #EstablecerSignals(signalsCrudas) {
        return signalsCrudas.map((signalCruda) => new Signal(signalCruda));
    }
    ObtenerPrimerSignal() {
        if (this.Signals.length > 0) {
            if (!this.Signals[0].Nombre.includes("Bomba"))
                return this.Signals[0];
            else
                return 0
        }
    }
    /**
     *
     * @param {keyof EnumTipoSignal} EnumTipoSignal
     * @returns {[Signal]}
     */
    ObtenerSignalPorTipoSignal(EnumTipoSignal) {
        return (
            this.Signals.filter((signal) => signal.TipoSignal == EnumTipoSignal) ?? []
        );
    }
    ObtenerBombasPorLinea(idLinea) {
        this.Signals.filter(
            (signal) =>
                signal.TipoSignal == EnumTipoSignal.Bomba && signal.Linea == idLinea
        );
    }

    /**
     * @returns {string} fecha con formato
     */
    ObtenerFecha() {
        let stringDate = this.Tiempo;
        if (stringDate.includes("Date")) {
            stringDate = stringDate.split("(")[1].split(")")[0];
            stringDate = new Date(parseInt(stringDate));
        } else {
            stringDate = new Date(stringDate);
        }
        let fullYear = stringDate.getFullYear();
        let month = stringDate.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        let day = stringDate.getDate();
        day = day < 10 ? "0" + day : day;
        let hours = stringDate.getHours();
        hours = hours < 10 ? "0" + hours : hours;
        let minutes = stringDate.getMinutes();
        minutes = minutes < 10 ? "0" + minutes : minutes;
        let seconds = stringDate.getSeconds();
        seconds = seconds < 10 ? "0" + seconds : seconds;
        stringDate =
            day + "/" + month + "/" + fullYear + " " + hours + ":" + minutes;

        return stringDate;
    }
    ObtenerValorPerillaBomba(ordinalBomba) {
        const perillas = this.Signals.filter(
            (signal) => signal.TipoSignal == EnumTipoSignal.PerillaBomba
        );
        if (perillas) {
            return perillas[ordinalBomba];
        }
    }
    /**
     * Indica si la estacion esta en linea
     * @returns {boolean}
     */
    EstaEnLinea() {
        return this.Enlace >= EnumEnlace.Radio && this.Enlace <= EnumEnlace.Hibrido;
    }

    /**
     *
     * @param {Signal} signal
     * @param {keyof EnumModule} modulo
     */
    ObtenerRenderNivelOBomba(signal, modulo) {
        if (
            signal.TipoSignal != EnumTipoSignal.Nivel &&
            signal.TipoSignal != EnumTipoSignal.Bomba
        ) {
            return "";
        }

        const carpetaTipoSignal = signal.TipoSignal == EnumTipoSignal.Nivel ? "l" : "b";
        let indiceImagen = "";

        if (signal.TipoSignal == EnumTipoSignal.Nivel) {
            if (signal.DentroRango) {
                if (signal.DentroLimite == EnumDentroLimite.Alto) {
                    indiceImagen = "10r";
                }
                else {
                    indiceImagen = signal.IndiceImagen;
                }
            }
            else {
                indiceImagen = "r";
            }
        }
        else {
            if (signal.Valor <= 4) {
                indiceImagen = signal.Valor;
            }
            else {
                indiceImagen = "0";
            }
        }

        const url = `${Core.Instance.ResourcesPath}Sitios/${this.Abreviacion
            }/${modulo}/${carpetaTipoSignal}/${EnumTipoSignalNomenclatura[signal.TipoSignal]
            }${signal.Ordinal + 1}_${indiceImagen}.png?v=${Core.Instance.version}`;

        return url;
    }

    /**
     * 
     * @param {number} idSignal 
     * @returns {Signal}
     */
    ObtenerSignal(idSignal) {
        return this.Signals.find(signal => signal.IdSignal == idSignal);
    }

    ObtenerPerillaGeneral(ordinalLinea = 0) {
        return this.Signals.filter(signal => signal.TipoSignal == EnumTipoSignal.PerillaGeneral)[ordinalLinea];

    }

    IsTimeout(){
        let tolerancia = 15 * 60;
        let diff = (new Date().getTime() - new Date(this.Tiempo).getTime()) / 1000;
        return diff > tolerancia;
    }
}

export default Estacion;
