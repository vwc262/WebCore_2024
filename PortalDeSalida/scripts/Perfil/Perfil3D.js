import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { water_vertexShader, water_fragmentShader } from "../../assets/shaders/s_water.js"
import { EnumTipoSignal } from "../Utilities/Enums.js";

/** @returns {Perfil3D} */
class Perfil3D {

    static #_instance = undefined;
    /**
     * @returns {Perfil3D}
     */
    static get Instance() {
        if (!this.#_instance) {
            this.#_instance = new Perfil3D();
        }
        return this.#_instance;
    }

    constructor() {
        this.canvas = null;
        this.body = null;
        this.engine = null;
        this.scene = null;
        this.camera = null;
        this.initialPosition = {};
        this.rootPath = '../../assets/3D/';

        this.interceptores = null;
        this.interceptores_keys = null;
        this.interceptores_mesh = {};

        this.tiempoTranscurrido = 0;
        this.interpolando = false;
        this.configuracionAguas = {}
    }

    create() {

        this.interceptores = Core.Instance.Configuracion.interceptores;
        this.interceptores_keys = Object.keys(this.interceptores);

        // Obtener el canvas del DOM
        this.canvas = document.getElementById("renderCanvas");
        this.body = document.getElementsByTagName('body')[0];

        // Inicializar el motor Babylon.js
        this.engine = new BABYLON.Engine(this.canvas, true, { stencil: true });

        // Llamar a la función y renderizar la escena
        this.scene = this.createScene();
        this.scene.useRightHandedSystem = true;

        // Render loop (animación continua)
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        this.suscribirEventos();

    }

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

    // Función para crear la escena
    createScene = () => {
        // Crear un objeto escena
        const scene = new BABYLON.Scene(this.engine);

        // 1. Crear el nodo objetivo (target)
        this.cameraTarget = new BABYLON.TransformNode('cameraTarget', scene);
        this.cameraTarget.position = new BABYLON.Vector3(-30, 20, -20);

        // Muestra el target actual
        this.targetDebug = BABYLON.MeshBuilder.CreateSphere("debug", { diameter: 0.125 }, scene);
        this.targetDebug.material = new BABYLON.StandardMaterial("debugMat", scene);
        this.targetDebug.material.diffuseColor = BABYLON.Color3.Red();
        this.targetDebug.position = this.cameraTarget.position;

        // 2. Crear la cámara con parámetros iniciales
        const camera = new BABYLON.ArcRotateCamera(
            "mainCamera",
            this.deg2rad(-129),   // alpha (rotación horizontal en radianes)
            this.deg2rad(55),  // beta (rotación vertical en radianes)
            0,             // radio (distancia al target)
            this.cameraTarget.position,
            scene
        );

        // Configurar planos de recorte
        camera.minZ = 0.1;    // Distancia mínima de renderizado (near)
        camera.maxZ = 10000;   // Distancia máxima de renderizado (far)

        // También puedes ajustar el radio mínimo si la cámara se acerca demasiado
        camera.lowerRadiusLimit = 0.5;

        this.initialPosition = {
            position: camera.position.clone(),
            rotate: camera.rotation.clone()
        }

        // Targets the camera to scene origin
        camera.attachControl(this.canvas, true); // Habilitar controles

        // 4. Configurar límites y comportamientos
        // camera.upperBetaLimit = this.deg2rad(62); // Límite superior
        // camera.lowerBetaLimit = this.deg2rad(15); // Límite inferior

        // camera.upperAlphaLimit = this.deg2rad(-60); // Límite horizontal izq
        // camera.lowerAlphaLimit = this.deg2rad(-150); // Límite horizontal der

        camera.panningSensibility = 250;
        camera.panningDistanceLimit = 220;

        camera.wheelPrecision = 50;
        camera.zoomToMouseLocation = true;

        // 5. Ajustar radio inicial y límites
        camera.radius = 10;  // Distancia inicial
        camera.lowerRadiusLimit = 1;  // Zoom in mínimo
        camera.upperRadiusLimit = 100; // Zoom out máximo

        // 7. Para modelos muy pequeños, usa valores más altos
        camera.angularSensibilityX = 2500;
        camera.angularSensibilityY = 2500;

        this.camera = camera;

        // 2. Luz: Añadir una luz direccional fuerte
        const light = new BABYLON.DirectionalLight(
            "light",
            new BABYLON.Vector3(0.5, -1, 1), // Dirección de la luz
            scene
        );
        light.intensity = 0.8; // Intensidad de la luz

        // cdmx
        BABYLON.SceneLoader.ImportMesh(
            "",
            `${this.rootPath}/models/`,
            "51_lumbrera_6_TEO.glb",
            scene,
            async (newMesh) => {
                const pivote_i = scene.getNodeByName("Water_0");
                const pivote_s = scene.getNodeByName("Water_1");
                const camera_i = scene.getNodeByName("Int");
                const camera_e = scene.getNodeByName("Ext_1");
                const sensor = scene.getNodeByName("Sensor");
console.log(camera_i.rotation)
                this.configuracionAguas["2"] = {
                    meshes: [],
                    pivotes: [{
                        vectorInferior: pivote_i.position.clone(),
                        vectorSuperior: pivote_s.position.clone(),
                    }],
                    camaras: [{
                        camera_Interior_p: camera_i.position.clone(),
                        camera_Interior_r: camera_i.rotation.clone(),
                        camera_Exterior_p: camera_e.position.clone(),
                        camera_Exterior_r: camera_e.rotation.clone(),
                    }],
                    sensores: [sensor]
                }
console.log(this.configuracionAguas["2"].camaras[0])
                newMesh.forEach((mesh, i) => {
                    // if (mesh.name.includes("primitive")) {
                    //     console.log(mesh.name)
                    //     const unlitMaterial = new BABYLON.StandardMaterial("unlit_" + mesh.name, scene)
                    //     // Copiar propiedades básicas del material original
                    //     if (mesh.material.albedoTexture) {
                    //         unlitMaterial.emissiveTexture = mesh.material.albedoTexture.clone();
                    //         unlitMaterial.diffuseTexture = mesh.material.albedoTexture.clone();
                    //     }
                    //     unlitMaterial.emissiveColor = mesh.material.albedoColor || new BABYLON.Color3(2, 2, 2);
                    //     unlitMaterial.disableLighting = true;  // ¡Esto lo hace Unlit!
                    //     unlitMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                    //     mesh.material = unlitMaterial;
                    // }

                    if (mesh.name.includes("Agua")) {
                        this.configuracionAguas["2"].meshes.push(mesh);
                    }
                });
            },
            null,
            (scene, message) => {
                console.error("Error al cargar el modelo:", message);
            }
        );

        scene.performancePriority = BABYLON.ScenePerformancePriority.Aggressive;

        scene.autoClear = false;
        scene.autoClearDepthAndStencil = false;
        //scene.debugLayer.show();

        return scene;
    };

    interpolar(position, duration = 1.0) {
        console.log(position)
        // 1. Guardar posiciones iniciales
        const startTargetPos = this.cameraTarget.position.clone();
        const startCamPos = this.camera.position.clone();

        // 2. Calcular la posición final del target (el position clickeado)
        const endTargetPos = position;
        endTargetPos.y = this.camera.target.y;

        // 3. Calcular la dirección y distancia final de la cámara
        const direction = startCamPos.subtract(endTargetPos).normalize();
        const currentDistance = BABYLON.Vector3.Distance(startCamPos, startTargetPos);
        const endCamPos = endTargetPos.add(direction.scale(currentDistance));

        // 4. Animación con smoothstep
        let startTime = Date.now();
        this.interpolando = true;

        const animate = () => {
            const elapsed = (Date.now() - startTime) / 1000; // Tiempo en segundos
            const t = Math.min(elapsed / duration, 1.0); // Normalizado [0, 1]

            // Aplicar smoothstep (suavizado)
            const smoothT = t * t * (3 - 2 * t); // Fórmula smoothstep

            // Interpolar posiciones
            this.cameraTarget.position = BABYLON.Vector3.Lerp(
                startTargetPos,
                endTargetPos,
                smoothT
            );

            this.targetDebug.position = this.cameraTarget.position;

            // 1. Guardar la distancia actual (radio) y ángulos de la cámara
            const radioActual = this.camera.radius;
            const alphaActual = this.camera.alpha;
            const betaActual = this.camera.beta;

            // 2. Mover el target al nuevo mesh
            this.camera.target = BABYLON.Vector3.Lerp(
                startTargetPos,
                endTargetPos,
                smoothT
            );

            this.camera.position = BABYLON.Vector3.Lerp(
                startCamPos,
                endCamPos,
                smoothT
            );

            // 3. Recalcular la posición de la cámara manteniendo rotación y distancia
            this.camera.radius = radioActual; // Conservar distancia
            this.camera.alpha = alphaActual;  // Conservar rotación horizontal
            this.camera.beta = betaActual;    // Conservar rotación vertical

            // (Opcional) Forzar actualización si es necesario
            this.camera.rebuildAnglesAndRadius();

            // Continuar animación hasta completar
            if (t < 1.0) {
                requestAnimationFrame(animate);
            } else {
                this.interpolando = false;
            }
        };

        animate();
    }

    // 2. Función corregida para coordenadas con scale y offset
    getCorrectedPickingCoordinates(clientX, clientY) {
        // Obtener transformación del contenedor
        const transform = new DOMMatrix(getComputedStyle(this.body).transform);
        const scaleX = transform.a;
        const scaleY = transform.d;

        // Obtener posición absoluta considerando el scale
        const rect = this.canvas.getBoundingClientRect();
        const offsetX = (clientX - rect.left) / scaleX;
        const offsetY = (clientY - rect.top) / scaleY;

        // Ajustar al viewport de WebGL
        return {
            x: (offsetX / rect.width) * this.canvas.width,
            y: (offsetY / rect.height) * this.canvas.height
        };
    }

    deg2rad(degrees) {
        return degrees * (Math.PI / 180);
    }

    radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }

    update() {
        let estaciones = Core.Instance.data;
        estaciones.forEach(estacion => {
            let niveles = estacion.Signals.filter(s => s.TipoSignal == EnumTipoSignal.Nivel);
            niveles.forEach((nivel, i) => {
                let semaforo = nivel.Semaforo;

                // let valor = nivel.DentroRango ? (nivel.Valor / semaforo.Altura) : 0;
                let valor = Math.random();

                // Asegurar que t esté en el rango [0, 1]
                let t = Math.max(0, Math.min(1, valor));

                // Interpolación lineal (LERP)
                if (this.configuracionAguas[estacion.IdEstacion])
                    this.configuracionAguas[estacion.IdEstacion].meshes[i].position = BABYLON.Vector3.Lerp(this.configuracionAguas[estacion.IdEstacion].pivotes[i].vectorInferior, this.configuracionAguas[estacion.IdEstacion].pivotes[i].vectorSuperior, t);
            });
        })
    }

    resetCamara() {
        this.interpolar(this.initialPosition.position);
    }

    camara_interior(IdEstacion) {
        if (this.configuracionAguas[IdEstacion]) {
            let position = this.configuracionAguas[IdEstacion].camaras[0].camera_Interior_p;
            this.interpolar(position)
        }
    }

    suscribirEventos() {
        // Manejar redimensionado de ventana
        window.addEventListener("resize", () => {
            this.engine.resize();
            // Actualizar matrices de la cámara
            this.camera.getViewMatrix(true);
            this.camera.getProjectionMatrix(true);
        });

        EventsManager.Instance.Suscribirevento(
            "Update",
            new EventoCustomizado(() => { this.update() })
        );
        EventsManager.Instance.Suscribirevento(
            "reset_Camara",
            new EventoCustomizado(() => { this.resetCamara() })
        );

        EventsManager.Instance.Suscribirevento(
            "camara_interior",
            new EventoCustomizado((IdEstacion) => this.camara_interior(IdEstacion))
        )

        const originalTarget = this.camera.target.clone();
        const minHeight = 0.5; // Altura mínima sobre el piso
        const maxHeight = 1.5; // Altura mínima sobre el piso

        this.scene.onBeforeRenderObservable.add(() => {

            const currentOffset = this.camera.target.subtract(originalTarget);
            const horizontalDistance = Math.sqrt(currentOffset.x * currentOffset.x + currentOffset.z * currentOffset.z);

            // if (!this.interpolando) {
            //     // Soft limit para el radio
            //     if (horizontalDistance > this.camera.panningDistanceLimit * 0.3) {
            //         const exceedRatio = (horizontalDistance - this.camera.panningDistanceLimit * 0.3) / (this.camera.panningDistanceLimit * 0.2);
            //         const resistance = exceedRatio * exceedRatio * 0.1; // Aumenta resistencia exponencialmente

            //         const directionXZ = new BABYLON.Vector3(currentOffset.x, 0, currentOffset.z).normalize();
            //         this.camera.target.x -= directionXZ.x * resistance;
            //         this.camera.target.z -= directionXZ.z * resistance;
            //     }

            // this.camera.target.y = originalTarget.y;
            // }

            this.cameraTarget.position = this.camera.target;
            this.targetDebug.position = this.camera.target;
        });

    }
}

export default Perfil3D
