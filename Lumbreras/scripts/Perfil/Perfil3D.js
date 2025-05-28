
/** @returns {Perfil3D} */
class Perfil3D {

    constructor() {
        this.canvas = null;
        this.engine = null;
        this.scene = null;
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
        //this.scene.clearColor = new BABYLON.Color3(0.2, .2, 0.2);
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

        let CameraTarget = new BABYLON.TransformNode('target', scene)
        CameraTarget.position.addInPlace(new BABYLON.Vector3(0, 0, 0));

        const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, CameraTarget.position, scene);
        camera.mapPanning = true;
        camera.panningSensibility = 50;
        camera.upperBetaLimit = Math.PI * .4; //(it is equalt to 1.57079… just round it to 1.57)
        camera.lowerRadiusLimit = 50;
        camera.upperRadiusLimit = 150;
        camera.panningDistanceLimit = 120;
        camera.zoomToMouseLocation = true;

        // Targets the camera to scene origin
        camera.attachControl(this.canvas, true); // Habilitar controles

        // This attaches the camera to the canvas            
        // Creates a light, aiming 0,1,0 - to the sky
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0, 1), scene);
        // Dim the light a small amount - 0 to 1

        // Skybox
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 920 }, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(`${this.rootPath}/textures/dark-s`, scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;


        const water = new BABYLON.WaterMaterial("water", scene);
        water.bumpTexture = new BABYLON.Texture(`${this.rootPath}/textures/waterbump.png`, scene);
        water.windForce = -15;
        water.waveHeight = 1.3;
        water.windDirection = new BABYLON.Vector2(1, 1);
        water.waterColor = new BABYLON.Color3(0.1, 0.1, 0.6);
        water.colorBlendFactor = 0.2;
        water.bumpHeight = .7;
        water.waveLength = 0.2;
        water.disableDepthWrite = true;

        BABYLON.SceneLoader.ImportMesh(
            "",
            `${this.rootPath}/models/`,
            "cdmx.glb",
            scene,
            async (newMesh) => {
                let box = BABYLON.MeshBuilder.CreateBox(`dummyBox`, { size: 2 }, scene);
                box.isVisible = false;

                newMesh.forEach((mesh, i) => {

                    if (mesh.name.includes('alc_')) {

                        mesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
                        mesh.material.albedoColor = new BABYLON.Color3(0.007, 0.007, 0.009);

                        mesh.material = mesh.material.clone(`${mesh.material.name}`);
                        mesh.actionManager = this.getActionManager();
                        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function (ev) {
                            mesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0.2);
                        }));

                        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function (ev) {
                            mesh.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
                        }));
                    }
                })
            },
            null,
            (scene, message) => {
                console.error("Error al cargar el modelo:", message);
            }
        );

        scene.activeCamera.alpha += Math.PI;

        let activateDebugInterface = false;
        if (activateDebugInterface) {
            var nodeMaterial = new BABYLON.NodeMaterial("node material", scene, { emitComments: true });
            scene.debugLayer.show();
            scene.debugLayer.select(nodeMaterial);
        }
        scene.freezeActiveMeshes();
        this.engine.runRenderLoop(function () {
            scene.render();
        });

        return scene;
    };

    createCylinder() {
        const cylinder = new BABYLON.MeshBuilder.CreateCylinder('cylinder', { height: 22, diameterTop: 2, diameterBottom: 2, tessellation: 20, subdivisions: 1, }, this.scene);
        cylinder.position.z = 0;
        cylinder.position.y = 0;
        cylinder.position.x = 0;
        cylinder.visibility = .9999;
        return cylinder;
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
        BABYLON.Camera.prototype.aniLockedTarget = function (targetPos, speed) {
            if (!this.lockedTarget) {
                this.setTarget(this.target);
            }
            // var ease = new BABYLON.CubicEase();
            // ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUTIN);
            // BABYLON.Animation.CreateAndStartAnimation('atz', this, 'radius', speed, 150, this.radius, 50, 0, ease);
            // ease.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
            // BABYLON.Animation.CreateAndStartAnimation('at5', this, 'target', speed, 100, this.target, targetPos, 0, ease);
            // BABYLON.Animation.CreateAndStartAnimation('atr', this, 'beta', speed, 150, this.beta, Math.PI / 4, 0, ease);
        }
    }
}

export default Perfil3D
