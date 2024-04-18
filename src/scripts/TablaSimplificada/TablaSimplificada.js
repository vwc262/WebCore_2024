import { Core } from "../TablaSimplificada/Core.js";
import {
  EnumEnlace,
  EnumProyecto,
  EnumTipoSignal,
  EnumTipoSignalNomenclatura,
} from "../Utilities/Enums.js";

var EnumTipoFiltro = {
  enlace: "enlace",
  ordinal: "ordinal",
  nombre: "nombre",
  nivel: "nivel",
  presion: "presion",
  bomba: "bomba",
  tiempo: "tiempo",
  tipoEnlace: "tipoEnlace",
};

class TablaSimplificada {
  enumTipoFiltro = EnumTipoFiltro.nombre;
  constructor() {
    this.DATOS__AUX = Core.Instance.data;
    this.InitFiltros();
    setInterval(() => {
      this.Update();
    }, 10000);
  }

  Update = () => {
    this.create();
    this.Filtrar();
  };

  async create() {
    this.CrearTabla();
  }

  CrearTabla() {
    this.$tbody = document.getElementById("tbody");
    this.$sitiosOnline = document.getElementById("online");
    this.$sitiosOffline = document.getElementById("offline");
    this.$sitioRadio = document.querySelector("#sitioRadio");
    this.$sitioCelular = document.querySelector("#sitioCelular");
    this.$sitioRC = document.querySelector("#sitioRC");

    let totalOnline = 0;
    let totalOffline = 0;

    let SitiosRadio = 0;
    let SitiosCelular = 0;
    let SitiosHibridos = 0;

    this.$tbody.innerHTML = "";

    this.DATOS__AUX.forEach((ROW) => {
      //console.log(ROW);

      // Crear un objeto con los campos deseados
      const filteredRow = {
        Enlace: ROW.enlace,
        IdEstacion: ROW.idEstacion,
        Nombre: ROW.abreviacion,
        Signals: ROW.signals,
        Tiempo: ROW.tiempo,
        Enlace: ROW.enlace,
      };

      this.NEW__ROW = document.createElement("tr");

      // Itera sobre cada valor en el objeto de Row
      Object.entries(filteredRow).forEach(([key, value]) => {
        // Crea un nuevo elemento del tipo <td>
        this.NEW__CELL = document.createElement("td");

        // Asigna el valor del contenido del <td> después de la validación
        this.NEW__CELL.textContent = this.ValidarPresion(key, value);

        // Validar y dar formato al valor si es la fecha
        if (key === "Tiempo") {
          this.NEW__CELL.classList.add("time");
          value = this.FormatearFecha(value);
          this.NEW__CELL.textContent = value;
        }

        if (key === "Nombre") {
          this.NEW__CELL.style.fontWeight = "bold";
          this.NEW__CELL.style.textTransform = "uppercase";
        }

        if (key === "Signals") {
          const niveles = ROW.signals.filter(
            (nivel) => nivel.tipoSignal == EnumTipoSignal.Nivel
          );
          const presiones = ROW.signals.filter(
            (presion) => presion.tipoSignal == EnumTipoSignal.Presion
          );
          const bombas = ROW.signals.filter(
            (bba) => bba.tipoSignal == EnumTipoSignal.Bomba
          );

          if (niveles.length > 0) {
            // Añade el <td> al <tr>
            this.NEW__CELL.innerText = `${
              EnumTipoSignalNomenclatura[niveles[0].tipoSignal]
            }${niveles[0].ordinal + 1}: ${this.FormatearGasto(
              niveles[0].valor
            )}`;
            this.NEW__ROW.appendChild(this.NEW__CELL);
          } else {
            this.NEW__CELL.innerText = "---";
            this.NEW__ROW.appendChild(this.NEW__CELL);
          }

          this.NEW__CELL = document.createElement("td");

          if (presiones.length > 0) {
            // Añade el <td> al <tr>
            this.NEW__CELL.innerText = `${
              EnumTipoSignalNomenclatura[presiones[0].tipoSignal]
            }${presiones[0].ordinal + 1} : ${this.ValidarPresion(
              "ValorPresion",
              presiones[0].valor
            )} `;
            this.NEW__ROW.appendChild(this.NEW__CELL);
          } else {
            this.NEW__CELL.innerText = "---";
            this.NEW__ROW.appendChild(this.NEW__CELL);
          }

          this.NEW__CELL = document.createElement("td");

          if (bombas.length > 0) {
            bombas.forEach((bba) => {
              this.$imgBBA = document.createElement("img");
              this.$imgBBA.classList.add("valor-Bomba");
              switch (bba.valor) {
                case 0:
                  this.$imgBBA.setAttribute("src", "../imgs/b_g_s.png");
                  break;
                case 1:
                  this.$imgBBA.setAttribute("src", "../imgs/b_g_g.png");
                  break;
                case 2:
                  this.$imgBBA.setAttribute("src", "../imgs/b_g_r.png");
                  break;
                case 3:
                  this.$imgBBA.setAttribute("src", "../imgs/b_g_b.png");
                  break;
              }
              this.NEW__CELL.appendChild(this.$imgBBA);
            });
          } else {
            this.NEW__CELL.innerText = "---";
            this.NEW__CELL.style.height = "20px";
            this.NEW__ROW.appendChild(this.NEW__CELL);
          }
        }

        // Agregar clase según la clave y valor
        this.addClassBombaYEnlace(this.NEW__CELL, key, value);

        // Añade el <td> al <tr>
        this.NEW__ROW.appendChild(this.NEW__CELL);
      });

      // Crear una nueva celda <td> para el campo de Enlace
      this.enlaceCell = document.createElement("td");

      // Pintar el texto basado en los valores del enlace
      switch (ROW.enlace) {
        case 0:
          this.enlaceCell.textContent = "Fuera de Linea";
          break;
        case 1:
          this.enlaceCell.textContent = "Radio";
          break;
        case 2:
          this.enlaceCell.textContent = "Celular";
          break;
        case 3:
          this.enlaceCell.textContent = "Radio / Celular";
          break;
        default:
          this.enlaceCell.textContent = ROW.enlace;
          break;
      }

      // Añadir la nueva celda al <tr>
      this.NEW__ROW.appendChild(this.enlaceCell);

      if (ROW.enlace === EnumEnlace.FueraLinea) {
        totalOffline++;
      } else {
        totalOnline++;
      }

      if (ROW.enlace === EnumEnlace.Celular) {
        SitiosCelular++;
        this.$sitioCelular.innerText = `En línea por celular: ${SitiosCelular}`;
      }
      if (ROW.enlace === EnumEnlace.Radio) {
        SitiosRadio++;
        this.$sitioRadio.innerText = `En línea por radio: ${SitiosRadio}`;
      }
      if (ROW.enlace === EnumEnlace.Hibrido) {
        SitiosHibridos++;
        this.$sitioRC.innerText = `En línea por radio / celular: ${SitiosHibridos}`;
      }

      this.$tbody.append(this.NEW__ROW);
    });
    this.$sitiosOnline.textContent = totalOnline.toString();
    this.$sitiosOffline.textContent = Core.Instance.data.length;
  }

  FormatearFecha(value) {
    this.date = new Date(value);
    this.Opciones = {
      year: "2-digit", //numeric
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      seccond: "2-digit",
      // hour12: true,
    };
    return this.date.toLocaleDateString("es-MX", this.Opciones);
  }

  FormatearGasto(value) {
    if (!isNaN(value)) {
      return parseFloat(value);
    }
    return value;
  }

  ValidarPresion(key, value) {
    if ((key === "ValorPresion" || key === "ValorGasto") && value == -99) {
      return "---";
    }
    return value;
  }

  FormatearPresion(value) {
    if (!isNaN(value)) {
      return parseFloat(value).toFixed(2);
    }
    return value;
  }

  addClassBombaYEnlace(element, key, value) {
    switch (key) {
      case "Enlace":
        element.textContent = "";
        this.NEW__DIV = document.createElement("div");
        if (value === 1 || value === 3 || value === 2) {
          this.NEW__DIV.classList.add("enlace-activo");
          element.appendChild(this.NEW__DIV);
        } else if (value === 0) {
          this.NEW__DIV.classList.add("enlace-inactivo");
          element.appendChild(this.NEW__DIV);
        }
        break;

      case "ValorBomba":
        if (value >= 0 && value <= 3) {
          element.classList.add(`valor-Bomba`);
          element.textContent = "";
          const newDiv = document.createElement("div");
          switch (value) {
            case 0:
              element.appendChild(newDiv);
              newDiv.classList.add("valor-Bomba");
              newDiv.style.background =
                "url('../tablasimplificada/assets/b_g_s.png')";
              break;
            case 1:
              element.appendChild(newDiv);
              newDiv.classList.add("valor-Bomba");
              newDiv.style.background =
                "url('../tablasimplificada/assets/b_g_g.png')";
              break;
            case 2:
              element.appendChild(newDiv);
              newDiv.classList.add("valor-Bomba");
              newDiv.style.background =
                "url('../tablasimplificada/assets/b_g_r.png')";
              break;
            case 3:
              element.appendChild(newDiv);
              newDiv.classList.add("valor-Bomba");
              newDiv.style.background =
                "url('../tablasimplificada/assets/b_g_b.png')";
              break;
            default:
              break;
          }
        } else if (value === -9) {
          const newDiv = document.createElement("div");
          element.appendChild(newDiv);
          element.textContent = "---";
          element.style.height = "20px";
        }
        break;
      default:
        break;
    }
  }

  InitFiltros() {
    this.$thead_tr = document.querySelector("#tr_header");

    this.$thead_tr.addEventListener("click", (ev) => {
      if (ev.target.nodeName == "TH") {
        [...ev.currentTarget.children].forEach((element) => {
          element.classList.remove("filtro__active");
        });

        this.ACTUAL__TARGET = ev.target;
        this.ACTUAL__TARGET.classList.add("filtro__active");
        this.enumTipoFiltro = EnumTipoFiltro[this.ACTUAL__TARGET.id];
        this.Filtrar();
      }
    });
  }

  Filtrar() {
    this.DATOS__AUX = [...Core.Instance.data];
    this.SignalsFiltro = [];
    this.SinSignals = [];
    this.$tbody = document.querySelector("#tbody");

    this.$tbody.innerHTML = "";

    switch (this.enumTipoFiltro) {
      case EnumTipoFiltro.enlace:
        this.DATOS__AUX.sort((b, a) => a.enlace - b.enlace);
        break;
      case EnumTipoFiltro.ordinal:
        this.DATOS__AUX.sort((b, a) => b.idEstacion - a.idEstacion);
        break;
      case EnumTipoFiltro.nombre:
        this.DATOS__AUX.sort((a, b) =>
          this.CompareNamesWithNumbers(a.nombre, b.nombre)
        );
        break;
      case EnumTipoFiltro.nivel:
        this.FiltrarSignals(EnumTipoSignal.Nivel);
        break;
      case EnumTipoFiltro.presion:
        this.FiltrarSignals(EnumTipoSignal.Presion);
        break;
      case EnumTipoFiltro.bomba:
        this.FiltrarSignals(EnumTipoSignal.Bomba);
        break;
      case EnumTipoFiltro.tiempo:
        this.DATOS__AUX.sort((a, b) => new Date(a.tiempo) - new Date(b.tiempo));
        break;
      case EnumTipoFiltro.tipoEnlace:
        this.DATOS__AUX.sort((b, a) => a.enlace - b.enlace);
        break;
    }
    this.create();
  }

  FiltrarSignals(TipoSignal) {
    this.DATOS__AUX.forEach((estacion) => {
      const signalsNivel = estacion.signals.filter(
        (signal) => signal.tipoSignal == TipoSignal
      );
      if (signalsNivel.length > 0) this.SignalsFiltro.push(signalsNivel[0]);
      else this.SinSignals.push(estacion);
    });

    this.DATOS__AUX = this.SignalsFiltro.sort((b, a) => b.Valor - a.Valor).map(
      (nivel) => this.DATOS__AUX.find((e) => e.idEstacion == nivel.idEstacion)
    );
    this.DATOS__AUX = [...this.DATOS__AUX, ...this.SinSignals];
  }

  CompareNamesWithNumbers(nameA, nameB) {
    // Extraer las partes de texto y número de los nombres usando una expresión regular
    // Esta expresion busca una parte que no contiene números ([^\d]+) desopues por numero(\d+)
    const [, textA, numberA] = nameA.match(/([^\d]+)(\d+)?/) || [];
    const [, textB, numberB] = nameB.match(/([^\d]+)(\d+)?/) || [];

    // Comparar las partes de texto alfabeticamente
    const textComparison = textA.localeCompare(textB);

    // Si las partes de texto son diferentes regresa el resultado de la comparación
    if (textComparison !== 0) {
      return textComparison;
    }

    // Si las partes de texto son iguales compara las partes de nmeros de manera consecutiva
    // Se le puso parseInt para convertir la parte de numero de cadena a numero
    // Si la conversión falla en caso de que no no hay parte numérica se le pone un 0
    const numericA = parseInt(numberA, 10) || 0;
    const numericB = parseInt(numberB, 10) || 0;

    // regresa la diferencia entre las partes numéricas
    return numericA - numericB;
  }
}

export { TablaSimplificada };
