import { SetMultipleAttributes } from "../../Utilities/CustomFunctions.js";

class Login {
    #isCreated = false;
    #btnConfirmar = undefined;
    #btnCancelar = undefined;
    #inputusuario = undefined;
    #inputContrasena = undefined;
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
            const textoUsuario = document.createElement('p');
            const textoContrasena = document.createElement('p');
            this.#btnCancelar = document.createElement('button');
            this.#btnConfirmar = document.createElement('button');
            this.#inputContrasena = document.createElement('input');
            this.#inputusuario = document.createElement('input');

            textoUsuario.SetMultipleAttributes({ class: 'loginInput', style: 'width: 184px; height: 22px; position: absolute; left: 44px; top: 82px; color: rgb(0, 229, 220); text-align: center;' });
            textoContrasena.SetMultipleAttributes({ class: 'loginInput', style: 'width: 184px; height: 22px; position: absolute; left: 305px; top: 82px; color: rgb(0, 229, 220); text-align: center;' });
            this.#inputusuario.SetMultipleAttributes({ id: "loginPanneluserdiv", type: "text", class: "username loginInput", placeholder: "invitado" });
            this.#inputContrasena.SetMultipleAttributes({ id: "loginPannelpassdiv", type: "password", class: "passwordField  loginInput", placeholder: "****" });
            this.#btnConfirmar.SetMultipleAttributes({ type: "button", class: "floatingBtn entrarContrasena loginInput", style: 'background:none' });
            this.#btnCancelar.SetMultipleAttributes({ type: "button", class: "floatingBtnCancelar cancelarLogin loginInput", style: "background: " });


            this.#btnCancelar.addEventListener('click', () => this.#OnCancelar());
            this.#btnConfirmar.addEventListener('click', () => this.#OnConfirmar());

            container.append(this.#btnCancelar, this.#btnConfirmar, this.#inputContrasena, this.#inputusuario, textoContrasena, textoUsuario);

            mainContainer.append(container);
            // Contenido creado
            this.#isCreated = true;
        }
    }
    #OnCancelar() {
        console.log('Cancelar');
    }
    #OnConfirmar() {
        console.log('Confirmar');
    }
}

export default Login;