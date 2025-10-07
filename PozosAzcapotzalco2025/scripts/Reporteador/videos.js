const controladorVideo = {
  videoInicio: null,
  // Método para inicializar el video
  initVideo(url, callback) {
    // Seleccionar el elemento de video con la clase ".videoInicio"
    this.videoInicio = document.querySelector(".videoInicio");
    // Establecer la fuente del video como la URL proporcionada
    this.videoInicio.setAttribute("src", url);

    // Agregar event listener para el evento "loadedmetadata"
    this.videoInicio.addEventListener("loadedmetadata", this.loadVideo);

    // Agregar event listener para el evento "ended"
    this.videoInicio.addEventListener("ended", this.ended);
    this.videoInicio.callback = callback;
  },

  // Método para cargar el video
  loadVideo() {
    // Verificar si el video está listo para reproducirse
    if (controladorVideo.videoInicio.readyState === 4) {
      // Reproducir el video
      controladorVideo.videoInicio.play();
    }
  },

  ended: function (e) {
    controladorVideo.endVideo(e, e.currentTarget.callback);
  },

  // Método para manejar el evento de fin de video
  endVideo(ev, callback) {
    // Remover event listeners para evitar fugas de memoria
    this.videoInicio.removeEventListener("loadedmetadata", this.loadVideo);
    this.videoInicio.removeEventListener("ended", this.ended);

    // Llamar a la función de callback proporcionada
    callback();
  },
};

// Exportar el objeto controladorVideo para ser utilizado en otros módulos
export default controladorVideo;
