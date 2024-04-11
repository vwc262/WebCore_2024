import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import configuracion from "../../config/PadiernaConfig.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { EnumTipoSignal, EnumUnidadesSignal } from "../Utilities/Enums.js";
import { CreateElement } from "../Utilities/CustomFunctions.js";
import { Particular } from "../Particular/Particular.js";

class SitioPerfil {
    /**
     * @type {HTMLElement}
     */
    ElementosDinamicosHTML = {};
    /**
     * 
     * @param {Estacion} estacion 
     */
    constructor(IdEstacion) {
        this.IdEstacion = IdEstacion;
    }
    createSitio() {
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);
        const signal = estacion.ObtenerPrimerSignal();
        const estilosEstacionEtiqueta = configuracion.perfil.estilosEstacion.find(element => element.IdEstacion == this.IdEstacion);

        let valorSignal;
        let nameSignal;
        let estacionDiv = CreateElement({ nodeElement: 'div', attributes: { id: `sitioPerfil_${estacion.Nombre}`, class: 'sitioPerfil' } });
        let etiquetaDiv = CreateElement({ nodeElement: 'div', attributes: { id: `etiquetaSitioPerfil_${estacion.Nombre}`, class: 'etiquetaSitioPerfil' }, events: new Map().set("click", [this.mostrarParticular]) });
        let signalDiv = CreateElement({ nodeElement: 'div', attributes: { class: 'signalSitioPerfil' } });
        let estacionPerfilDiv = CreateElement({ nodeElement: 'div', attributes: { id: `estacionPerfil_${estacion.Nombre}`, class: 'estacionPerfil' } });
        let nombreSitio = CreateElement({ nodeElement: 'p', attributes: { id: `idEstacion_${estacion.IdEstacion}`, class: 'estiloNombreEstacion', style: `background: ${estacion.Enlace == 0 ? "red" : "green"}` }, innerText: estacion.Nombre });

        if (signal) {
            const valor = `${signal.GetValorString(true, true)}`;

            valorSignal = CreateElement({ nodeElement: 'p', attributes: { id: `valor_${signal.Nombre}`, style: `color: ${signal.GetValorColor()}` }, innerText: `${estacion.Enlace == 0 ? "---" : valor}` });
            nameSignal = CreateElement({ nodeElement: 'p', attributes: { id: `name_${signal.Nombre}`, style: `color: ${signal.GetValorColor()}` }, innerText: `${signal.GetNomenclaturaSignal()}:  ` });
            signalDiv.append(nameSignal, valorSignal)
        }

        estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Bomba).forEach(signalBomba => {
            let imagenEstacionBombaPerfil = CreateElement({ nodeElement: "img", attributes: { id: `idBomba_${signalBomba.IdSignal}`, class: "Bomba", src: `${Core.Instance.ResourcesPath}Sitios/${estacion.Abreviacion}/Perfil/b/b${signalBomba.Ordinal + 1}_${signalBomba.Valor}.png` } });
            estacionPerfilDiv.append(imagenEstacionBombaPerfil);
            if (estilosEstacionEtiqueta != undefined)
                imagenEstacionBombaPerfil.style = estilosEstacionEtiqueta.Imagen;
        })

        estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Nivel).forEach(signalNivel => {
            let imagenEstacionNivelPerfil = CreateElement({ nodeElement: "img", attributes: { id: `idEstacionNivel_${estacion.Abreviacion}`, class: "idEstacionFondo", src: `${Core.Instance.ResourcesPath}Sitios/${estacion.Abreviacion}/Perfil/l/n${signalNivel.Ordinal + 1}_${signalNivel.IndiceImagen}.png?v=10 ` }, events: new Map().set("click", [this.mostrarParticular]) });
            estacionPerfilDiv.append(imagenEstacionNivelPerfil);
            if (estilosEstacionEtiqueta != undefined)
                imagenEstacionNivelPerfil.style = estilosEstacionEtiqueta.Imagen;
        })

        etiquetaDiv.append(nombreSitio, signalDiv);

        this.ElementosDinamicosHTML[nombreSitio.id] = nombreSitio;
        if (signal) {
            this.ElementosDinamicosHTML[valorSignal.id] = valorSignal;
        }
        estacionDiv.append(estacionPerfilDiv, etiquetaDiv);

        this.ponerPosiciones(etiquetaDiv, estilosEstacionEtiqueta);
        this.suscribirEventos();
        return estacionDiv;
    }

    ponerPosiciones(etiquetaDiv, estilosEstacionEtiqueta) {

        if (estilosEstacionEtiqueta != undefined) {
            etiquetaDiv.style = estilosEstacionEtiqueta.Etiqueta;
        }
    }

    suscribirEventos() {
        EventsManager.Instance.Suscribirevento('Update', new EventoCustomizado(() => this.Update()));
    }

    Update() {
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);
        const signal = estacion.ObtenerPrimerSignal();

        const name = this.ElementosDinamicosHTML[`idEstacion_${estacion.IdEstacion}`];
        name.style.background = estacion.Enlace == 0 ? "red" : "green";

        if (signal) {
            const valor = `${signal.GetValorString(true, true)} ${EnumUnidadesSignal[signal.TipoSignal]}`;
            const valorSignal = this.ElementosDinamicosHTML[`valor_${signal.Nombre}`];
            valorSignal.innerText = `${estacion.Enlace == 0 ? "---" : valor}`;
        }
    }

    mostrarParticular = () => {
        const estacion = Core.Instance.GetDatosEstacion(this.IdEstacion);
        Particular.Instance.setEstacion(estacion);
        Particular.Instance.mostrarDetalles();
    }
}

export default SitioPerfil;