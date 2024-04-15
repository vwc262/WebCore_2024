import { EnumTipoSignalNomenclatura, EnumUnidadesSignal, EnumTipoSignal, EnumValorValvulaDiscreta, EnumValorBomba, EnumPerillaGeneral, EnumFallaAC, EnumPuertaAbierta, EnumDentroLimite, EnumPerillaBomba } from "../Utilities/Enums.js";
import Semaforo from "./Semaforo.js";
class Signal {
    constructor(signalCruda) {
        this.IdSignal = signalCruda.idSignal;
        this.IdEstacion = signalCruda.idEstacion;
        this.Nombre = signalCruda.nombre;
        this.Valor = signalCruda.valor;
        this.TipoSignal = signalCruda.tipoSignal;
        this.Ordinal = signalCruda.ordinal;
        this.IndiceImagen = signalCruda.indiceImagen;
        this.DentroLimite = signalCruda.dentroLimite;
        this.DentroRango = signalCruda.dentroRango;
        this.Linea = signalCruda.linea;
        this.Semaforo = this.#EstablecerSemaforo(signalCruda.semaforo);
    }
    #EstablecerSemaforo(semaforoCrudo) {
        return new Semaforo(semaforoCrudo);
    }

    /**
     * 
     * @param {boolean} unidades si requiere unidades
     * @param {boolean} rayitas si requiere '---' o 'N/A'
     * @returns {string} valor signal tomando en cuenta DentroRango
     */
    GetValorString(unidades, rayitas) {
        return `${this.DentroRango ? parseFloat(this.Valor).toFixed() : rayitas ? '---' : 'No disponible'}${unidades && this.DentroRango ? EnumUnidadesSignal[this.TipoSignal] : ''}`;
    }

    /**
     * @returns {string} nomenclatura (ejem. N1)
     */
    GetNomenclaturaSignal() {
        return `${EnumTipoSignalNomenclatura[this.TipoSignal]}${this.Ordinal + 1}`;
    }

    GetValorColor() {

        let color = 'rgb(255, 255, 255)';

        switch (EnumTipoSignal) {
            case EnumTipoSignal.ValvulaDiscreta:
                color = `${this.DentroRango ? this.Valor == EnumValorValvulaDiscreta.Abierto ? 'rgb(223, 177, 49)' : 'rgb(203, 185, 136)' : 'rgb(255, 255, 255)'}`;
                break;
            case EnumTipoSignal.Bomba:
                color = `${this.DentroRango ? this.Valor == EnumValorBomba.Arrancada ? 'rgb(223, 177, 49)' : 'rgb(203, 185, 136)' : 'rgb(255, 255, 255)'}`;
                break;
            case EnumTipoSignal.PerillaGeneral:
                color = `${this.DentroRango ? this.Valor == EnumPerillaGeneral.Remoto ? 'rgb(223, 177, 49)' : 'rgb(203, 185, 136)' : 'rgb(255, 255, 255)'}`;
                break;
            case EnumTipoSignal.FallaAC:
                color = `${this.DentroRango ? this.Valor == EnumFallaAC.Normal ? 'rgb(223, 177, 49)' : 'rgb(203, 185, 136)' : 'rgb(255, 255, 255)'}`;
                break;
            case EnumTipoSignal.PuertaAbierta:
                color = `${this.DentroRango ? this.Valor == EnumPuertaAbierta.Normal ? 'rgb(223, 177, 49)' : 'rgb(203, 185, 136)' : 'rgb(255, 255, 255)'}`;
                break;
            case EnumTipoSignal.Nivel:
            case EnumTipoSignal.Presion:
            case EnumTipoSignal.Gasto:
            case EnumTipoSignal.Totalizado:
            case EnumTipoSignal.ValvulaAnalogica:
            case EnumTipoSignal.Voltaje:
                color = `${this.DentroRango ? this.DentroLimite == EnumDentroLimite.Bajo ? 'orange' : this.DentroLimite == EnumDentroLimite.Alto ? '#810b0b' : 'rgb(255, 255, 255)' : 'rgb(206 206 206 / 80%)'}`;
                break;
            default:
                break;
        }
        return color;
    }
    /**
     * 
     * @param {Signal} signalPerilla 
     */
    GetValorPerilla() {
        return EnumPerillaBomba[this.valor] ?? 'Off';
    }
    GetValorPerillaGeneral() {
        return EnumPerillaGeneral[this.valor] ?? 'Manual';
    }


}

export default Signal;