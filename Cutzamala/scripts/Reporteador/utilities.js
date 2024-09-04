// Definición de la función setStyleProperty que agrega un método a prototype del objeto Element
// Este método permite establecer propiedades de estilo CSS en un elemento HTML
var setStyleProperty = (Element.prototype.setStyleProperty = function (
  cssProperty
) {
  // Obtenemos las propiedades del objeto cssProperty y las almacenamos en un array
  const properties = Object.keys(cssProperty);

  // Iteramos sobre cada propiedad del objeto cssProperty
  properties.forEach((key) => {
    // Asignamos el valor de cada propiedad al estilo CSS del elemento
    this.style[key] = cssProperty[key];
  });
});

// Definición de la función setElementProperty que aplica un conjunto de propiedades CSS a una lista de elementos
var setElementProperty = function (elementsArray, propertyObjectValues) {
  // Iteramos sobre cada elemento del array
  elementsArray.forEach((element) => {
    // Llamamos al método setStyleProperty del elemento para aplicar las propiedades CSS
    element.setStyleProperty(propertyObjectValues);
  });
};

// Exportamos las funciones setStyleProperty y setElementProperty para que puedan ser utilizadas en otros módulos
export { setStyleProperty, setElementProperty };
