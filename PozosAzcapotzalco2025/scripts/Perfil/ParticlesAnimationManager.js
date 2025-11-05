import { EnumModule } from "../Utilities/Enums.js";
import { Module } from "../uiManager.js";
import { Core } from "../Core.js";
import { EnumValorBomba, EnumTipoSignal } from "../Utilities/Enums.js";

class ParticlesAnimator {

    constructor(cssPipe, canvas, idEstacion) {
        let width_height = this.GetWidthHeightFromCSSText(cssPipe);
        this.elementWidth = width_height[0];
        this.elementHeight = width_height[1];
        this.characteristicsWaterCanvas = {
            _Width: this.elementWidth,
            _Height: this.elementHeight,
            particleInitialVelocity_x: 1,
            fps: 20,
            siteAbreviation: ''
        };
        this.Canvas = canvas;
        this.indexContainer = 0;
        this.particlesElements = [];
        this.idEstacion = idEstacion;
    }

    init() {
        this.bombasEncendias = 0;
        this.fillParticles();
        this.SetAnimationFrame();
        this.Render();
    };

    fillParticles() {
        let totalParticles = 20;// Math.floor(Math.random()  * elementWidth * .5);
        let i = 0;
        let interval = setInterval(() => {
            let radius = Math.floor(Math.random() * this.characteristicsWaterCanvas._Width * .05) + 1;
            this.particlesElements.push(this.generateParticle(this.characteristicsWaterCanvas._Width, this.characteristicsWaterCanvas._Height, this.PropuestasColor[this.indexContainer].bolas, radius));
            if (i >= totalParticles)
                clearInterval(interval);
            i++;
        }, 100);
    };

    generateParticle(_Width, _Height, color, radius) {
        let particleConfig = {
            x: Math.random() * _Width,
            y: Math.random() * _Height,
            velocity_x: 1,
            velocity_y: 0,
            color: color,
            radius: radius
        }
        return particleConfig;
    };

    PropuestasColor = [
        { container: 'rgba(72,252,249,0.5)', bolas: 'rgba(56, 169, 183, 0.3)' },
        { container: 'rgba(0,28,254,0.2)', bolas: 'rgba(250,250,250,0.12)' },
        { container: 'rgba(0, 0, 0, 0.1)', bolas: 'rgba(0, 50, 255, 0.2)' },
    ];

    // Falta funcion para saber en que modilo se esta
    drawWaterCanvasByGravity() {
        if (Module == EnumModule.Perfil /*&& !Perfil.isPanning*/) {
            var canvasWaterElements = this.Canvas;
            canvasWaterElements.setAttribute("width", `${this.characteristicsWaterCanvas._Width}`);
            canvasWaterElements.setAttribute("height", `${this.characteristicsWaterCanvas._Height}`);


            var context = canvasWaterElements.getContext("2d");
            context.globalCompositeOperation = "source-over";
            context.fillStyle = this.PropuestasColor[this.indexContainer].container;
            context.fillRect(0, 0, this.characteristicsWaterCanvas._Width, this.characteristicsWaterCanvas._Height);
            context.globalCompositeOperation = "lighter";

            for (var particleIndex = 0; particleIndex < this.particlesElements.length; particleIndex++) {
                var actualParticle = this.particlesElements[particleIndex];

                actualParticle.velocity_x = this.characteristicsWaterCanvas.particleInitialVelocity_x;
                context.beginPath();
                var gradient = context.createRadialGradient(actualParticle.x, actualParticle.y, 0, actualParticle.x, actualParticle.y, actualParticle.radius);
                gradient.addColorStop(1, actualParticle.color);
                context.fillStyle = gradient;
                context.arc(actualParticle.x, actualParticle.y, actualParticle.radius, Math.PI * 2, false);
                context.fill();
                actualParticle.x += -1 * Math.floor(Math.random() * 2) * (this.bombasEncendias);
                actualParticle.y += -0.33 * (particleIndex % 2 == 0 ? actualParticle.velocity_y + 1 : actualParticle.velocity_y - 1) * (this.bombasEncendias);

                let desborde = actualParticle.radius;
                if (actualParticle.x < desborde) actualParticle.x = this.characteristicsWaterCanvas._Width - desborde;
                if (actualParticle.y < desborde) actualParticle.y = this.characteristicsWaterCanvas._Height - desborde;
                if (actualParticle.x > this.characteristicsWaterCanvas._Width - desborde) actualParticle.x = desborde;
                if (actualParticle.y > this.characteristicsWaterCanvas._Height - desborde) actualParticle.y = desborde;
            }
        }
    };

    Render = () => {
        this.bombasEncendias = this.idEstacion ? this.ObtenerCantidadDeBombasEncendidas() : 1;
        window.requestAnimationFrame(this.Render);
        if (this.bombasEncendias > 0) {
            this.drawWaterCanvasByGravity();
        }
    };

    ObtenerCantidadDeBombasEncendidas() {
        let bombaEncendidas = 0;
        const estacion = Core.Instance.GetDatosEstacion(this.idEstacion);
        estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Bomba).forEach(signalBomba => {
            if (signalBomba.Valor == EnumValorBomba.Arrancada)
                bombaEncendidas = 1;
        });

        if (bombaEncendidas > 0)
            this.Canvas.style.display = "block";
        else
            this.Canvas.style.display = "none";

        return bombaEncendidas;
    }

    SetAnimationFrame = function () {
        this.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        window.requestAnimationFrame = this.requestAnimationFrame;
    };

    GetWidthHeightFromCSSText(cssText) {
        let splittedText = cssText.split(';');
        return splittedText.map(value => {
            if (value.includes('width') || value.includes('height')) {
                return value.split(':')[1].replace('px', '');
            }
        }).filter(element => element != undefined);
    }
};

export default ParticlesAnimator;