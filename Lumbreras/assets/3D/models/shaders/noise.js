export const noise_vertexSource = `
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
export const noise_fragmentSource = `
            precision highp float;
            varying vec2 vUV;
            uniform sampler2D diffuseTexture;
            uniform sampler2D noiseTexture;
            uniform float noiseIntensity;
            uniform float noiseScale;
            
            void main() {
                vec4 color = texture2D(diffuseTexture, vUV);
                vec4 noise = texture2D(noiseTexture, vUV * noiseScale);
                
                // Mezcla multiplicativa (preserva luces/sombras)
                vec3 finalColor = color.rgb * (noise.r * noiseIntensity);
                
                gl_FragColor = vec4(finalColor, color.a);
            }
        `;