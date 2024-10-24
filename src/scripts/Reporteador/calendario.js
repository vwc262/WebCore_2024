import UIReportes from "./UIReportes.js";

var fechas = {
  inicio: new Date(),
  final: new Date(),
};

function initCalendario() {
  const FechaHoy = new Date();
  // Llamar a la función para crear el calendario con el año
  crearCalendario(FechaHoy.getFullYear(), FechaHoy.getMonth() + 1);
  // Configurar eventos de clic para los botones de mes y año
  onClickEventMes();
  onClickEventYear();
  // Seleccionar automáticamente el mes actual al cargar el calendario
  seleccionarMesActual();
  // Seleccionar automáticamente el primer día del mes al cargar el calendario
  seleccionarDiaActual();
  // Agregar un event listener al contenedor de días para la delegación de eventos
  document
    .querySelector(".daysContainer")
    .addEventListener("click", onClickDay);

  onClickEventFechaSeleccionada();
}

function seleccionarPrimerDiaMes() {
  const dias = Array.from(document.querySelectorAll(".daysContainer td")); // Obtener todos los TDs de los días

  // Iterar sobre los TDs de los días
  dias.forEach((dia) => {
    if (parseInt(dia.textContent) === 1) {
      // Comprobar si el contenido del TD es igual a 1 (primer día del mes)
      dia.classList.add("diaSeleccionado"); // Agregar la clase 'diaSeleccionado' al primer día del mes
      dia.click();
    }
  });
}

function seleccionarDiaActual() {
  const diaActual = new Date().getDate(); // Obtiene el día actual
  const diasTD = Array.from(document.querySelectorAll(".daysContainer td")); // Obtener todos los TDs de los días
  var indice = 0;

  diasTD.forEach((dia) => {
    indice = dia.classList.contains("empty") ? indice : indice + 1;
    indice === diaActual
      ? dia.classList.add("diaSeleccionado")
      : dia.classList.remove("diaSeleccionado");
  });
}

function seleccionarMesActual() {
  const meses = Array.from(document.querySelectorAll(".mes")); // Obtener todos los botones de mes
  const mesActual = new Date().getMonth(); // Obtener el mes actual (0-11)

  // Iterar sobre los botones de mes
  meses.forEach((mes, index) => {
    if (index === mesActual) {
      // Si es el mes actual, agregar la clase 'mesSeleccionado'
      mes.classList.add("mesSeleccionado");
    }
  });
}

function crearCalendario(año, mes) {
  const daysContainer = document.querySelector(".daysContainer"); // Obtener el contenedor de días del calendario

  // Crear la tabla del calendario
  const table = document.createElement("table");

  // Crear el encabezado de la tabla (días de la semana)
  const thead = document.createElement("thead");
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"]; // Array de los días de la semana
  const tr = document.createElement("tr");
  tr.style.color = "white";
  // Crear los elementos <th> para cada día de la semana y agregarlos al encabezado de la tabla
  daysOfWeek.forEach((day) => {
    const th = document.createElement("th");
    th.classList = "thDaysOfWeek";
    th.textContent = day;
    tr.appendChild(th);
  });
  thead.appendChild(tr); // Agregar el encabezado de la tabla al elemento <thead>
  table.appendChild(thead); // Agregar el encabezado al elemento <table>

  // Crear el cuerpo de la tabla (días del mes)
  const tbody = document.createElement("tbody");
  tbody.setAttribute("class", "tbodyTabla");
  // Obtener el número de días en el mes
  const numeroDias = new Date(año, mes, 0).getDate();

  // Obtener el día de la semana en el que comienza el mes
  const primerDiaSemana = new Date(año, mes - 1, 1).getDay();

  let fila = document.createElement("tr"); // Crear una fila para los días

  // Total cuadricula
  const numCuadricula = 49;

  // llenar los dias en la tabla
  for (let i = 0; i <= numCuadricula; i++) {
    const td = document.createElement("td");
    if (i % 7 == 0) {
      fila = document.createElement("tr");
      tbody.appendChild(fila);
    }
    if (i >= primerDiaSemana && i - primerDiaSemana < numeroDias) {
      td.textContent = i - primerDiaSemana + 1;
    } else {
      td.classList.add("empty");
    }
    fila.appendChild(td);
  }

  // Agregar el cuerpo de la tabla al elemento <table>
  table.appendChild(tbody);

  // Agregar la tabla al contenedor de días del calendario
  daysContainer.appendChild(table);

  function setFechasIniciales() {
    const fechaInicial = document.querySelector("#btnInitDate");
    const fechaFinal = document.querySelector("#btnEndDate");
    var fechaHoy = new Date();
    var anio = fechaHoy.getFullYear();
    var mes = fechaHoy.getMonth();
    var dia = fechaHoy.getDate();
    fechaHoy.setHours(0);
    fechaHoy.setMinutes(0);
    fechaHoy.setSeconds(0);
    fechaHoy.setMilliseconds(0);

    const fechaCompleta = `${fechaHoy.getDate()}/${capitalizeFirstLetter(
      fechaHoy.toLocaleString("default", { month: "short" })
    )}/${fechaHoy.getFullYear()}`;

    fechaInicial.innerHTML = `<label style="color:goldenrod; cursor: pointer;">Fecha inicial : </label> ${fechaCompleta}`;

    fechaFinal.innerHTML = `<label style="color:goldenrod; cursor: pointer;">Fecha final : </label> ${fechaCompleta}`;

    UIReportes.fechaInicial = fechas.inicio;
    UIReportes.fechaFinal = new Date(anio, mes, dia, 23, 59, 59);
  }

  setFechasIniciales();
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function onClickEventMes() {
  const meses = Array.from(document.querySelectorAll(".mes")); // Convertir los botones de mes en un array
  const spanYear = document.querySelector(".spanYear"); // Obtener el elemento span que muestra el año

  // Iterar sobre los botones de mes
  meses.forEach((mes, index) => {
    // Agregar un evento de clic a cada botón de mes
    mes.addEventListener("click", function () {
      // Remover la clase "mesSeleccionado" de todos los meses
      meses.forEach((mes) => mes.classList.remove("mesSeleccionado"));

      // Agregar la clase "mesSeleccionado" al mes seleccionado
      this.classList.add("mesSeleccionado");

      const mesSeleccionado = this.id; // Obtener el ID del mes seleccionado
      const añoActual = new Date(
        parseInt(spanYear.innerText),
        index + 1,
        1
      ).getFullYear(); // Obtener el año actual como entero

      // Limpiar y actualizar la tabla con los días del nuevo año
      limpiarYActualizarTabla(añoActual, index);

      // Restaurar la fecha seleccionada después de actualizar el calendario
      if (fechas.inicio && fechas.inicio.getMonth() === index) {
        restaurarFechaSeleccionada(fechas.inicio, "inicio");
      }
      if (fechas.final && fechas.final.getMonth() === index) {
        restaurarFechaSeleccionada(fechas.final, "final");
      }
    });
  });
}

function onClickEventYear() {
  const spanYear = document.getElementById("spanYear"); // Obtener el elemento span que muestra el año
  const btnAnioAnterior = document.querySelector(
    ".yearBtnsContainer button:first-child"
  ); // Botón para el año anterior
  const btnAñoSiguiente = document.querySelector(
    ".yearBtnsContainer button:last-child"
  ); // Botón para el año siguiente

  let añoActual = new Date().getFullYear(); // Obtener el año actual como entero

  // Evento de clic para el botón del año anterior
  btnAnioAnterior.addEventListener("click", function () {
    const ultimoMesSeleccionado = document.querySelector(".mesSeleccionado");
    const mesParseado = parseInt(ultimoMesSeleccionado.getAttribute("mesId"));

    //console.log(mesParseado);
    añoActual--; // Decrementar el año actual
    spanYear.textContent = añoActual; // Actualizar el año mostrado en el calendario
    // Limpiar y actualizar la tabla con los días del nuevo año
    limpiarYActualizarTabla(añoActual, mesParseado);
  });

  // Evento de clic para el botón del año siguiente
  btnAñoSiguiente.addEventListener("click", function () {
    const añoSiguiente = añoActual + 1; // Calcular el año siguiente
    const ultimoMesSeleccionado = document.querySelector(".mesSeleccionado");
    const mesParseado = parseInt(ultimoMesSeleccionado.getAttribute("mesId"));
    // Verificar si el año siguiente es menor o igual al año actual real
    if (añoSiguiente <= new Date().getFullYear()) {
      añoActual = añoSiguiente; // Actualizar el año actual
      spanYear.textContent = añoActual; // Actualizar el año mostrado en el calendario
      // Limpiar y actualizar la tabla con los días del nuevo año
      limpiarYActualizarTabla(añoActual, mesParseado);
    } else {
      console.log("No se puede seleccionar un año futuro");
    }
  });
}

function limpiarYActualizarTabla(anio, mes) {
  const daysContainer = document.querySelector(".daysContainer"); // Contenedor de la tabla de días

  // Guardar la fecha inicial y final seleccionada
  const fechaInicialSeleccionada = fechas.inicio;
  const fechaFinalSeleccionada = fechas.final;

  // Limpiar la tabla actual
  daysContainer.innerHTML = "";
  // Crear y actualizar la tabla con los días del nuevo año
  crearCalendario(anio, mes + 1);

  if (anio == new Date().getFullYear() && mes == new Date().getMonth()) {
    seleccionarDiaActual();
  } else {
    // Seleccionar automáticamente el primer día del mes en el nuevo año
    seleccionarPrimerDiaMes();
  }

  // Restaurar las fechas seleccionadas si existen y corresponden al mes actual
  if (fechaInicialSeleccionada) {
    restaurarFechaSeleccionada(fechaInicialSeleccionada, "inicio");
  }
  if (fechaFinalSeleccionada) {
    restaurarFechaSeleccionada(fechaFinalSeleccionada, "final");
  }
}

function restaurarFechaSeleccionada(fecha, tipo) {
  const diasTD = Array.from(document.querySelectorAll(".daysContainer td")); // Obtener todos los TDs de los días

  // Remover cualquier selección previa antes de restaurar solo si no está seleccionada otra fecha
  if (
    (tipo === "inicio" &&
      !document
        .getElementById("btnEndDate")
        .classList.contains("btnFechaSeleccionada")) ||
    (tipo === "final" &&
      !document
        .getElementById("btnInitDate")
        .classList.contains("btnFechaSeleccionada"))
  ) {
    diasTD.forEach((dia) => dia.classList.remove("diaSeleccionado"));
  }

  // Restaurar la fecha seleccionada solo si corresponde
  diasTD.forEach((dia) => {
    if (
      parseInt(dia.textContent) === fecha.getDate() &&
      !dia.classList.contains("empty")
    ) {
      dia.classList.add("diaSeleccionado");

      // Actualizar la interfaz con la fecha restaurada solo si no hay selección previa
      if (tipo === "inicio") {
        document.getElementById(
          "btnInitDate"
        ).innerHTML = `<label style="color:goldenrod; cursor: pointer;">Fecha inicial : </label> ${fecha.getDate()}/${capitalizeFirstLetter(
          fecha.toLocaleString("default", { month: "short" })
        )}/${fecha.getFullYear()}`;
      } else if (tipo === "final") {
        document.getElementById(
          "btnEndDate"
        ).innerHTML = `<label style="color:goldenrod; cursor: pointer;">Fecha final : </label> ${fecha.getDate()}/${capitalizeFirstLetter(
          fecha.toLocaleString("default", { month: "short" })
        )}/${fecha.getFullYear()}`;
      }
    }
  });
}

// Función para manejar el clic en un día del calendario
function onClickDay(event) {
  // Verificar si el elemento clicado es un TD dentro del contenedor de días
  if (
    event.target.tagName === "TD" &&
    !event.target.classList.contains("empty")
  ) {
    const dias = document.querySelectorAll(".daysContainer td"); // Obtener todos los TDs de los días

    // Remover la clase "diaSeleccionado" de todos los días
    dias.forEach((dia) => {
      dia.classList.remove("diaSeleccionado");
    });

    // Obtener el día seleccionado
    const diaSeleccionado = event.target;
    diaSeleccionado.classList.add("diaSeleccionado");

    establecerFecha(event);
  }
}

// Función para manejar el clic en un botón de fecha
function establecerFecha(event) {
  // Obtener la fecha seleccionada del calendario
  const diaSeleccionado = document.querySelector(".diaSeleccionado");
  const mesSeleccionado = document.querySelector(".mesSeleccionado");
  const añoSeleccionado = document.querySelector(".spanYear").textContent;

  // Obtener la fecha en el formato deseado (dia/mes/año)
  const fechaSeleccionada = `${diaSeleccionado.textContent}/${mesSeleccionado.id}/${añoSeleccionado}`;

  // Remover la clase "btnFechaSeleccionada" de todos los botones de fecha
  const btnInitDate = document.getElementById("btnInitDate");
  const btnEndDate = document.getElementById("btnEndDate");

  // Agregar la clase "btnFechaSeleccionada" al botón clicado
  event.currentTarget.classList.add("btnFechaSeleccionada");

  // Modificar el texto del botón dependiendo de cuál tenga la clase "btnFechaSeleccionada"
  if (btnInitDate.classList.contains("btnFechaSeleccionada")) {
    btnInitDate.innerHTML = `<label style="color:goldenrod; cursor: pointer;">Fecha inicial : </label> ${fechaSeleccionada}`;
    fechas.inicio = new Date(
      añoSeleccionado,
      mesSeleccionado.getAttribute("mesId"),
      diaSeleccionado.textContent,
      0,
      0
    );

    UIReportes.fechaInicial = fechas.inicio;
  } else if (btnEndDate.classList.contains("btnFechaSeleccionada")) {
    btnEndDate.innerHTML = `<label style="color:goldenrod; cursor: pointer;">Fecha final : </label> ${fechaSeleccionada}`;
    fechas.final = new Date(
      añoSeleccionado,
      mesSeleccionado.getAttribute("mesId"),
      diaSeleccionado.textContent,
      23,
      59
    );
    UIReportes.fechaFinal = fechas.final;
  }
}

// Función para manejar el clic en los botones de fecha inicial y final
function onClickEventFechaSeleccionada() {
  // Obtener los botones de fecha
  const btnInitDate = document.getElementById("btnInitDate");
  const btnEndDate = document.getElementById("btnEndDate");

  // Función para establecer la clase seleccionada
  function establecerClaseSeleccionada(event) {
    // Remover la clase "btnFechaSeleccionada" de todos los botones de fecha
    btnInitDate.classList.remove("btnFechaSeleccionada");
    btnEndDate.classList.remove("btnFechaSeleccionada");

    // Agregar la clase "btnFechaSeleccionada" al botón clicado
    event.currentTarget.classList.add("btnFechaSeleccionada");
  }

  // Agregar event listener a los botones de fecha
  btnInitDate.addEventListener("click", establecerClaseSeleccionada);
  btnEndDate.addEventListener("click", establecerClaseSeleccionada);
}

export default initCalendario;
