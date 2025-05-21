

/**
 * @returns {infoRowEstacion}
 */
class infoRowEstacion {

    /**
     * 
     * @param {estacion} estacion 
     */
    constructor(container, estacion) {
        this.estacion = estacion;

        let info_div = document.createElement('div');
        info_div.classList = 'info_estacion_row';

        let signals_div = document.createElement('div');
        signals_div.classList = 'signals_div';

        let img_estacion_div = document.createElement('img');
        img_estacion_div.classList = 'ImgEstacion';
        img_estacion_div.src = ``;

        signals_div.append(img_estacion_div);

        /* =========== creacion de signals ===================== */

        this.estacion.Signals.forEach(signal => {
            if(signal.TipoSignal == 1){
                
                let signal_div = document.createElement('div');
                signal_div.classList = 'signal_estacion';

                let signal_nombre = document.createElement('div');
                signal_nombre.classList = 'signal_nombre';
                signal_nombre.innerHTML = `${signal.Nombre}`;
                
                let signal_valor = document.createElement('div');
                signal_valor.classList = 'signal_valor';
                signal_valor.innerHTML = `${signal.Valor}`;

                signal_div.append(signal_nombre, signal_valor);
                signals_div.append(signal_div);

            }
        });
        
        info_div.append(signals_div);
        container.appendChild(info_div);
    }

    Init() {

        this.update();
    }

    onclick() {

    }


    update() {

    }

}
export { infoRowEstacion }