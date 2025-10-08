HTMLElement.prototype.SetMultipleAttributes = function (attributes) {
  for (const [key, value] of Object.entries(attributes))
    this.setAttribute(key, value);
  return this;
};

/**
 * @param {{ nodeElement : keyof HTMLElementTagNameMap, attributes : {}, innerText: string ,events : Map<string,[Function]> }} params
 * @returns
 */
export const CreateElement = function ({
  nodeElement,
  attributes = {},
  innerText = "",
  events = new Map(),
  innerHTML = undefined,
}) {
  const createdElement = document.createElement(nodeElement);
  createdElement.SetMultipleAttributes(attributes);

  if (innerHTML != undefined) {
    createdElement.innerHTML = innerHTML;
  } else {
    createdElement.innerText = innerText ?? "";
  }

  for (const [key, functions] of events.entries()) {
    functions.forEach((fnEv) => {
      createdElement.addEventListener(key, fnEv);
    });
  }
  return createdElement;
};

/**
 *
 * @param {String} titulo
 */
export const ObtenerFormatoTituloProyecto = function (titulo) {
  if(titulo == 'PlantasPotabilizadoras')
    titulo = 'Sistema Cutzamala';
  else if(titulo == 'Lerma')
    titulo = 'Pozos Sistema Lerma';
  else
    titulo = titulo.replace(/([A-Z])/g, " $1").trim();

  return titulo;
};

export const AdjustSize = function () {
  if(/Android/i.test(navigator.userAgent) || navigator.userAgent.includes("Windows")){
   ajustador(); 
  }  
};

const ajustador = () => {
  const contentWidth = 1920;
  const contentHeight = 1080;

  let currentScreenWidth = window.innerWidth;
  let currentScreenHeight = window.innerHeight;

  let widthScale = (currentScreenWidth / contentWidth).toFixed(3);
  let heightScale = (currentScreenHeight / contentHeight).toFixed(3);

  let body = document.getElementsByTagName("body")[0];

  if (widthScale > heightScale) {
    let margin = (currentScreenWidth - contentWidth * heightScale) / 2;
    body.style = `transform: scale(${heightScale}); margin: 0px 0px 0px ${margin}px; transform-origin: left top; width: 1920px; height: 1080px;`;
  } else {
    body.style = `transform: scale(${widthScale}); margin: 0px 0px 0px 0px; transform-origin: left top; width: 1920px; height: 1080px;`;
  }
}

export const ArmarFechaSQL = function (datetime, isInicio) {
  //2024/05/14 00:00
  const year = datetime.getFullYear();
  const month = datetime.getMonth() + 1;
  const day = datetime.getDate();
  return `${year}/${month.toString().padStart(2, "0")}/${day.toString().padStart(2, "0")} ${isInicio ? "00:00" : "23:59"}`;

}

/**
 * Restringe un valor a un rango dado
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns
 */
export const Clamp = (val, min, max) => Math.min(Math.max(val, min), max);
