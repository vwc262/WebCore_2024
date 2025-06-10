// Shader vertex
export const franja_vertexShader = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 worldViewProjection;

varying vec2 vUV;

void main(void) {
    gl_Position = worldViewProjection * vec4(position, 1.0);
    vUV = uv;
}
`;

// Shader fragment
export const franja_fragmentShader = `
precision highp float;

varying vec2 vUV;

uniform float stripeWidth;
uniform vec3 stripeColor;      // Color de las franjas
uniform vec3 backgroundColor;  // Nuevo: Color de fondo
uniform float speed;
uniform vec2 direction;
uniform float time;

void main(void) {
    // Calcular el desplazamiento
    vec2 offset = direction * time * speed;
    
    // Crear el patrón de franjas
    float pattern = mod(vUV.x * direction.x + vUV.y * direction.y + offset.x + offset.y, 1.0);
    
    // Determinar si estamos en una franja
    float stripe = step(pattern, stripeWidth);
    
    // Mezclar entre color de fondo y color de franja
    vec3 color = mix(backgroundColor, stripeColor, stripe);
    
    gl_FragColor = vec4(color, 1.0);
}
`;