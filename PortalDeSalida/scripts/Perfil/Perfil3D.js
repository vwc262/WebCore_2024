import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { water_vertexShader, water_fragmentShader } from "../../assets/shaders/s_water.js"

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

        this.lastHighlighted = null;

        // Material para resaltado
        this.highlightMaterial = null;

        this.tiempoTranscurrido = 0;
        this.interpolando = false;
        this.aguas = []
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
            // console.log(this.camera.position);
            // console.log(
            //     {
            //         alpha: this.camera.alpha,
            //         beta: this.camera.beta,
            //         alphaDeg: this.camera.alpha * 180 / Math.PI,
            //         betaDeg: this.camera.beta * 180 / Math.PI
            //     }
            // );
        });

        this.scene.onPointerMove = (evt) => {
            const corrected = this.getCorrectedPickingCoordinates(evt.clientX, evt.clientY);

            // Debug: mostrar coordenadas
            //console.log(`Original: ${evt.clientX},${evt.clientY} | Corregido: ${corrected.x},${corrected.y}`);

            // Crear rayo con coordenadas corregidas
            const ray = this.scene.createPickingRay(
                corrected.x,
                corrected.y,
                BABYLON.Matrix.Identity(),
                this.camera
            );

            // Opciones avanzadas de picking
            const hit = this.scene.pickWithRay(ray, (mesh) => {
                return mesh.isPickable && mesh.isVisible; // Filtro personalizado
            });


            // Restaurar mesh previamente resaltado
            if (this.lastHighlighted) {
                // this.lastHighlighted.material = this.lastHighlighted.originalMaterial;
                // this.lastHighlighted = null;
            }

            // Resaltar nuevo mesh
            if (hit.pickedMesh
                && hit.pickedMesh.name.includes('Interceptor')
            ) {
                // // Guardar material original
                // hit.pickedMesh.originalMaterial = hit.pickedMesh.material;

                // // Aplicar material de resaltado
                // hit.pickedMesh.material = this.highlightMaterial;
                // this.lastHighlighted = hit.pickedMesh;

                // console.log("Detección precisa en:", hit.pickedMesh.name);
            }
        };

        // this.highlightMaterial = new BABYLON.StandardMaterial("highlightMat", this.scene);
        // this.highlightMaterial.diffuseColor = new BABYLON.Color3(1, 0.5, 0.2); // Naranja brillante
        // this.highlightMaterial.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3); // Ligero brillo

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

        this.initialPosition = camera.position;

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

        // Crear skybox con una textura que sí existe
        const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
            '../../assets/3D/textures/BlueSunset',
            scene,
            ["_px.png", "_py.png", "_pz.png", "_nx.png", "_ny.png", "_nz.png"]
        );
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.reflectionTexture.gammaSpace = true;
        skyboxMaterial.reflectionTexture.level = 1.5; // Valores > 1 aumentan el brillo
        skybox.material = skyboxMaterial;

        this.highlightMaterial = new BABYLON.StandardMaterial("highlightMat", scene);
        this.highlightMaterial.diffuseColor = new BABYLON.Color3(1, 0.5, 0.2); // Naranja brillante
        this.highlightMaterial.emissiveColor = new BABYLON.Color3(0.3, 0.3, 0.3); // Ligero brillo

        // O una luz direccional más fuerte
        const dirLight = new BABYLON.DirectionalLight("dirLight",
            new BABYLON.Vector3(-1, -2, -1), scene);
        dirLight.intensity = 2.0;

        // cdmx
        BABYLON.SceneLoader.ImportMesh(
            "",
            `${this.rootPath}/models/`,
            "Portal_DeSalida_All_Test.glb",
            scene,
            async (newMesh) => {
                newMesh.forEach((mesh, i) => {
                    if (mesh.name.includes("Agua")) {
                        this.aguas.push(mesh);
                        mesh.material = this.initShader("waterShader", water_vertexShader, water_fragmentShader, ["position", "normal"]);
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

    interpolar(mesh, duration = 1.0) {
        // 1. Guardar posiciones iniciales
        const startTargetPos = this.cameraTarget.position.clone();
        const startCamPos = this.camera.position.clone();

        // 2. Calcular la posición final del target (el mesh clickeado)
        const endTargetPos = mesh.position.clone();

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
            this.interceptores_mesh[k].material.emissiveColor = new BABYLON.Color3(1.0, 0.0, 0.0);
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

    diagnoseMaterial(mesh) {
        if (!mesh || !mesh.material) {
            return "No material found";
        }

        const mat = mesh.material;
        let result = {
            type: mat.getClassName ? mat.getClassName() : "Unknown",
            properties: {}
        };

        // Propiedades comunes
        if (mat instanceof BABYLON.StandardMaterial) {
            result.properties = {
                diffuseColor: mat.diffuseColor,
                specularColor: mat.specularColor,
                reflectionTexture: !!mat.reflectionTexture,
                emissiveColor: mat.emissiveColor
            };
        }
        else if (mat instanceof BABYLON.PBRMaterial) {
            result.properties = {
                albedoColor: mat.albedoColor,
                metallic: mat.metallic,
                roughness: mat.roughness,
                environmentTexture: !!mat.environmentTexture
            };
        }

        // Verificar si es un material multi-material
        if (mesh.subMeshes && mesh.subMeshes.length > 1) {
            result.multiMaterial = true;
            result.subMaterials = mesh.subMeshes.map(sub => {
                return scene.multiMaterials[sub.materialIndex]?.getClassName();
            });
        }

        console.log(result);
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

            // if (!this.interpolando) {
            //     // Soft limit para el radio
            //     if (horizontalDistance > this.camera.panningDistanceLimit * 0.3) {
            //         const exceedRatio = (horizontalDistance - this.camera.panningDistanceLimit * 0.3) / (this.camera.panningDistanceLimit * 0.2);
            //         const resistance = exceedRatio * exceedRatio * 0.1; // Aumenta resistencia exponencialmente

            //         const directionXZ = new BABYLON.Vector3(currentOffset.x, 0, currentOffset.z).normalize();
            //         this.camera.target.x -= directionXZ.x * resistance;
            //         this.camera.target.z -= directionXZ.z * resistance;
            //     }

            //     // Soft limit para altura
            //     if (this.camera.target.y < minHeight * 0.75) {
            //         const exceed = (minHeight * 1.5 - this.camera.target.y) / minHeight;
            //         this.camera.target.y += exceed * 0.05;
            //     }

            //     // Soft limit para altura máxima
            //     if (this.camera.target.y > maxHeight * 0.9) {
            //         const exceed = (this.camera.target.y - maxHeight * 0.9) / maxHeight;
            //         this.camera.target.y -= exceed * 0.05;
            //     }
            // }

            this.cameraTarget.position = this.camera.target;
            this.targetDebug.position = this.camera.target;

            this.aguas.forEach(agua => {
                agua.scaling.y += 2 * Math.sin(performance.now() / 1000); // Efecto pulsante
            })
        });

    }
}

export default Perfil3D
