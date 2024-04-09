import Estacion from "../Entities/Estacion.js";

class Particular {
  /**
   *
   * @param {Estacion} estacion
   */

  constructor(estacion) {
    this.estacion = estacion;
  }

  clickEventTable() {
    const $Tabla = document.querySelector(".curved-tBody");

    $Tabla.addEventListener("click", (ev) => {
      if (ev.target.nodeName == "DIV") {
        [...ev.currentTarget.children].forEach((element) => {
          element.classList.remove("tabla__active");
        });

        const actualTarget = ev.target;
        actualTarget.classList.add("tabla__active");
      }
    });
  }

  loadInfo(actualTarger) {
    // Elementos del DOM
    const $title = document.getElementById("title");
    const $date = document.getElementById("date");
    const $state = document.getElementById("state");
    
    
  }
}

export { Particular };
