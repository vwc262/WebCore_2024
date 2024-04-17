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


/**
 * Restringe un valor a un rango dado
 * @param {number} val 
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
export const Clamp = (val, min, max) => Math.min(Math.max(val, min), max);






