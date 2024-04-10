import * as CustomFunctions from "../../Utilities/CustomFunctions.js";
import { EnumNombreProyecto, RequestType } from "../../Utilities/Enums.js";
import { GoHome } from "../../uiManager.js";
import { Core } from "../../Core.js"
import { Fetcher } from "../../Fetcher/Fetcher.js";
import { Credentials } from "./Credentials.js";
class Login {
    action = "Login"
    #isCreated = false;
    #btnConfirmar = undefined;
    #btnCancelar = undefined;
    #inactivityMinutes = 1;
    userIsLogged = false;
    token = '';
    userName = '';
    /**
     * @type {Date}
     */
    #lastInteraction = undefined;
    #verifySessionIntervalId = undefined;
    /**
     * @type {HTMLElement}
     */
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
    constructor() {
        this.btnHeaderLogin = document.querySelector('.headerBtn__Login');
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
            this.#btnCancelar = CustomFunctions.CreateElement({ nodeElement: 'button', attributes: { type: "button", class: "floatingBtnCancelar cancelarLogin loginInput", style: `background:url(${Core.Instance.ResourcesPath}Control/btn_cancelar.png) ` }, events: new Map().set('click', [this.#OnCancelar]) });
            this.#btnConfirmar = CustomFunctions.CreateElement({ nodeElement: 'button', attributes: { type: "button", class: "floatingBtn entrarContrasena loginInput", style: `background:url(${Core.Instance.ResourcesPath}Control/btn_entrar.png)` }, events: new Map().set('click', [this.#OnConfirmar]) });
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
    #OnConfirmar = async (e) => {
        if (this.#inputusuario.value == '' && this.#inputContrasena.value == '') {
            alert('Ingresar datos en los campos de usuario y contraseña');
            return;
        }
        if (!this.userIsLogged) {

            const result = await Fetcher.Instance.RequestData(this.action, RequestType.POST, new Credentials(this.#inputusuario.value, this.#inputContrasena.value, Core.Instance.IdProyecto), true);
            if (result.response) {
                this.#lastInteraction = new Date();
                this.CheckUserInteraction();
                this.#verifySessionIntervalId = setInterval(this.#VerifyIfSessionIsValid, 15 * 1000);
                this.userIsLogged = true;
                this.token = result.token;
                this.userName = this.#inputusuario.value;
                this.btnHeaderLogin.style.display = 'none';
                alert(result.message);
            } else {
                alert('Credenciales no autorizadas');
            }
        }
        else {
            alert('Ya hay una sesion activa');
        }
    }
    CheckUserInteraction() {
        ['touchstart', 'click'].forEach(nombreEvento => {
            window.addEventListener(nombreEvento, this.#OnUserInteracion);
        });
    }
    #OnUserInteracion = () => {
        this.#lastInteraction = new Date();
    }
    #OnLogOut = () => {
        this.userIsLogged = false;
        this.token = '';
        this.userName = '';
        clearInterval(this.#verifySessionIntervalId);
        ['touchstart', 'click'].forEach(eventName => window.removeEventListener(eventName, this.#OnUserInteracion));
        this.btnHeaderLogin.style.display = 'flex';
        alert('Se cerro sesion por falta de interaccion');
    }
    #VerifyIfSessionIsValid = () => {
        const actualTime = new Date();
        const lastTime = new Date(this.#lastInteraction.getTime());
        lastTime.setMinutes(lastTime.getMinutes() + this.#inactivityMinutes);
        if (actualTime.getTime() > lastTime.getTime())
            this.#OnLogOut();

    }
}

export default Login;