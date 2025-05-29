/**
 * Convierte una fecha ISO a formato dd/mm/aaaa, hh:mm hrs.
 * @param {string} fechaISO
 * @returns {string}
 */
export function formatearFecha(fechaISO) {
  if (!fechaISO) return "00/00/0000, 00:00 hrs";

  const fecha = new Date(fechaISO);

  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();

  const hora = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${anio}, ${hora}:${minutos} hrs`;
}

/**
 * Devuelve la unidad formateada en corchetes según el tipoSignal de una señal.
 * @param {Object} signal - Objeto que contiene la propiedad `tipoSignal`
 * @returns {string}
 */
export function obtenerUnidad(signal) {
  const unidades = {
    1: "m",
    2: "hPa",
    3: "l/s",
    4: "m³",
    6: "",
    7: "",
    10: "V",
    12: "",
    14: "",
    15: "",
    16: "V",
    17: "A",
    18: "W",
    19: "%",
    20: "mm",
    21: "°C",
    22: "%",
    23: "W/m²",
    24: "km/h",
    25: "°N",
  };

  const unidad = unidades[signal] ?? "";
  return `[${unidad}]`;
}
