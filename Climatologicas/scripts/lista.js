export function initLista() {
  animar_lista();
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
