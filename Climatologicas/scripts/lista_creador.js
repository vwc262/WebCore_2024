export function crearElementoDesdeEstacion(estacion) {
  const elemento = document.createElement("div");
  elemento.classList.add("lista_elemento");

  const id = estacion.IdEstacion;
  const nombre = estacion.Nombre;
  const fecha = "00/00/0000, 00:00 hrs";

  elemento.innerHTML = `
    <div class="lista_elemento_datos_principales">
      <div class="lista_elemento_button">${id}</div>
      <div class="lista_elemento_nombre_contenedor">
        <p class="lista_elemento_nombre">${nombre}</p>
        <p class="lista_elemento_fecha">${fecha}</p>
      </div>
      <div class="lista_elemento_enlaces"></div>
    </div>
    <div class="lista_elemento_datos_secundarios"></div>
  `;

  // Agregar eventos aquí
  const nombreContenedor = elemento.querySelector(
    ".lista_elemento_nombre_contenedor"
  );
  const datosSecundarios = elemento.querySelector(
    ".lista_elemento_datos_secundarios"
  );

  let clickTimer = null;

  nombreContenedor.addEventListener("click", () => {
    if (clickTimer !== null) return;

    clickTimer = setTimeout(() => {
      datosSecundarios.classList.toggle("activo");
      console.log("Click simple en:", nombre);
      clickTimer = null;
    }, 250);
  });

  nombreContenedor.addEventListener("dblclick", () => {
    clearTimeout(clickTimer);
    clickTimer = null;
    console.log("Doble click en:", nombre);
  });

  return elemento;
}
