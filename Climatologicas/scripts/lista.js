import { GlobalData } from "./Global/GlobalData.js";

export function initLista() {
  animar_lista();
  // manejarClickElemento();
}

function manejarClickElemento() {
  const elementos = document.querySelectorAll(
    ".lista_elemento_nombre_contenedor"
  );

  elementos.forEach((elemento) => {
    let clickTimer = null;

    elemento.addEventListener("click", (e) => {
      if (clickTimer !== null) return;

      const target = e.currentTarget;
      const contenedor = target.closest(".lista_elemento");
      const detalle = contenedor.querySelector(
        ".lista_elemento_datos_secundarios"
      );

      clickTimer = setTimeout(() => {
        detalle.classList.toggle("activo");
        console.log("Click simple en:", target);
        console.log(GlobalData.Instance.getEstaciones());
        clickTimer = null;
      }, 250);
    });

    elemento.addEventListener("dblclick", (e) => {
      clearTimeout(clickTimer);
      clickTimer = null;
      console.log("Doble click en:", e.currentTarget);
    });
  });
}

function animar_lista() {
  const boton = document.getElementById("lista_button");
  const lista = document.querySelector(".lista_contenedor");

  let visible = true;

  boton.addEventListener("click", toggleLista);

  function toggleLista() {
    visible = !visible;
    actualizarEstadoLista();
  }

  function actualizarEstadoLista() {
    lista.classList.toggle("oculta", !visible);
    boton.classList.toggle("mover-boton", !visible);
    boton.textContent = visible ? "<" : ">";
  }
}
