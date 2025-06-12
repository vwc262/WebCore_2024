export const fire_vertexShader = `
    precision highp float;
    attribute vec3 position;
    attribute vec2 uv;
    uniform mat4 worldViewProjection;
    varying vec2 vUV;

    void main() {
        vUV = uv;
        gl_Position = worldViewProjection * vec4(position, 1.0);
    }
`;

export const fire_fragmentShader = `
    precision highp float;
    varying vec2 vUV;
    uniform float time;
    
    // Función de ruido para las llamas
    float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
        vec2 uv = vUV;
        uv.y -= time * 0.5; // Movimiento ascendente de las llamas
        
        // Distorsión basada en ruido
        float distortion = noise(uv * 10.0) * 0.1;
        uv.x += distortion;
        
        // Color del fuego (gradiente de rojo a amarillo)
        vec3 fireColor = mix(
            vec3(1.0, 0.3, 0.0),  // Rojo
            vec3(1.0, 0.8, 0.0),  // Amarillo
            uv.y                   // Gradiente vertical
        );
        
        // Alpha basada en la posición Y (más transparente arriba)
        float alpha = smoothstep(0.0, 0.5, uv.y);
        
        gl_FragColor = vec4(fireColor, alpha);
    }
`;