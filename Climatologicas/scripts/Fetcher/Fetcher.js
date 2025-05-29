

/** Aqui se pueden agregar mas actions para que en el editor autocomplete
 * @typedef {'GetInfraestructuraUniversal' | 'GetUpdateLite'} Action
 * @typedef {'GET' | 'POST'} RequestType
 */

class Fetcher {
    idProyecto = 13;
    isLogged = false;
    #root = "https://virtualwavecontrol.com.mx/api24/vwc";
    #rootVersion = "https://virtualwavecontrol.com.mx/Core24/proyecto";
    static #_instance = undefined;
    /**
     * @returns {Fetcher}
     */
    static get Instance() {
        if (!this.#_instance) {            
            this.#_instance = new Fetcher();
        }
        return this.#_instance;
    }
    /**
     * Request de informacion a la API
     * @param {Action} action
     * @param {RequestType } requestType
     * @param {boolean} doSerialize
     * @returns {object}
     */
    async RequestData(action, requestType, data, doSerialize) {
        const config = {
            method: requestType,
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: doSerialize ? JSON.stringify(data) : data,
        };
        if (requestType == 'GET') {
            delete config.body;
            delete config.headers;
        }
        const response = await fetch(`${this.#root}/${action}?idProyecto=${this.idProyecto}`, config);
        return await response.json();
    }

    /**
     *
     * @param {string} action
     * @returns {number} number
     */
    async RequestVersion(action) {
        const config = {
            method: "get",
            mode: "cors",
        };
        const response = await fetch(`${this.#rootVersion}/${action}`, config);
        return await response.json();
    }
}

export { Fetcher };
