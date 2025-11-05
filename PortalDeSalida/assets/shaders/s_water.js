// Código GLSL (guárdalo en variables de texto)
export const water_vertexShader = `
    precision highp float;
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;
    uniform mat4 worldViewProjection;
    uniform float time;
    varying vec2 vUV;
    varying vec3 vNormal;
    void main() {
        vUV = uv;
        vNormal = normal;
        vec3 p = position;
        p.y += sin(time + position.x * 5.0) * 0.1; // Ondulación en Y
        p.x += sin(time + position.x * 5.0) * 0.1; // Ondulación en Y
        p.z += sin(time + position.x * 5.0) * 0.1; // Ondulación en Y
        gl_Position = worldViewProjection * vec4(p, 1.0);
    }
`;

export const water_fragmentShader = `
    precision highp float;
    varying vec2 vUV;
    varying vec3 vNormal;
    uniform float time;
    uniform sampler2D reflectionTexture;
    void main() {
        vec3 lightDir = normalize(vec3(0.5, 1.0, 0.5));
        float diffuse = max(dot(vNormal, lightDir), 0.0);
        vec3 color = mix(vec3(0.0, 0.3, 0.8), vec3(0.0, 0.1, 0.5), diffuse);
        gl_FragColor = vec4(color, 0.8);
    }
`;