import { Estacion } from "../Entities/Estacion.js";
import { formatearFecha, obtenerUnidad } from "../Utility/utils.js";

/**
 * Crea un nodo HTML representando una variable a partir de una señal
 * @param {Object} signal
 * @returns {HTMLElement}
 */
function crearVariable(signal) {
  const variable = document.createElement("div");
  variable.classList.add("variable");

  variable.innerHTML = `
    <div class="variable_icono"></div>
    <div class="variable_nombre_barra">
      <p id="nombre_variable">${signal.nombre}</p>
      <p id="unidad_variable">${obtenerUnidad(signal.tipoSignal)}</p>
    </div>
    <div class="variable_valor">${signal.valor?.toFixed?.(2) ?? "00.00"}</div>
  `;

  return variable;
}

/**
 * Asigna eventos de clic y doble clic con lógica de toggle animada
 * @param {HTMLElement} trigger
 * @param {HTMLElement} target
 */
function asignarEventosClick(trigger, target) {
  let clickTimer = null;

  trigger.addEventListener("click", () => {
    if (clickTimer !== null) return;

    clickTimer = setTimeout(() => {
      target.classList.toggle("activo");
      clickTimer = null;
    }, 250);
  });

  trigger.addEventListener("dblclick", () => {
    clearTimeout(clickTimer);
    clickTimer = null;
    console.log("Doble click en:", trigger);
  });
}

/**
 * Crea el bloque visual completo para una estación
 * @param {Estacion} estacion
 * @returns {HTMLElement}
 */
export function crearElementoDesdeEstacion(estacion) {
  const elemento = document.createElement("div");
  elemento.classList.add("lista_elemento");

  const id = estacion.IdEstacion;
  const nombre = estacion.Nombre;
  const fecha = formatearFecha(estacion.Tiempo)

  // Estructura base del elemento
  elemento.innerHTML = `
    <div class="lista_elemento_datos_principales">
      <div class="lista_elemento_button">${id}</div>
      <div class="lista_elemento_nombre_contenedor">
        <p class="lista_elemento_nombre">${nombre}</p>
        <p class="lista_elemento_fecha">${fecha}</p>
      </div>
      <div class="lista_elemento_enlaces"></div>
    </div>
    <div class="lista_elemento_datos_secundarios">
      <div class="lista_elemento_variables_climato">
        <div class="lista_elemento_vista_previa"></div>
        <div class="lista_elemento_variables"></div>
      </div>
    </div>
  `;

  // Contenedores internos
  const nombreContenedor = elemento.querySelector(
    ".lista_elemento_nombre_contenedor"
  );
  const datosSecundarios = elemento.querySelector(
    ".lista_elemento_datos_secundarios"
  );
  const variablesContenedor = elemento.querySelector(
    ".lista_elemento_variables"
  );

  // IDs de señales
  const idsVariables = [2, 20, 21, 22, 23, 24, 25];

  idsVariables.forEach((signalId) => {
    const signals = estacion.getSignals(signalId);
    if (!signals?.length) return;

    const variableNode = crearVariable(signals[0]);
    variablesContenedor.appendChild(variableNode);
  });

  asignarEventosClick(nombreContenedor, datosSecundarios);

  return elemento;
}
