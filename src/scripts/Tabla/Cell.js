

import Signal from "../Entities/Signal.js";
import { CreateElement } from "../Utilities/CustomFunctions.js";
import { EventsManager, EventoCustomizado } from "../Managers/EventsManager.js";
import { Core } from "../Core.js";


class Cell {
    /**
     * 
     * @param {Signal} signal 
     */
    constructor(signal, moreThanOne) {
        this.signal = signal;
        this.moreThanOne = moreThanOne;
    }

    create() {
        this.signalColumnContainer = CreateElement({
            nodeElement: 'div',
            attributes: { class: 'signal-Column-Container' },
            innerText: '',
            events: new Map()
        });

        this.signalNombre = CreateElement({
            nodeElement: 'div',
            attributes: { class: 'signal-nombre', style: `color: ${this.moreThanOne ? 'cyan' : 'white'};` },
            innerText: `${this.moreThanOne ? this.signal.GetNomenclaturaSignal() : ''}`,
        });

        this.signalValor = CreateElement({
            nodeElement: 'div',
            attributes: { class: 'signal-valor' },
            innerText: this.signal.GetValorString(false, true),
        });

        this.signalColumnContainer.append(this.signalNombre, this.signalValor);

        this.suscribirEventos();
        this.Update();

        return this.signalColumnContainer;
    }

    Update() {
        let IdEstacion = this.signal.IdEstacion;
        const estacion = Core.Instance.GetDatosEstacion(IdEstacion);

        let signal = estacion.Signals.find((signal) => signal.IdSignal == this.signal.IdSignal);

        if (signal != null) {
            this.signalValor.innerText = signal.GetValorString(false, true);
        }

    }

    suscribirEventos() {
        EventsManager.Instance.Suscribirevento('Update', new EventoCustomizado(() => this.Update()));
    }
}

export { Cell };