import { EnumProyecto } from "./Enums.js";
HTMLElement.prototype.SetMultipleAttributes = function (attributes) {
    for (const [key, value] of Object.entries(attributes)) this.setAttribute(key, value);
    return this;
};

/**
 * @param {{ nodeElement : keyof HTMLElementTagNameMap, attributes : {}, innerText: string ,events : Map<string,[Function]> }} params 
 * @returns 
 */
export const CreateElement = function ({ nodeElement, attributes = {}, innerText = "", events = new Map(), innerHTML = undefined }) {
    const createdElement = document.createElement(nodeElement);
    createdElement.SetMultipleAttributes(attributes);

    if (innerHTML != undefined) {
        createdElement.innerHTML = innerHTML;
    } else {
        createdElement.innerText = innerText ?? '';
    }

    for (const [key, functions] of events.entries()) {
        functions.forEach(fnEv => {
            createdElement.addEventListener(key, fnEv);
        })
    }
    return createdElement;
}

/**
 * 
 * @param {EnumProyecto} idProyecto 
 * @returns { number} 
 */
export const ObtenerWidthRender = function (idProyecto) {
    let width = 1920;
    switch (idProyecto) {
        case EnumProyecto.Default: break;
        case EnumProyecto.GustavoAMadero: break;
        case EnumProyecto.PozosSistemaLerma: break;
        case EnumProyecto.Yaqui: break;
        case EnumProyecto.Chalmita: break;
        case EnumProyecto.Encharcamientos: break;
        case EnumProyecto.Sectores: break;
        case EnumProyecto.Lumbreras: break;
        case EnumProyecto.SantaCatarina:
        case EnumProyecto.Chiconautla:
            width = 1940;
            break;
    }
    return width;
}

/**
 * 
 * @param {String} titulo 
 */
export const ObtenerFormatoTituloProyecto = function (titulo) {
    titulo = titulo.replace(/([A-Z])/g, ' $1').trim();

    return titulo;
}

export const AdjustSize = function () {
    const contentWidth = 1920;
    const contentHeight = 1080;

    let currentScreenWidth = window.innerWidth;
    let currentScreenHeight = window.innerHeight;

    let widthScale = (currentScreenWidth / contentWidth).toFixed(3);
    let heightScale = (currentScreenHeight / contentHeight).toFixed(3);

    let body = document.getElementsByTagName('body')[0];

    if (widthScale > heightScale) {
        let margin = (currentScreenWidth - (contentWidth * heightScale)) / 2;
        body.style = `transform: scale(${(heightScale)}); margin: 0px 0px 0px ${margin}px; transform-origin: left top; width: 1920px; height: 1080px;`;
    } else {
        body.style = `transform: scale(${widthScale}); margin: 0px 0px 0px 0px; transform-origin: left top; width: 1920px; height: 1080px;`;
    }
}


/**
 * Restringe un valor a un rango dado
 * @param {number} val 
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
export const Clamp = (val, min, max) => Math.min(Math.max(val, min), max);






