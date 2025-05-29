
/** @returns {Perfil3D} */
class Perfil3D {

    constructor() {
        this.canvas = null;
        this.engine = null;
        this.scene = null;
        this.camera = null;
        this.initialPosition = null;
        this.actionManager = undefined; // Manager to handle events    
        this.rootPath = '../../assets/3D/';
    }

    create() {

        // Obtener el canvas del DOM
        this.canvas = document.getElementById("renderCanvas");

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

        this.suscribirEventos();

    }

    // Función para crear la escena
    createScene = () => {
        // Crear un objeto escena
        const scene = new BABYLON.Scene(this.engine);

        // 1. Crear el nodo objetivo (target)
        let cameraTarget = new BABYLON.TransformNode('cameraTarget', scene);
        cameraTarget.position = new BABYLON.Vector3(0, 0, -1);

        // 2. Crear la cámara con parámetros iniciales
        const camera = new BABYLON.ArcRotateCamera(
            "mainCamera",
            this.deg2rad(-129),   // alpha (rotación horizontal en radianes)
            this.deg2rad(55),  // beta (rotación vertical en radianes)
            0,             // radio (distancia al target)
            cameraTarget.position,
            scene
        );

        this.initialPosition = camera.position;

        // 3. Asignar el target correctamente (mejor que usar solo la posición)
        // camera.setTarget(cameraTarget);

        // Targets the camera to scene origin
        camera.attachControl(this.canvas, true); // Habilitar controles

        // 4. Configurar límites y comportamientos
        // camera.upperBetaLimit = this.deg2rad(55); // Límite superior
        // camera.lowerBetaLimit = this.deg2rad(25); // Límite inferior

        // camera.upperAlphaLimit = this.deg2rad(-60); // Límite horizontal izq
        // camera.lowerAlphaLimit = this.deg2rad(-180); // Límite horizontal der

        camera.panningSensibility = 2500;
        camera.panningDistanceLimit = 10;

        camera.wheelPrecision = 50;
        camera.zoomToMouseLocation = true;

        // 5. Ajustar radio inicial y límites
        camera.radius = 10;  // Distancia inicial
        camera.lowerRadiusLimit = 5;  // Zoom in mínimo
        camera.upperRadiusLimit = 20; // Zoom out máximo

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

        // cdmx
        BABYLON.SceneLoader.ImportMesh(
            "",
            `${this.rootPath}/models/`,
            "cdmx.glb",
            scene,
            async (newMesh) => {

                const directionalLight = scene.getLightByName("Light");
                const areaLight1 = scene.getLightByName("Area");
                const areaLight2 = scene.getLightByName("Area.001");

                if (directionalLight) {
                    directionalLight.intensity = 1.0;
                }
                if (areaLight1) {
                    areaLight1.intensity = 3.0;
                }
                if (areaLight2) {
                    areaLight2.intensity = 4.0;
                }

                let crystalMaterial = null;

                newMesh.forEach((mesh, i) => {

                    if (mesh.name.includes('CrystalCDMX_primitive0')) {

                        mesh.material.metallic = 0;
                        mesh.material.roughness = 0.02;
                        // mesh.material.subSurface.isRefractionEnabled = true;
                        // mesh.material.subSurface.indexOfRefraction = 0.89;

                        // mesh.material.diffuseColor = new BABYLON.Color4(0.8, 0.9, 1, 0.3); // Color con transparencia
                        // mesh.material.specularColor = new BABYLON.Color3(1, 1, 1); // Reflejos blancos puros

                        // Parámetros clave para efecto cristal:
                        // mesh.material.environmentTexture = skyboxMaterial.reflectionTexture.clone();
                        // mesh.material.environmentIntensity = 1.0;
                        // mesh.material.reflectionTexture = mesh.material.environmentTexture;
                        // mesh.material.reflectionTexture.level = 0.8; // Reflejos más intensos (0.7-1)
                        // mesh.material.refractionTexture = mesh.material.environmentTexture.clone(); // Para refracción
                        // mesh.material.indexOfRefraction = 0.59; // Índice de refracción (0.85-1.1)
                        // mesh.material.linkRefractionWithTransparency = true;
                        // mesh.material.alpha = 0.7; // Transparencia (0-1)
                        // mesh.material.microSurface = 1; // Máximo brillo
                        // mesh.material.specularIntensity = 0.3; // Reflejos sutiles
                        // mesh.material.useRadianceOverAlpha = false; // Evita efectos de sobreexposición
                        // mesh.material.directIntensity = 0.8; // Reduce impacto de luces directas

                        // Opcional: Efecto Fresnel para reflejos más realistas
                        // mesh.material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
                        // mesh.material.reflectionFresnelParameters.bias = 0.1;
                        // mesh.material.reflectionFresnelParameters.power = 1.2;

                        if (crystalMaterial == null)
                            crystalMaterial = mesh.material
                    }
                    // caras internas
                    else if (mesh.name.includes('CrystalCDMX_primitive1')) {

                    }
                    else if (mesh.name.includes('Plane')) {

                        mesh.material.metallic = 0;
                        mesh.material.roughness = 0.02;
                        // mesh.material.subSurface.isRefractionEnabled = true;
                        // mesh.material.subSurface.indexOfRefraction = 0.69;

                        // mesh.material.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.4); // Color base
                        // mesh.material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.3); // Reflejos especulares

                        // // Parámetros clave para reflejos:
                        // mesh.material.environmentTexture = skyboxMaterial.reflectionTexture.clone();
                        // mesh.material.environmentIntensity = 0.7;
                        // mesh.material.reflectionTexture = mesh.material.environmentTexture; // Usar el mismo skybox
                        // mesh.material.reflectionTexture.level = 0.4; // Intensidad del reflejo (0.3-0.6 para azulejos)
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
        // scene.freezeActiveMeshes();
        //scene.debugLayer.show();

        return scene;
    };

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

    getActionManager() {
        return this.actionManager ?? new BABYLON.ActionManager(this.scene);
    }

    suscribirEventos() {
        // Manejar redimensionado de ventana
        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        /*Prototypes*/
        BABYLON.Camera.prototype.aniLockedTarget = function () {

        }

        const originalTarget = this.camera.target.clone();
        const minHeight = 0.5; // Altura mínima sobre el piso
        const maxHeight = 1.5; // Altura mínima sobre el piso

        this.scene.onBeforeRenderObservable.add(() => {

            const currentOffset = this.camera.target.subtract(originalTarget);
            const horizontalDistance = Math.sqrt(currentOffset.x * currentOffset.x + currentOffset.z * currentOffset.z);

            // Soft limit para el radio
            if (horizontalDistance > this.camera.panningDistanceLimit * 0.3) {
                const exceedRatio = (horizontalDistance - this.camera.panningDistanceLimit * 0.3) / (this.camera.panningDistanceLimit * 0.2);
                const resistance = exceedRatio * exceedRatio * 0.1; // Aumenta resistencia exponencialmente

                const directionXZ = new BABYLON.Vector3(currentOffset.x, 0, currentOffset.z).normalize();
                this.camera.target.x -= directionXZ.x * resistance;
                this.camera.target.z -= directionXZ.z * resistance;
            }

            // Soft limit para altura
            if (this.camera.target.y < minHeight * 1.5) {
                const exceed = (minHeight * 1.5 - this.camera.target.y) / minHeight;
                this.camera.target.y += exceed * 0.05;
            }

            // Soft limit para altura máxima
            if (this.camera.target.y > maxHeight * 0.9) {
                const exceed = (this.camera.target.y - maxHeight * 0.9) / maxHeight;
                this.camera.target.y -= exceed * 0.05;
            }
        });
    }
}

export default Perfil3D
