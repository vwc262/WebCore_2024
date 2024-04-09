import { SetMultipleAttributes } from "../../Utilities/CustomFunctions.js";

class Login {
    #isCreated = false;
    static #instance = undefined;
    /**
     * @returns {Login}
     */
    static get Instace() {
        if (!this.#instance) {
            this.#instance = new Login();
        }
        return this.#instance;
    }
    create() {
        if (!this.#isCreated) {
            const mainContainer = document.querySelector('#section__login');
            // Si no se ha creado se crea el contenido
            const container = document.createElement('div');
            container.SetMultipleAttributes({ id: 'loginInputContainer', class: 'contenedorLogInInicial' });
            mainContainer.append(container);
            // Contenido creado
            this.#isCreated = true;
        }
    }
}

export default Login;