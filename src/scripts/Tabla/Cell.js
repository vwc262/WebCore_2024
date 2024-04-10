

import { CreateElement } from "../Utilities/CustomFunctions.js";

class Cell {
    constructor(signal) {
        this.signal = signal;
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
            attributes: { class: 'signal-nombre' },
            innerText: this.signal.Nombre,
            events: new Map()
        });

        this.signalValor = CreateElement({
            nodeElement: 'div',
            attributes: { class: 'signal-valor' },
            innerText: this.signal.Valor,
            events: new Map()
        });

        this.signalColumnContainer.append(this.signalNombre, this.signalValor);

        return this.signalColumnContainer;
    }
}

export { Cell };