import { Core } from "../Core.js";
import { water_vertexShader, water_fragmentShader } from "../../assets/shaders/s_water.js"
import { fire_fragmentShader, fire_vertexShader } from "../../assets/shaders/s_fire.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";

/** @returns {Perfil3D} */
class Perfil3D {

    constructor() {
        this.canvas = null;
        this.engine = null;
        this.scene = null;
        this.camera = null;
        this.modelos = {}
    }

    create() {

        // Obtener el canvas del DOM
        this.canvas = document.getElementById("renderCanvas");

        // Inicializar el motor Babylon.js
        this.engine = new BABYLON.Engine(this.canvas, true, { stencil: true });

        this.scene = this.createScene();
        this.suscribirEventos();

    }

    // Función para crear la escena
    createScene = () => {
        const estaciones = Core.Instance.data;
        const scene = new BABYLON.Scene(this.engine);
        let i = 15;

        // Añadir una cámara y luz
        const camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 5, BABYLON.Vector3.Zero(), scene);
        camera.position = new BABYLON.Vector3(0, 40, 0);
        camera.attachControl(this.canvas, true);

        const light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -1, 1), scene);

        estaciones.forEach(estacion => {

            const modelo = BABYLON.MeshBuilder.CreateSphere(
                `modelo_${estacion.Nombre}`,
                {
                    diameter: 2,
                    segments: 32 // Resolución (más segmentos = más suave)
                },
                scene
            );
            modelo.position = new BABYLON.Vector3(i, 0, 0);

            this.modelos[`modelo_${estacion.IdEstacion}`] = modelo;
            const sphere_material = this.initShader("waterShader", water_vertexShader, water_fragmentShader, ["position", "normal"]);
            // Aplica el shader a una esfera 
            modelo.material = sphere_material;

            // Animación para las ondulaciones
            scene.registerBeforeRender(() => {
                sphere_material.setFloat("time", performance.now() / 1000);
            });

            i -= 5;
        })

        return scene;
    };

    initShader(nombre, vertex, fragment, attributes) {
        const material = new BABYLON.ShaderMaterial(
            nombre,
            this.scene,
            {
                vertexSource: vertex,
                fragmentSource: fragment,
            },
            {
                attributes: attributes,
                uniforms: ["worldViewProjection", "time"],
            }
        );

        return material;
    }

    onmouseover(IdEstacion) {
        const malla = this.modelos[`modelo_${IdEstacion}`];
        malla.material = this.initShader("fireShader", fire_vertexShader, fire_fragmentShader, ["position", "uv"]);
        malla.position.z = -3;
    }

    onmouseout(IdEstacion) {
        const malla = this.modelos[`modelo_${IdEstacion}`];
        malla.material = this.initShader("waterShader", water_vertexShader, water_fragmentShader, ["position", "normal"]);
        malla.position.z = 0;
    }

    suscribirEventos() {
        this.engine.runRenderLoop(() => this.scene.render());
        window.addEventListener("resize", () => this.engine.resize());

        EventsManager.Instance.Suscribirevento(
            "OnMouseHoverEstacion",
            new EventoCustomizado((data) =>
                this.onmouseover(data.IdEstacion)
            )
        );

        EventsManager.Instance.Suscribirevento(
            "OnMouseOutEstacion",
            new EventoCustomizado((data) =>
                this.onmouseout(data.IdEstacion)
            )
        );
    }

}

export default Perfil3D
