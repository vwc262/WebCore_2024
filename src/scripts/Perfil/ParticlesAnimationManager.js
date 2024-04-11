class ParticlesAnimator {

    constructor(elementWidth, elementHeight,idPipe){
        this.elementWidth  = elementWidth ;
        this.elementHeight = elementHeight;
        this.idPipe = idPipe;
    }

    characteristicsSiteWaterCanvasByGravity = {
        _Width: elementWidth,
        _Height: elementHeight,
        particleInitialVelocity_x: 1,
        fps: 20,
        siteAbreviation: ''
    };

    idPipe = idPipe;
    CanvasName = '';
    indexContainer = 0;
    
    init = function () {
        this.fillParticles();
        this.SetAnimationFrame();
        this.Render();
    };

    particlesElements = [];
    fillParticles = function () {
        let totalParticles = 20;// Math.floor(Math.random()  * elementWidth * .5);
        let i = 0;
        let interval = setInterval(() => {
            let radius = Math.floor(Math.random() * this.characteristicsSiteWaterCanvasByGravity._Width * .05) + 1;
            this.particlesElements.push(this.generateParticle(this.characteristicsSiteWaterCanvasByGravity._Width, this.characteristicsSiteWaterCanvasByGravity._Height, this.PropuestasColor[this.indexContainer].bolas, radius));
            if (i >= totalParticles)
                clearInterval(interval);
            i++;
        }, 100);
    };

    generateParticle = function (_Width, _Height, color, radius) {
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

    drawWaterCanvasByGravity = function () {
        if (!vwc.isParticularActive && $(`.${this.CanvasName}`).is(":visible") && !Perfil.isPanning) {
            var characteristicsWaterCanvas = this.characteristicsSiteWaterCanvasByGravity;
            var canvasWaterElements = $(`.${this.CanvasName}`).attr({ width: characteristicsWaterCanvas._Width, height: characteristicsWaterCanvas._Height });
            for (var index = 0; index < canvasWaterElements.length; index++) {
                var context = canvasWaterElements[index].getContext("2d");
                context.globalCompositeOperation = "source-over";
                context.fillStyle = this.PropuestasColor[this.indexContainer].container;
                context.fillRect(0, 0, characteristicsWaterCanvas._Width, characteristicsWaterCanvas._Height);
                context.globalCompositeOperation = "lighter";
                for (var particleIndex = 0; particleIndex < this.particlesElements.length; particleIndex++) {
                    var actualParticle = this.particlesElements[particleIndex];         

                    const actualPipe = this.idPipe != -1 ?  vwc.summary.pipes.find(p => p.id == this.idPipe) : undefined;

                    actualParticle.velocity_x = characteristicsWaterCanvas.particleInitialVelocity_x  ;
                    context.beginPath();
                    var gradient = context.createRadialGradient(actualParticle.x, actualParticle.y, 0, actualParticle.x, actualParticle.y, actualParticle.radius);
                    gradient.addColorStop(1, actualParticle.color);
                    context.fillStyle = gradient;
                    context.arc(actualParticle.x, actualParticle.y, actualParticle.radius, Math.PI * 2, false);
                    context.fill();                    
                    actualParticle.x += -1 * Math.floor(Math.random() * 2) * (actualPipe?.bombasOn ?? 1) ;
                    actualParticle.y += -0.33 * (particleIndex % 2 == 0 ? actualParticle.velocity_y + 1 : actualParticle.velocity_y - 1) * (actualPipe?.bombasOn ?? 1) ;

                    let desborde = actualParticle.radius;
                    if (actualParticle.x < desborde) actualParticle.x = characteristicsWaterCanvas._Width - desborde;
                    if (actualParticle.y < desborde) actualParticle.y = characteristicsWaterCanvas._Height - desborde;
                    if (actualParticle.x > characteristicsWaterCanvas._Width - desborde) actualParticle.x =  desborde;
                    if (actualParticle.y > characteristicsWaterCanvas._Height - desborde) actualParticle.y = desborde;
                }
            }
        }
    };

    Render = function () {
        window.requestAnimationFrame(() => { this.Render() });
        this.drawWaterCanvasByGravity();
    };

    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    SetAnimationFrame = function () {
        window.requestAnimationFrame = this.requestAnimationFrame;
    };
};