HTMLElement.prototype.SetMultipleAttributes = function (attributes) {
    for (const [key, value] of Object.entries(attributes)) this.setAttribute(key, value);
    return this;
};

/**
 * @param {{ nodeElement : keyof HTMLElementTagNameMap, attributes : {}, innerText: string ,events : Map<string,[Function]> }} params 
 * @returns 
 */
export const CreateElement = function ({ nodeElement, attributes = {}, innerText = "", events = new Map() }) {
    const createdElement = document.createElement(nodeElement);
    createdElement.SetMultipleAttributes(attributes);
    createdElement.innerText = innerText ?? '';
    for (const [key, functions] of events.entries()) {
        functions.forEach(fnEv => {
            createdElement.addEventListener(key, fnEv);
        })
    }
    return createdElement;
}






