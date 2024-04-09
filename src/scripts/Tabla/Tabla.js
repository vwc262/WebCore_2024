import { Row } from "./Row";

/**
 * @returns {Tabla}
 */
class Tabla {

    constructor() {

    }

    create() {
        let sitesLenght = 20;
        let array = new Array(sitesLenght);

        for (let index = 0; index < sitesLenght; index++) {
            const element = array[index];
            const row = new Row(index);
        }
    }
}

export { Tabla };