import { RequestType } from "../Utilities/Enums.js";

/**
 * Clase base para request
 */
class APIGraficador {
  isLogged = false;
  #root = "https://virtualwavecontrol.com.mx/Core24/crud";
  #rootVersion = "https://virtualwavecontrol.com.mx/Core24/proyecto";
  static #_instance = undefined;
  /**
   * @returns {APIGraficador}
   */
  static get Instance() {
    if (!this.#_instance) {
      this.#_instance = new APIGraficador();
    }
    return this.#_instance;
  }
  /**
   * Request de informacion a la API
   * @param {string} action
   * @param {RequestType } method
   * @param {boolean} serialize
   * @returns {object}
   */
  async request(action, method, data, serialize) {
    const config = {
      method: method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: serialize ? JSON.stringify(data) : data,
    };
    
    if (method == RequestType.GET) {
      delete config.body;
      delete config.headers;
    }

    const response = await fetch(`${this.#root}/${action}`, config);
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

export { APIGraficador };
