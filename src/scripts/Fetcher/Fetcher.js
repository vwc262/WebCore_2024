import { RequestType } from "../Utilities/Enums.js";

/**
 * Clase base para request
 */
class Fetcher {
  isLogged = false;
  #root = "http://w1.doomdns.com:11000/vwctestapi/crud";
  #rootVersion = "http://w1.doomdns.com:11000/vwctestapi/proyecto";
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
   * @param {string} action
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
    if (requestType == RequestType.GET) {
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

export { Fetcher };
