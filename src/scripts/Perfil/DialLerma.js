import { Configuracion } from "../../config/config.js";
import { Core } from "../Core.js";
import { CreateElement } from "../Utilities/CustomFunctions.js";
import { PerfilPozos } from "./PerfilPozos.js";

class DialLerma {
    //#region Propiedades
    static #instance = undefined;
    currentDegree = 288;
    currentIndex = 0;
    spinnner = undefined;
    cellSelectorDegrees = [
        /*'General': */288,
        /*'Almoloya':*/ 0,
        /*'V. Carmela':*/ 72,
        /*'Alzate':*/ 144,
        /*'Ixtlahuaca':*/ 216,
    ];
    /**
     * @returns {DialLerma}
     */
    static get Instance() {
        if (!this.#instance) this.#instance = new DialLerma();
        return this.#instance;
    }
    //#endregion
    create() {
        const containerPerfil = document.querySelector('#section__home');
        console.log('Comenzando Dial Lerma');
        const dialContainer = CreateElement({
            nodeElement: "div",
            attributes: {
                class: 'DialContainerLerma'
            }
        });
        const contenedorSecuencias = CreateElement({
            nodeElement: 'div',
            attributes: {
                class: 'contenedorSecuenciasDialLerma'
            }
        });
        contenedorSecuencias.style.background = `url(${Core.Instance.ResourcesPath}Secuencias/perillaSelectorCelulas2.png)`;
        contenedorSecuencias.innerHTML = '<svg id="infoContainer" viewBox="0 0 300 300" width="300px" height="300px" class=""><path id="mainCurve" fill="#FFFFFF00" d="m 0 150 a 150 150 90 0 0 300 0 a 150 150 90 0 0 -300 0"></path><text id="General" dy="-8px" width="300px" textAnchor="middle" height="300px" fill="rgb(51, 204, 255)" font-size="28px" font-family="Roboto" style="transform-origin: center center; transform-box: fill-box;"><textPath id="General" xlink:href="#mainCurve" startOffset="0%">General</textPath></text><text id="Almoloya" dy="-8px" width="300px" textAnchor="middle" height="300px" fill="white" font-size="28px" font-family="Roboto" style="transform-origin: center center; transform-box: fill-box;"><textPath id="Almoloya" xlink:href="#mainCurve" startOffset="19%">Almoloya</textPath></text><text id="V. Carmela" dy="-8px" width="300px" textAnchor="middle" height="300px" fill="white" font-size="28px" font-family="Roboto" style="transform-origin: center center; transform-box: fill-box;"><textPath id="V. Carmela" xlink:href="#mainCurve" startOffset="38.3%">V. Carmela</textPath></text><text id="Alzate" dy="-8px" width="300px" textAnchor="middle" height="300px" fill="white" font-size="28px" font-family="Roboto" style="transform-origin: center center; transform-box: fill-box;"><textPath id="Alzate" xlink:href="#mainCurve" startOffset="62%">Alzate</textPath></text><text id="Ixtlahuaca" dy="-8px" width="300px" textAnchor="middle" height="300px" fill="white" font-size="28px" font-family="Roboto" style="transform-origin: center center; transform-box: fill-box;"><textPath id="Ixtlahuaca" xlink:href="#mainCurve" startOffset="79.5%">Ixtlahuaca</textPath></text></svg>';
        this.spinnner = contenedorSecuencias;
        this.spinnner.style.transform = `perspective(200px) rotateX(20deg) rotateY(-1deg) rotateZ(${288}deg)`;
        const animButtonsContainer = CreateElement({
            nodeElement: 'div',
            attributes: {
                id: 'animButtonsContainer',
                class: 'animButtonsContainer',
            }
        });
        animButtonsContainer.style.background = `url(${Core.Instance.ResourcesPath}Secuencias/perillaSelectorCelulas.png)`;

        const leftButton = CreateElement({
            nodeElement: 'div',
            attributes: {
                id: 'leftButton',
                class: 'lButtonPerilla',
            },
            events: new Map().set('click', [this.OnPerillaClick])
        });
        leftButton.isRight = false;
        const rightButton = CreateElement({
            nodeElement: 'div',
            attributes: {
                id: 'rightButton',
                class: 'rButtonPerilla',
            },
            events: new Map().set('click', [this.OnPerillaClick])
        });
        rightButton.isRight = true;
        animButtonsContainer.append(leftButton, rightButton);
        dialContainer.append(contenedorSecuencias, animButtonsContainer);
        containerPerfil.append(dialContainer);
    }
    OnPerillaClick = (e) => {
        const animButtonsContainer = document.querySelector('#animButtonsContainer');
        const button = e.currentTarget;
        const isRight = button.isRight;
        this.currentIndex += isRight ? 1 : -1;
        this.currentIndex = this.currentIndex < 0 ? this.cellSelectorDegrees.length + this.currentIndex : this.currentIndex % this.cellSelectorDegrees.length;
        const inicio = isRight ? 10 : 23
        const fin = isRight ? 23 : 35;
        this.AnimateButton(inicio, fin, animButtonsContainer);
        this.UpdateRueda(this.cellSelectorDegrees[this.currentIndex]);
        this.IrARegion();
    }
    IrARegion() {
        const config = Configuracion.GetConfiguracion(Core.Instance.IdProyecto);
        PerfilPozos.Instace.PanzoomRef.zoom(config.findSCZoom[this.currentIndex], { force: true });
        PerfilPozos.Instace.PanzoomRef.pan(config.findSCposX[this.currentIndex], config.findSCposY[this.currentIndex], { animate: true, duration: 1000, force: true });
    }
    AnimateButton(i, fin, element) {
        element.style.background = `url(${Core.Instance.ResourcesPath}Secuencias/Click00${i}.png)`;
        setTimeout(() => {
            if (i < fin) {
                this.AnimateButton(++i, fin, element);
            }
        }, 38);
    }
    UpdateRueda(toDegrees) {
        let turns = parseInt(this.currentDegree / 360);
        toDegrees = (turns * 360) + toDegrees;

        if (this.currentDegree > toDegrees && (this.currentDegree - toDegrees) > 180) {
            toDegrees += 360;
        } else if (this.currentDegree < toDegrees && (toDegrees - this.currentDegree) > 180) {
            toDegrees -= 360;
        }

        this.spinnner.style.transform = `perspective(200px) rotateX(20deg) rotateY(-1deg) rotateZ(${toDegrees}deg)`;
        this.spinnner.style.transition = 'all 1s ease-out';

        // Perfil.udpateFillColors();
        this.currentDegree = toDegrees;

    }

}

export { DialLerma }