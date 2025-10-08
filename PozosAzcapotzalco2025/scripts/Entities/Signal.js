import { Core } from "../Core.js";
import { EnumTipoSignalNomenclatura, EnumUnidadesSignal, EnumTipoSignal, EnumValorValvulaDiscreta, EnumValorBomba, EnumPerillaGeneral, EnumFallaAC, EnumPuertaAbierta, EnumDentroLimite, EnumPerillaBombaString, EnumPerillaGeneralString, EnumUnidadesSignalClima } from "../Utilities/Enums.js";
import Linea from "./Linea.js";
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

        if (this.TipoSignal == EnumTipoSignal.ValvulaDiscreta) {
            // if (this.DentroRango) {

            if (parseInt(this.Valor) == EnumValorValvulaDiscreta.Abierto) {
                return 'Abierta';
            }
            else if (parseInt(this.Valor) == EnumValorValvulaDiscreta.Cerrado) {
                return 'Cerrada';
            }
            else {
                return 'N/D';
            }
            // }
            // else {
            //     return '---';
            // }
        }
        else if (this.TipoSignal == EnumTipoSignal.Bomba) {
            // if (this.DentroRango) {

            if (parseInt(this.Valor) == EnumValorBomba.Apagada) {
                return 'Apagada';
            }
            else if (parseInt(this.Valor) == EnumValorBomba.Arrancada) {
                return 'Encendida';
            }
            else if (parseInt(this.Valor) == EnumValorBomba.Falla) {
                return 'Con falla';
            }
            else {
                return 'N/D';
            }
            // }
            // else {
            //     return '---';
            // }
        }
        else if (this.TipoSignal == EnumTipoSignal.PerillaGeneral) {
            // if (this.DentroRango) {
            return this.GetValorPerillaGeneral();
            // } else {
            //     return '---';
            // }
        }
        else if (this.TipoSignal == EnumTipoSignal.FallaAC) {
            // if (this.DentroRango) {

            if (this.Valor) {
                return 'OK';
            } else {
                return 'Falla';
            }
            // } else {
            //     return '---';
            // }
        }
        else if (this.TipoSignal == EnumTipoSignal.PuertaAbierta) {
            // if (this.DentroRango) {
           /* if (this.Valor >= 250 && this.Valor <= 259) {
                return 'Cerrada';
            } if (this.Valor >= 510 && this.Valor <= 519) {
                return 'Abierta';
            } if (this.Valor >= 760 && this.Valor <= 779) {
                return 'Alarmada';
            } else {
                return '';
            }*/

            switch (this.Valor) {
                case 0:
                    return 'Abierta';
                    break;
                case 1:
                    return 'Cerrada';
                    break;
                default:
                    return '';
                    break;
            }
        }
        // else if (this.TipoSignal == EnumTipoSignal.Totalizado) {
        //     if (this.IndiceImagen == 1) {
        //         let value = `${parseFloat(this.Valor).toFixed(0)}`;
        //         let _unidades = '';

        //         if (unidades) {
        //             _unidades = `[${EnumUnidadesSignal[this.TipoSignal]}]`;
        //         }

        //         return `<label style="color: ${this.GetValorColor()};">${value}</label> <label class="unidades">${_unidades}</label>`;
        //     } else if (this.DentroRango == -1) {
        //         return `<label style="color: ${this.GetValorColor()};">nan</label>`;
        //     } else {
        //         return `<label style="color: ${this.GetValorColor()};">${rayitas ? '---' : 'N/D'}</label>`;
        //     }
        // }
        else if (this.TipoSignal == EnumTipoSignal.Voltaje) {

            let value = `${parseFloat(this.Valor).toFixed(2)}`;

            if (value < 0)
                value = `${parseFloat(0).toFixed(2)}`;

            let _unidades = '';

            if (unidades) {
                _unidades = `[${EnumUnidadesSignal[this.TipoSignal]}]`;
            }

            return `<label style="color:${this.GetValorColor()};">${value}</label> <label class="unidades">${_unidades}</label>`;

        }
        else if ( this.TipoSignal == EnumTipoSignal.Precipitacion || this.TipoSignal == EnumTipoSignal.RadiacionSolar || this.TipoSignal == EnumTipoSignal.Humedad || this.TipoSignal == EnumTipoSignal.Direccion || this.TipoSignal == EnumTipoSignal.Totalizado) {
            let value = `${parseFloat(this.Valor).toFixed(0)}`;

            if (value < 0)
                value = `${parseFloat(0).toFixed(2)}`;

            let _unidades = '';

            if (unidades) {
                _unidades = `[${EnumUnidadesSignal[this.TipoSignal]}]`;
            }

            return `<label style="color:${this.GetValorColor()};">${value}</label> <label class="unidades">${_unidades}</label>`;
        }
        else if (this.TipoSignal == EnumTipoSignal.Temperatura || this.TipoSignal == EnumTipoSignal.Intensidad) {
            let value = `${parseFloat(this.Valor).toFixed(1)}`;

            if (value < 0)
                value = `${parseFloat(0).toFixed(1)}`;

            let _unidades = '';

            if (unidades) {
                _unidades = `[${EnumUnidadesSignal[this.TipoSignal]}]`;
            }

            return `<label style="color:${this.GetValorColor()};">${value}</label> <label class="unidades">${_unidades}</label>`;
        }
        else {
            if (this.DentroRango == 1) {
                let value = `${parseFloat(this.Valor).toFixed(2)}`;
                let _unidades = '';

                if (unidades) {
                    _unidades = `[${Core.Instance.IdProyecto == 13 ? EnumUnidadesSignalClima[this.TipoSignal] : EnumUnidadesSignal[this.TipoSignal]}]`;
                }

                return `<label style="color:${this.GetValorColor()};">${value}</label> <label class="unidades">${_unidades}</label>`;
            } else if (this.DentroRango == -1) {
                return `<label style="color: ${this.GetValorColor()};">nan</label>`;
            }
            else {
                return `<label style="color: ${this.GetValorColor()};">${rayitas ? '---' : 'N/D'}</label>`;
            }
        }

    }

    /**
     * @returns {string} nomenclatura (ejem. N1)
     */
    GetNomenclaturaSignal() {
        return `${this.Nombre}`;
    }

    GetValorColor() {

        let color = 'rgb(255, 255, 255)';

        switch (this.TipoSignal) {
            case EnumTipoSignal.ValvulaDiscreta:
                color = `${parseInt(this.Valor) == EnumValorValvulaDiscreta.Abierto ? 'rgb(223, 177, 49)' : 'rgb(203, 185, 136)'}`;
                break;
            case EnumTipoSignal.Bomba:
                color = `${parseInt(this.Valor) == EnumValorBomba.Arrancada ? 'rgb(223, 177, 49)' : 'rgb(203, 185, 136)'}`;
                break;
            case EnumTipoSignal.PerillaGeneral:
                color = `${parseInt(this.Valor) == EnumPerillaGeneral.Remoto ? 'rgb(223, 177, 49)' : 'rgb(203, 185, 136)'}`;
                break;
            case EnumTipoSignal.FallaAC:
                color = `${parseInt(this.Valor) == EnumFallaAC.Normal ? 'rgb(223, 177, 49)' : 'rgb(203, 185, 136)'}`;
                break;
            case EnumTipoSignal.PuertaAbierta:
                // color = `${parseInt(this.Valor) == EnumPuertaAbierta.Normal ? 'rgb(223, 177, 49)' : 'rgb(203, 185, 136)'}`;
                var aux = parseInt(this.Valor);
                color = `${aux >= 250 && aux <= 259 ? 'rgb(223, 177, 49)' : 'rgb(203, 185, 136)'}`;
                break;
            case EnumTipoSignal.Voltaje:
                color = `rgb(255, 255, 255)`;
                break
            case EnumTipoSignal.Nivel:
            case EnumTipoSignal.Presion:
            case EnumTipoSignal.Gasto:
            case EnumTipoSignal.Totalizado:
            case EnumTipoSignal.ValvulaAnalogica:
            case EnumTipoSignal.Precipitacion:
            case EnumTipoSignal.Temperatura:
            case EnumTipoSignal.Humedad:
            case EnumTipoSignal.RadiacionSolar:
            case EnumTipoSignal.Intensidad:
            case EnumTipoSignal.Direccion:
                if (this.DentroRango == 1)
                    color = `${this.DentroLimite == EnumDentroLimite.Bajo ? 'white' : this.DentroLimite == EnumDentroLimite.Alto ? 'white' : 'white'}`;

                break;
            default:
                break;
        }

        return color;
    }
    GetImagenBombaPanelControl() {
        return `background: url(${Core.Instance.ResourcesPath}Control/btn_bomba.png?v=${Core.Instance.version}) 100% 100%;filter: ${this.FilterPanelBombaColor(this.Valor)}`;
    }
    FilterPanelBombaColor(valorBomba) {
        let filter = 'grayscale(2)';
        switch (valorBomba) {
            case EnumValorBomba.NoDisponible:
                filter = 'grayscale(2)';
                break;
            case EnumValorBomba.Arrancada:
                filter = 'hue-rotate(120deg)'
                break;
            case EnumValorBomba.Apagada:
                filter = 'hue-rotate(0deg)'
                break;
            case EnumValorBomba.Falla:
                filter = 'hue-rotate(231deg)'
                break;
        }
        return filter;
    }
    /**
     * 
     * @param {Signal} signalPerilla 
     */
    GetValorPerillaBomba() {
        return EnumPerillaBombaString[this.Valor] ?? '---';
    }
    GetValorPerillaGeneral() {
        return EnumPerillaGeneralString[this.Valor] ?? '---';
    }


}

export default Signal;