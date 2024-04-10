import * as CustomFunctions from "../../Utilities/CustomFunctions.js";
import { EnumNombreProyecto } from "../../Utilities/Enums.js";
import { GoHome } from "../../uiManager.js";
import { Core } from "../../Core.js"
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
            const backgroundVideo = document.querySelector('#loginVid1');
            backgroundVideo.setAttribute('src', `${Core.Instance.ResourcesPath}/Control/login_loop.mp4?v=-1`)
            const mainContainer = document.querySelector('#section__login');
            // Si no se ha creado se crea el contenido
            const container = CustomFunctions.CreateElement({ nodeElement: 'div', attributes: { id: 'loginInputContainer', class: 'contenedorLogInInicial' } });
            const textoUsuario = CustomFunctions.CreateElement({ nodeElement: 'p', attributes: { class: 'loginInput', style: 'width: 184px; height: 22px; position: absolute; left: 44px; top: 82px; color: rgb(0, 229, 220); text-align: center;' }, innerText: 'Usuario' });
            const textoContrasena = CustomFunctions.CreateElement({ nodeElement: 'p', attributes: { class: 'loginInput', style: 'width: 184px; height: 22px; position: absolute; left: 305px; top: 82px; color: rgb(0, 229, 220); text-align: center;' }, innerText: 'Contraseña' });
            this.#btnCancelar = CustomFunctions.CreateElement({ nodeElement: 'button', attributes: { type: "button", class: "floatingBtnCancelar cancelarLogin loginInput", style: "background: " }, events: new Map().set('click', [this.#OnCancelar]) });
            this.#btnConfirmar = CustomFunctions.CreateElement({ nodeElement: 'button', attributes: { type: "button", class: "floatingBtn entrarContrasena loginInput", style: 'background:none' }, events: new Map().set('click', [this.#OnConfirmar]) });
            this.#inputusuario = CustomFunctions.CreateElement({ nodeElement: 'input', attributes: { id: "loginPanneluserdiv", type: "text", class: "username loginInput", placeholder: "invitado" } });
            this.#inputContrasena = CustomFunctions.CreateElement({ nodeElement: 'input', attributes: { id: "loginPannelpassdiv", type: "password", class: "passwordField  loginInput", placeholder: "****" } });
            container.append(this.#btnCancelar, this.#btnConfirmar, this.#inputContrasena, this.#inputusuario, textoContrasena, textoUsuario);
            mainContainer.append(container);
            // Contenido creado
            this.#isCreated = true;
        }
    }
    #OnCancelar = (e) => {
        GoHome();
    }
    #OnConfirmar = (e) => {
        if (this.#inputusuario.value == '' && this.#inputContrasena.value == '') {
            alert('Ingresar datos en los campos de usuario y contraseña');
            return;
        }


    }
}

export default Login;