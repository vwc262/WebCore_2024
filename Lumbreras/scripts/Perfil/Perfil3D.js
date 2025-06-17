import { franja_fragmentShader, franja_vertexShader } from "../../assets/3D/models/shaders/franja.js";
import { noise_fragmentSource, noise_vertexSource } from "../../assets/3D/models/shaders/noise.js";
import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";

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
        this.initialPosition = null;
        this.rootPath = '../../assets/3D/';

        this.interceptores = null;
        this.interceptores_keys = null;
        this.interceptores_mesh = {};

        this.tiempoTranscurrido = 0;
        this.interpolando = false;

        this.franjaShaderMaterialBase = null;
        this.shaderTime = 0;
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

    // Función para crear la escena
    createScene = () => {
        // Crear un objeto escena
        const scene = new BABYLON.Scene(this.engine);

        // 1. Crear el nodo objetivo (target)
        this.cameraTarget = new BABYLON.TransformNode('cameraTarget', scene);
        this.cameraTarget.position = new BABYLON.Vector3(0, 0, -1);

        // Muestra el target actual
        this.targetDebug = BABYLON.MeshBuilder.CreateSphere("debug", { diameter: 0.125 }, scene);
        this.targetDebug.material = new BABYLON.StandardMaterial("debugMat", scene);
        this.targetDebug.material.diffuseColor = BABYLON.Color3.Red();
        this.targetDebug.position = this.cameraTarget.position;

        // 2. Crear la cámara con parámetros iniciales
        const camera = new BABYLON.ArcRotateCamera(
            "mainCamera",
            this.deg2rad(55),   // alpha (rotación horizontal en radianes)
            this.deg2rad(90),  // beta (rotación vertical en radianes)
            0,             // radio (distancia al target)
            this.cameraTarget.position,
            scene
        );

        // Configurar planos de recorte
        camera.minZ = 0.1;    // Distancia mínima de renderizado (near)
        camera.maxZ = 1000;   // Distancia máxima de renderizado (far)

        this.initialPosition = camera.position;

        // Targets the camera to scene origin
        camera.attachControl(this.canvas, true); // Habilitar controles

        // 4. Configurar límites y comportamientos
        camera.upperBetaLimit = this.deg2rad(50); // Límite superior
        camera.lowerBetaLimit = this.deg2rad(10); // Límite inferior

        camera.upperAlphaLimit = this.deg2rad(150); // Límite horizontal izq
        camera.lowerAlphaLimit = this.deg2rad(0); // Límite horizontal der

        camera.panningSensibility = 2500;
        camera.panningDistanceLimit = 10;

        camera.wheelPrecision = 50;
        camera.zoomToMouseLocation = true;

        // 5. Ajustar radio inicial y límites
        camera.radius = 10;  // Distancia inicial
        camera.lowerRadiusLimit = 2;  // Zoom in mínimo
        camera.upperRadiusLimit = 6; // Zoom out máximo

        // 7. Para modelos muy pequeños, usa valores más altos
        camera.angularSensibilityX = 2500;
        camera.angularSensibilityY = 2500;

        this.camera = camera;

        BABYLON.SceneLoader.ImportMesh(
            "",
            `${this.rootPath}/models/`,
            "mapaCDMX.glb",
            scene,
            async (newMesh) => {

                newMesh.forEach((mesh, i) => {

                    if (mesh.name.includes('CrystalCDMX_primitive0')) {

                        mesh.material.metallic = 0;
                        mesh.material.roughness = 0.02;
                        mesh.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
                        mesh.material.emissiveIntensity = 1.10; // Valor entre 0 y 1
                        mesh.material.alpha = 0.9
                    }
                    // caras internas
                    else if (mesh.name.includes('CrystalCDMX_primitive1')) {

                    }
                    else if (mesh.name.includes('"Valle_cdmx_2023_4"')) {

                    }
                    else if (mesh.name.includes('Plane')) {

                        // Crear nuevo material Unlit
                        const unlitMaterial = new BABYLON.StandardMaterial("unlit_" + mesh.name, scene);

                        // Copiar propiedades básicas del material original
                        if (mesh.material.albedoTexture) {
                            unlitMaterial.emissiveTexture = mesh.material.albedoTexture.clone();
                            unlitMaterial.diffuseTexture = mesh.material.albedoTexture.clone();
                        }

                        // Configurar como Unlit
                        unlitMaterial.emissiveColor = mesh.material.albedoColor || new BABYLON.Color3(2, 2, 2);
                        unlitMaterial.disableLighting = true;  // ¡Esto lo hace Unlit!
                        unlitMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

                        // Aplicar el nuevo material
                        mesh.material = unlitMaterial;


                        const unlitNoiseMaterial = this.initShader("stripeShader", noise_vertexSource, noise_fragmentSource,
                            ["position", "uv"],
                            ["worldViewProjection", "diffuseTexture", "noiseTexture", "noiseIntensity", "noiseScale"],
                            ["diffuseTexture", "noiseTexture"],
                            true
                        );

                        // 2. Configurar texturas CORRECTAMENTE
                        const diffuseTexture = unlitMaterial.diffuseTexture;
                        const noiseTexture = new BABYLON.Texture(`${this.rootPath}/textures/AO_Waves.jpg`, scene);

                        // Configurar repetición del ruido
                        noiseTexture.wrapU = BABYLON.Texture.WRAP_REPEAT;
                        noiseTexture.wrapV = BABYLON.Texture.WRAP_REPEAT;

                        // Asignar texturas al material
                        unlitNoiseMaterial.setTexture("diffuseTexture", diffuseTexture);
                        unlitNoiseMaterial.setTexture("noiseTexture", noiseTexture);

                        // 3. Configurar parámetros
                        unlitNoiseMaterial.setFloat("noiseIntensity", 2.0); // Intensidad (0-1)
                        unlitNoiseMaterial.setFloat("noiseScale", 12.0);     // Escala del ruido

                        // 4. Forzar modo Unlit
                        unlitNoiseMaterial.disableLighting = true;

                        // 5. Aplicar a la malla
                        mesh.material = unlitNoiseMaterial;

                    }
                    else if (mesh.name.includes('Interceptor_')) {
                        let splitted = mesh.name.split('_');
                        let abrev = splitted[splitted.length - 1];

                        let _intercetptor = this.interceptores_keys.find(k => this.interceptores[k].abreviacion.includes(abrev))

                        if (_intercetptor > 0) {

                            mesh.isPickable = true; // Esto es esencial
                            mesh.actionManager = new BABYLON.ActionManager(scene);

                            EventsManager.Instance.Suscribirevento(
                                `Interceptor_Dial_Click_${_intercetptor}`,
                                new EventoCustomizado(() => {
                                    this.onInterceptorClick();

                                    mesh.material = this.franjaShaderMaterialSelected;
                                })
                            );

                            mesh.actionManager.registerAction(
                                new BABYLON.ExecuteCodeAction(
                                    BABYLON.ActionManager.OnPickTrigger,
                                    () => {
                                        EventsManager.Instance.EmitirEvento("Interceptor_Click", { key: _intercetptor });
                                    }
                                )
                            );

                            this.franjaShaderMaterialBase = this.initShader("stripeShader", franja_vertexShader, franja_fragmentShader,
                                ["position", "uv"],
                                ["worldViewProjection", "time", "stripeWidth", "stripeColor", "backgroundColor", "speed", "direction"],
                                []
                            );
                            this.franjaShaderMaterialSelected = this.initShader("stripeShader", franja_vertexShader, franja_fragmentShader, ["position", "uv"], ["worldViewProjection", "time", "stripeWidth", "stripeColor", "speed", "direction"], []);

                            // Configurar parámetros iniciales
                            this.franjaShaderMaterialBase.setFloat("stripeWidth", 0.2);
                            this.franjaShaderMaterialBase.setColor3("stripeColor", new BABYLON.Color3(0.6, 0.12, 1));
                            this.franjaShaderMaterialBase.setColor3("backgroundColor", new BABYLON.Color3(0.2, 0.2, 0.8)); // Azul oscuro para el fondo
                            this.franjaShaderMaterialBase.setFloat("speed", -0.5);
                            this.franjaShaderMaterialBase.setVector2("direction", new BABYLON.Vector2(0, 1));

                            this.franjaShaderMaterialSelected.setFloat("stripeWidth", 0.2);
                            this.franjaShaderMaterialSelected.setColor3("stripeColor", new BABYLON.Color3(0.15, 0.79, 0.83));
                            this.franjaShaderMaterialSelected.setFloat("speed", -0.5);
                            this.franjaShaderMaterialSelected.setVector2("direction", new BABYLON.Vector2(0, 1));

                            mesh.material = this.franjaShaderMaterialBase;

                            if (this.interceptores_mesh[_intercetptor] == undefined) {
                                this.interceptores_mesh[_intercetptor] = mesh;
                            }
                        } else {
                            mesh.dispose();
                        }
                    }
                    else if (mesh.name.includes('Cube_')) {
                        if (!mesh.name.includes('root')) {
                            let idCubo = parseInt(mesh.name.split('_')[1]);
                            mesh.isPickable = true;
                            mesh.actionManager = new BABYLON.ActionManager(scene);

                            mesh.actionManager.registerAction(
                                new BABYLON.ExecuteCodeAction(
                                    BABYLON.ActionManager.OnPickTrigger,
                                    () => {
                                        this.interpolar(mesh);
                                    }
                                )
                            );

                            if (idCubo > 40) {
                                mesh.dispose();
                            }
                        }
                    }
                })

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

    initShader(nombre, vertex, fragment, attributes, uniforms, samplers, needAlphaBlending = false) {
        const material = new BABYLON.ShaderMaterial(
            nombre,
            this.scene,
            {
                vertexSource: vertex,
                fragmentSource: fragment,
            },
            {
                attributes: attributes,
                uniforms: uniforms,
                samplers: samplers,
                needAlphaBlending: needAlphaBlending
            },
        );

        return material;
    }

    interpolar(mesh, duration = 1.0) {
        // 1. Guardar posiciones iniciales
        const startTargetPos = this.cameraTarget.position.clone();
        const startCamPos = this.camera.position.clone();

        // 2. Calcular la posición final del target (el mesh clickeado)
        let endTargetPos = mesh.position.clone();
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

    onInterceptorClick() {

        let keys = Object.keys(this.interceptores_mesh);
        keys.forEach(k => {
            this.interceptores_mesh[k].material = this.franjaShaderMaterialBase;
        })

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

    suscribirEventos() {
        // Manejar redimensionado de ventana
        window.addEventListener("resize", () => {
            this.engine.resize();
            // Actualizar matrices de la cámara
            this.camera.getViewMatrix(true);
            this.camera.getProjectionMatrix(true);
        });

        const originalTarget = this.camera.target.clone();
        const minHeight = 0.5; // Altura mínima sobre el piso
        const maxHeight = 1.5; // Altura mínima sobre el piso

        this.scene.onBeforeRenderObservable.add(() => {

            const currentOffset = this.camera.target.subtract(originalTarget);
            const horizontalDistance = Math.sqrt(currentOffset.x * currentOffset.x + currentOffset.z * currentOffset.z);

            if (!this.interpolando) {
                // Soft limit para el radio
                if (horizontalDistance > this.camera.panningDistanceLimit * 0.3) {
                    const exceedRatio = (horizontalDistance - this.camera.panningDistanceLimit * 0.3) / (this.camera.panningDistanceLimit * 0.2);
                    const resistance = exceedRatio * exceedRatio * 0.1; // Aumenta resistencia exponencialmente

                    const directionXZ = new BABYLON.Vector3(currentOffset.x, 0, currentOffset.z).normalize();
                    this.camera.target.x -= directionXZ.x * resistance;
                    this.camera.target.z -= directionXZ.z * resistance;
                }

                this.camera.target.y = originalTarget.y;
            }

            this.cameraTarget.position = this.camera.target;
            this.targetDebug.position = this.camera.target;

            if (this.franjaShaderMaterialBase) {
                this.shaderTime += this.scene.getAnimationRatio() * 0.01;
                this.franjaShaderMaterialBase.setFloat("time", this.shaderTime);
            }
        });
    }
}

export default Perfil3D
