import * as CustomFunctions from "../../Utilities/CustomFunctions.js";
import { EnumAppEvents, RequestType } from "../../Utilities/Enums.js";
import { GoBack, GoHome, ShowModal } from "../../uiManager.js";
import { Core } from "../../Core.js"
import { Fetcher } from "../../Fetcher/Fetcher.js";
import { Credentials } from "./Credentials.js";
import { EventsManager } from "../../Managers/EventsManager.js";

class Login {
    action = "Login"
    #isCreated = false;
    #btnConfirmar = undefined;
    #btnCancelar = undefined;
    #inactivityMinutes = 10; // toleracion de 10 minutos de inactividad
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
    inputusuario = undefined;
    inputContrasena = undefined;
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
            backgroundVideo.setAttribute('src', `${Core.Instance.ResourcesPath}/Control/login_loop.mp4?v=${Core.Instance.version}`)
            const mainContainer = document.querySelector('#section__login');
            // Si no se ha creado se crea el contenido
            const container = CustomFunctions.CreateElement({ nodeElement: 'div', attributes: { id: 'loginInputContainer', class: 'contenedorLogInInicial' } });
            const textoUsuario = CustomFunctions.CreateElement({ nodeElement: 'p', attributes: { class: 'loginInput', style: 'width: 184px; height: 22px; position: absolute; left: 44px; top: 82px; color: rgb(0, 229, 220); text-align: center;' }, innerText: 'Usuario' });
            const textoContrasena = CustomFunctions.CreateElement({ nodeElement: 'p', attributes: { class: 'loginInput', style: 'width: 184px; height: 22px; position: absolute; left: 305px; top: 82px; color: rgb(0, 229, 220); text-align: center;' }, innerText: 'Contraseña' });
            this.#btnCancelar = CustomFunctions.CreateElement({ nodeElement: 'button', attributes: { type: "button", class: "floatingBtnCancelar cancelarLogin loginInput", style: `background:url(${Core.Instance.ResourcesPath}Control/btn_cancelar.png) ` }, events: new Map().set('click', [this.#OnCancelar]) });
            this.#btnConfirmar = CustomFunctions.CreateElement({ nodeElement: 'button', attributes: { type: "button", class: "floatingBtn entrarContrasena loginInput", style: `background:url(${Core.Instance.ResourcesPath}Control/btn_entrar.png)` }, events: new Map().set('click', [this.#OnConfirmar]) });
            this.inputusuario = CustomFunctions.CreateElement({ nodeElement: 'input', attributes: { id: "loginPanneluserdiv", type: "text", class: "username loginInput", placeholder: "invitado" } });
            this.inputContrasena = CustomFunctions.CreateElement({ nodeElement: 'input', attributes: { id: "loginPannelpassdiv", type: "password", class: "passwordField  loginInput", placeholder: "****" }, events: new Map().set('keydown', [this.#OnConfirmarEnter]) });
            container.append(textoUsuario, textoContrasena, this.inputusuario, this.inputContrasena, this.#btnCancelar, this.#btnConfirmar);
            mainContainer.append(container);
            // Contenido creado
            this.#isCreated = true;
        }
    }
    #OnCancelar = (e) => {
        GoHome();
    }
    #OnConfirmar = async (e) => {
        if (this.inputusuario.value == '' && this.inputContrasena.value == '') {
            ShowModal('Ingresar datos en los campos de usuario y contraseña', "Inicio sesión", false);
            return;
        }
        if (!this.userIsLogged) {

            const result = await Fetcher.Instance.RequestData(this.action, RequestType.POST, new Credentials(this.inputusuario.value, this.inputContrasena.value, Core.Instance.IdProyecto), true);
            if (result.response) {
                this.#lastInteraction = new Date();
                this.CheckUserInteraction();
                this.#verifySessionIntervalId = setInterval(this.#VerifyIfSessionIsValid, 15 * 1000); // cada 15s
                //setTimeout(this.#OnLogOut, 1000 * 60 * this.#inactivityMinutes ); // despues de 5 mints
                this.userIsLogged = true;
                this.token = result.token;
                this.userName = this.inputusuario.value;
                this.btnHeaderLogin.style.display = 'none';
                ShowModal(result.message, "Inicio sesión", false);
                GoBack();
            } else {
                ShowModal(`${result.message}`, "Inicio sesión", false);
            }
        }
        else {
            ShowModal('Ya hay una sesion activa', "Inicio sesión", false);
        }
    }
    #OnConfirmarEnter = (e) => {
        if (e.currentTarget.value != '' && (e.which == 13 || e.which == 9)) {
            this.#OnConfirmar();
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
    #OnLogOut = async () => {
        this.userIsLogged = false;
        this.token = '';
        this.userName = '';
        clearInterval(this.#verifySessionIntervalId);
        ['touchstart', 'click'].forEach(eventName => window.removeEventListener(eventName, this.#OnUserInteracion));
        this.btnHeaderLogin.style.display = 'flex';
        ShowModal('La sesión ha finalizado', "Inicio sesión", false);
        EventsManager.Instance.EmitirEvento(EnumAppEvents.LogOut);
        const result = await Fetcher.Instance.RequestData("Logout", RequestType.POST, new Credentials(Login.Instace.inputusuario.value, Login.Instace.inputContrasena.value, Core.Instance.IdProyecto), true);
    }
    #VerifyIfSessionIsValid = () => {
        const actualTime = new Date();
        const lastTime = new Date(this.#lastInteraction.getTime());
        lastTime.setMinutes(lastTime.getMinutes() + this.#inactivityMinutes);
        if (actualTime.getTime() > lastTime.getTime())
            this.#OnLogOut();

    }
}
var onUnload = function () {
    window.removeEventListener('beforeunload', onUnload);
    if (Login.Instace.userIsLogged) {
        Fetcher.Instance.RequestData("Logout", RequestType.POST, new Credentials(Login.Instace.inputusuario.value, Login.Instace.inputContrasena.value, Core.Instance.IdProyecto), true);
    }
    return undefined;
}

window.onbeforeunload = onUnload;

export default Login;