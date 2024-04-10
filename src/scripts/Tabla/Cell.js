

import Signal from "../Entities/Signal.js";
import { CreateElement } from "../Utilities/CustomFunctions.js";

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

console.log(this.signal.TipoSignal, this.moreThanOne)

        this.signalNombre = CreateElement({
            nodeElement: 'div',
            attributes: { class: 'signal-nombre'/*, style: `color: ${this.moreThanOne ? 'cyan' : 'white'};`*/ },
            innerText: this.signal.GetNomenclaturaSignal(),
        });

        this.signalValor = CreateElement({
            nodeElement: 'div',
            attributes: { class: 'signal-valor' },
            innerText: this.signal.GetValorString(false, true),
        });

        this.signalColumnContainer.append(this.signalNombre, this.signalValor);

        return this.signalColumnContainer;
    }
}

export { Cell };