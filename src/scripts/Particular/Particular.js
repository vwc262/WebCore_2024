import Estacion from "../Entities/Estacion.js";
import { Core } from "../Core.js";

class Particular {
  constructor(estacion) {
    this.estacion = estacion;
  }

  mostrarDetalles() {
    // Elementos del DOM
    //console.log("Detalles de la estación:", this.estacion.Signals);
    this.$headerTitle = document.querySelector("#title");
    this.$headerDate = document.querySelector("#date");
    this.$headerStatus = document.querySelector("#state");
    this.$particularImg = document.querySelector("#particularImg");

    this.$headerTitle.innerText = this.estacion.Nombre;

    // Cambiar el texto de acuerdo al estado de la estación
    if (this.estacion.Enlace == "0") {
      this.$headerStatus.innerText = "Fuera de línea";
      this.$headerStatus.style.color = "red";
    } else {
      this.$headerStatus.innerText = "En línea";
      this.$headerStatus.style.color = "green";
    }

    // Obtener la fecha y formatearla
    const fecha = new Date(this.estacion.Tiempo);
    const options = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    const fechaFormateada = fecha.toLocaleDateString("es-ES", options);

    // Asignar la fecha formateada al elemento HTML
    this.$headerDate.innerText = fechaFormateada;

    // Construir la URL de la imagen particular
    const sitioAbrev = this.estacion.Abreviacion;
    const urlImgParticular = `http://w1.doomdns.com:11002/RecursosWeb/WebCore24/TanquesPadierna/Sitios/${sitioAbrev}/Particular/fondo.jpg?v=10`;

    // Asignar la URL de la imagen al atributo src del elemento de imagen
    this.$particularImg.src = urlImgParticular;

    // Crear señales
    this.createSignals();

    // Funconalidad del slider para recorrer las señales
    this.slider();

    // Funcionalidad para mostrar el panel de control
    this.panelControl();
  }

  createSignals() {
    this.$signalsContainer = document.querySelector(
      ".particular__ItemsContainer"
    );
    this.$signalsContainer.innerHTML = "";

    this.estacion.Signals.forEach((signal) => {
      const signalItem = document.createElement("div");
      signalItem.classList.add("particular__item");

      const etiquetaNombre = document.createElement("div");
      etiquetaNombre.classList.add("etiqueta__Nombre");
      etiquetaNombre.textContent = signal.Nombre;

      const etiquetaValor = document.createElement("div");
      etiquetaValor.classList.add("etiqueta__Valor");
      etiquetaValor.textContent = signal.Valor;

      const etiquetaUnidad = document.createElement("div");
      etiquetaUnidad.classList.add("etiqueta__Unidad");
      etiquetaUnidad.textContent = "m";

      signalItem.appendChild(etiquetaNombre);
      signalItem.appendChild(etiquetaValor);
      signalItem.appendChild(etiquetaUnidad);

      this.$signalsContainer.appendChild(signalItem);
    });
  }

  slider() {
    const container = document.querySelector(".particular__ItemsContainer");
    const sliderInput = document.querySelector("#sliderInput");

    // Comprobar si hay más de 10 elementos en el contenedor
    const itemsCount = container.querySelectorAll(".particular__item").length;
    if (itemsCount > 10) {
      // Mostrar el control deslizante
      document.querySelector(".particular__slider").style.display = "flex";
    } else {
      // Ocultar el control deslizante
      document.querySelector(".particular__slider").style.display = "none";
    }

    // Si el control deslizante está visible, actualizar la lógica de desplazamiento
    if (
      document.querySelector(".particular__slider").style.display !== "none"
    ) {
      sliderInput.addEventListener("input", () => {
        const currentValue = parseFloat(sliderInput.value);
        const containerWidth = container.offsetWidth;
        const scrollWidth = container.scrollWidth;
        const maxScrollLeft = scrollWidth - containerWidth;
        const scrollLeft = (maxScrollLeft * currentValue) / sliderInput.max;

        container.scrollLeft = scrollLeft;
      });
    }
  }

  panelControl() {
    const signals = this.estacion.Signals;
    const tipoSignal7Count = signals.filter(
      (signal) => signal.TipoSignal === 7
    ).length;
    const panelControlElement = document.querySelector(
      ".particular__panelControl"
    );

    if (tipoSignal7Count >= 1) {
      panelControlElement.style.display = "flex"; // Mostrar el panel de control
    } else {
      panelControlElement.style.display = "none"; // Ocultar el panel de control
    }
  }
}

export { Particular };
