import Linea from "./Linea.js";
import Signal from "./Signal.js";
import { Core } from "../Core.js";
import {
    EnumTipoSignal,
    EnumModule,
    EnumTipoSignalNomenclatura,
    EnumDentroLimite,
    EnumEnlace,
    EnumProyecto,
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
        return signalsCrudas.filter(signalCruda => signalCruda.habilitar == 1).map((signalCruda) => new Signal(signalCruda));
    }
    ObtenerPrimerSignal() {
        // Parche para chiconautla
        const isChico = EnumProyecto.Chiconautla == Core.Instance.IdProyecto
        if (isChico) {
            if (!this.Signals[0].Nombre.includes("Bomba")) {
                var nivel = this.Signals.find(s => s.TipoSignal == EnumTipoSignal.Nivel);
                var signal = this.Signals.find(s => s.TipoSignal == EnumTipoSignal.Gasto);

                if (nivel != null && nivel != undefined) {
                    return signal;
                } else {
                    if (signal != null && signal != undefined)
                        return signal;
                    else
                        return this.Signals[0];
                }

            }
            else {

                return 0
            }
        } else {
            if (this.Signals.length > 0) {
                var nivel = this.Signals.find(s => s.TipoSignal == EnumTipoSignal.Nivel);
                var gasto = this.Signals.find(s => s.TipoSignal == EnumTipoSignal.Gasto);
                var presion = this.Signals.find(s => s.TipoSignal == EnumTipoSignal.Presion);

                if (nivel != null)
                    return nivel;
                else if (gasto != null)
                    return gasto;
                else if (presion != null)
                    return presion;
                else {
                    if (!this.Signals[0].Nombre.includes("Bomba"))
                        this.Signals[0]
                    else
                        return 0
                }
            }
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
        const estado = this.ObtenerEstadoEnlace();
        return !(estado.timeout || estado.offline);
    }

    ObtenerEstadoEnlace() {
        let valorEnlace = this.Enlace;

        let estado = {
            tipoEnlace: '',
            offline: false,
            textoEnlace: '',
            color: '',
            timeout: false,
            mantenimiento: false,
        };

        estado.offline = valorEnlace == EnumEnlace.FueraLinea;
        estado.timeout = this.IsTimeout();
        estado.mantenimiento = this.IsEnMantenimiento();

        estado.tipoEnlace =
            valorEnlace == EnumEnlace.Celular
                ? "C"
                : valorEnlace == EnumEnlace.Radio
                    ? "R"
                    : "CR";

        estado.textoEnlace = estado.timeout
            ? "Fuera de línea (Tiempo)"
            : estado.mantenimiento ?
                'En Mantenimiento' :
                estado.offline
                    ? "Fuera de línea"
                    : `En línea (${estado.tipoEnlace})`;

        estado.color = estado.timeout
            ? "rgb(129, 11, 11)"
            :
            estado.mantenimiento ?
                "rgb(129, 129, 129)"
                : estado.offline
                    ? "rgb(140, 13, 13)"
                    : "rgb(0, 128, 0)";

        return estado;
    }

    SetTurbulencia(signal, modulo) {
        let claseTurbulencia = "turbulence";
        if (!signal.DentroRango) {
            claseTurbulencia = '';
        }
        return claseTurbulencia;
    }

    /**
     *
     * @param {Signal} signal
     * @param {keyof EnumModule} modulo
     */
    ObtenerRenderNivelOBomba(signal, modulo) {

        let url = "";
        const carpetaTipoSignal = signal.TipoSignal == EnumTipoSignal.Nivel ? "l" : "b";
        let indiceImagen = "";
        if (Core.Instance.IdProyecto == EnumProyecto.Lerma) {
            const isBombaPurple = signal.Valor == 4;
            if (signal.Valor >= 0 && signal.Valor <= 4) {
                indiceImagen = signal.Valor;
            }
            else {
                indiceImagen = "0";
            }
            url = `${Core.Instance.ResourcesPath}Sitios/${this.Abreviacion
                }/${modulo}/${carpetaTipoSignal}/b${signal.Ordinal + 1}_${isBombaPurple ? 2 : indiceImagen}.png?v=${Core.Instance.version}`;
        }
        else {
            if (
                signal.TipoSignal != EnumTipoSignal.Nivel &&
                signal.TipoSignal != EnumTipoSignal.Bomba
            ) {
                return "";
            }

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
                if (signal.Valor >= 0 && signal.Valor <= 4) {
                    indiceImagen = signal.Valor;
                }
                else {
                    indiceImagen = "0";
                }
            }

            url = `${Core.Instance.ResourcesPath}Sitios/${this.Abreviacion
                }/${modulo}/${carpetaTipoSignal}/${EnumTipoSignalNomenclatura[signal.TipoSignal]
                }${signal.Ordinal + 1}_${indiceImagen}.png?v=${Core.Instance.version}`;
        }

        return url;
    }
    /**
     *
     * @param {Signal} signal
     * @param {keyof EnumModule} modulo
     */
    ObtenerRenderNivelOBombaLerma(signal) {
        let indiceImagen = "";
        let bombaMorada = signal.Valor == 4;
        indiceImagen = bombaMorada ? 2 : signal.Valor <= 3 ? signal.Valor : 0;
        const url = `${Core.Instance.ResourcesPath}Sitios/global/b1_${indiceImagen}.png?v=${Core.Instance.version}`;
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

    IsTimeout() {
        let tolerancia = 15 * 60;
        let diff = (new Date().getTime() - new Date(this.Tiempo).getTime()) / 1000;
        return diff > tolerancia;
    }

    IsEnMantenimiento() {
        // let enMantenimiento = this.ObtenerSignalPorTipoSignal(EnumTipoSignal.Mantenimiento);


        // if (enMantenimiento.length > 0) {
        //     return enMantenimiento[0].Valor == 0;
        // } else return false;

        // el mantenimiento se quita a peticion del doc -- 08/10/2024
        return false;
    }

    IsFallaAc() {
        let fallaAc = this.ObtenerSignalPorTipoSignal(EnumTipoSignal.FallaAC);
        if (fallaAc.length > 0)
            return fallaAc[0].Valor == 0;
        else return false;
    }
}

export default Estacion;
