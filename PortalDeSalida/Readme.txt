Pasos para usar http-server en VS Code:
1. Instalar http-server (si no lo tienes)
Abre la terminal integrada de VS Code (Ctrl + ù o Terminal > New Terminal) y ejecuta:

bash
npm install -g http-server


(Requiere Node.js instalado. Si no lo tienes, descárgalo).

2. Iniciar el servidor desde tu proyecto
En la terminal de VS Code, navega a la carpeta raíz de tu proyecto (donde está tu index.html) y ejecuta:

bash
http-server --cors --mimetype .glb=model/gltf-binary
Flags importantes:

--cors: Permite solicitudes entre dominios (necesario para cargar recursos como modelos 3D).

--mimetype .glb=model/gltf-binary: Configura el tipo MIME correcto para archivos .glb.

3. Abrir el proyecto en el navegador
Verás URLs como estas en la terminal:

Available on:
  http://localhost:8080
  http://192.168.x.x:8080
Abre http://localhost:8080 en tu navegador. Tu modelo 3D debería cargarse sin errores.