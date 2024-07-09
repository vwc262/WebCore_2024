import { Credentials } from "../Entities/Login/Credentials.js";
import { Fetcher } from "../Fetcher/Fetcher.js";
import { Core } from "../TablaSimplificada/Core.js";
import {
  EnumEnlace,
  EnumProyecto,
  EnumTipoSignal,
  EnumTipoSignalNomenclatura,
  RequestType,
} from "../Utilities/Enums.js";
import { Nota } from "./Nota.js";

var EnumTipoFiltro = {
  enlace: "enlace",
  ordinal: "ordinal",
  nombre: "nombre",
  nivel: "nivel",
  presion: "presion",
  gasto: "gasto",
  bomba: "bomba",
  tiempo: "tiempo",
  tipoEnlace: "tipoEnlace",
};

class TablaSimplificada {
  enumTipoFiltro = EnumTipoFiltro.nombre;
  constructor() {
    this.DATOS__AUX = Core.Instance.data;
    this.InitFiltros();
    this.ModalLogin();
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
          let valorFormateado = this.FormatearFecha(value);
          this.NEW__CELL.textContent = valorFormateado;

          let tiempoActual = new Date(); // Hora actual
          let tiempoFila = new Date(value); // Hora de la fila
          let diferenciaTiempos = (tiempoActual - tiempoFila) / (1000 * 60); // Diferencia en minutos

          // Redondear la diferencia de tiempos
          let diferenciaRedondeada = Math.round(diferenciaTiempos);

          if (diferenciaRedondeada > 15) {
            this.NEW__ROW.style.background = "rgba(129, 11, 11,0.2)";
            //console.log("Diferencia mayor a 15");
          }
          // console.log(tiempoActual);
          // console.log(tiempoFila);
          // console.log(diferenciaRedondeada);
        }

        if (key === "Nombre") {
          this.NEW__CELL.style.fontWeight = "bold";
          this.NEW__CELL.style.textTransform = "uppercase";
          this.NEW__CELL.classList.add("log");
          this.NEW__CELL.setAttribute("id", filteredRow.IdEstacion);
          this.NEW__CELL.removeEventListener("click", this.ModalNotas);
          this.NEW__CELL.addEventListener("click", this.ModalNotas);
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

          const gastos = ROW.signals.filter(
            (gastosSignal) => gastosSignal.tipoSignal == EnumTipoSignal.Gasto
          );

          if (niveles.length > 0) {
            // Añade el <td> al <tr>
            this.NEW__CELL.innerText = this.FormatearGasto(niveles[0].valor);

            this.NEW__ROW.appendChild(this.NEW__CELL);
          } else {
            this.NEW__CELL.innerText = "---";
            this.NEW__ROW.appendChild(this.NEW__CELL);
          }

          this.NEW__CELL = document.createElement("td");

          if (presiones.length > 0) {
            // Añade el <td> al <tr>
            this.NEW__CELL.innerText = this.ValidarPresion(
              "ValorPresion",
              presiones[0].valor
            );

            this.NEW__ROW.appendChild(this.NEW__CELL);
          } else {
            this.NEW__CELL.innerText = "---";
            this.NEW__ROW.appendChild(this.NEW__CELL);
          }

          this.NEW__CELL = document.createElement("td");

          if (gastos.length > 0 && gastos[0].valor > 0) {
            this.NEW__CELL.innerText = this.ValidarPresion(
              "ValorGasto",
              gastos[0].valor
            );
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
              this.$imgBBA.style.filter = "hue-rotate(0deg)";
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
                case 4:
                  this.$imgBBA.setAttribute("src", "../imgs/b_g_r.png");
                  this.$imgBBA.style.filter = "hue-rotate(295deg)";
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
          this.enlaceCell.textContent = "---";
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
      case EnumTipoFiltro.gasto:
        this.FiltrarSignals(EnumTipoSignal.Gasto);
        break;
      case EnumTipoFiltro.tiempo:
        this.DATOS__AUX.sort((a, b) => new Date(b.tiempo) - new Date(a.tiempo));
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

    this.DATOS__AUX = this.SignalsFiltro.sort((b, a) => a.valor - b.valor).map(
      (nivel) => this.DATOS__AUX.find((e) => e.idEstacion == nivel.idEstacion)
    );

    if (TipoSignal == EnumTipoSignal.Bomba) {
      this.DATOS__AUX = this.SignalsFiltro.sort(
        (b, a) => b.valor - a.valor
      ).map((nivel) =>
        this.DATOS__AUX.find((e) => e.idEstacion == nivel.idEstacion)
      );
    }

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

  ModalLogin() {
    this.USUARIO = document.querySelector("#usuario");
    this.PASSWORD = document.querySelector("#password");
    this.$imgLogin = document.querySelector(".loginIcon");
    this.$modalLogin = document.querySelector(".modalLogin");
    this.$closeLogin = document.querySelector(".modal__closeLogin");
    this.$confirmarLogin = document.querySelector(".modal__confirmarLogin");

    this.$imgLogin.addEventListener("click", () => {
      if(!Fetcher.Instance.isLogged)
        this.$modalLogin.classList.add("modal--show");
      else 
      this.LogOut();      
    });

    this.$closeLogin.addEventListener("click", () => {
      this.$modalLogin.classList.remove("modal--show");
    });

    this.$confirmarLogin.addEventListener("click", () => {      
        if (this.USUARIO.value == "" && this.PASSWORD.value == "") {
          alert("Los campos no deben de estar vacios");
          return;
        }
        this.ConfirmarLogin(this.USUARIO.value, this.PASSWORD.value);      
    });
  }
  LogOut = async (ev) => {
    this.loginIcon = document.querySelector(".loginIcon");
    const RESULT_LOGOUT = await Fetcher.Instance.RequestData(
      "logout",
      RequestType.POST,
      new Credentials(this.USUARIO.value, this.PASSWORD.value, Core.Instance.IdProyecto),
      true
    );

    if (RESULT_LOGOUT.response == false) {
      alert("Sesión cerrada!");
      this.loginIcon.setAttribute('src','../imgs/loginIcon.png');      
      Fetcher.Instance.isLogged = false;
    }

    //console.log(RESULT_LOGOUT);
  }

  ModalNotas = (ev) => {
    if (Fetcher.Instance.isLogged) {
      let NOMBRE_SITIO = ev.currentTarget.innerText;
      let ID_ESTACION = ev.currentTarget.id;

      this.$modal = document.querySelector(".modal");
      this.$modalTitle = document.querySelector(".modal__title2");
      this.$modalClose = document.querySelector(".modal__close");
      this.$modalAgregar = document.querySelector(".modal__GuardarNota");
      this.$modalConsulta = document.querySelector(".modal__ConsultaNota");
      this.$notasContainer = document.querySelector(".notasContainer");

      this.$notasContainer.innerHTML = "";

      this.$modal.classList.add("modal--show");

      this.$modalTitle.innerText = `Agregar nota a: ${NOMBRE_SITIO}`;

      this.$modalClose.addEventListener("click", () => {
        this.$modal.classList.remove("modal--show");
      });

      this.$modalAgregar.removeEventListener("click", this.EnviarNota);
      this.$modalAgregar.addEventListener("click", this.EnviarNota);

      this.$modalConsulta.removeEventListener("click", this.ConsultaNota);
      this.$modalConsulta.addEventListener("click", this.ConsultaNota);

      this.$modalConsulta.idEstacion = ID_ESTACION;
      this.$modalConsulta.Nombre = NOMBRE_SITIO;
      this.$modalAgregar.idEstacion = ID_ESTACION;

      this.$modalConsulta.click();
    }
  };

  async ConfirmarLogin(USUARIO, PASSWORD) {
    this.$modalLogin = document.querySelector(".modalLogin");
    this.$itemlog = document.querySelectorAll(".log");
    this.loginIcon = document.querySelector(".loginIcon");

    this.RESULT_LOGIN = await Fetcher.Instance.RequestData(
      "login",
      RequestType.POST,
      new Credentials(USUARIO, PASSWORD, Core.Instance.IdProyecto),
      true
    );

    if (this.RESULT_LOGIN.response) {
      this.loginIcon.setAttribute('src', '../imgs/logout.png');
      Fetcher.Instance.isLogged = true;
      this.$modalLogin.classList.remove("modal--show");
      // this.loginIcon.style.pointerEvents = "none";
      this.$itemlog.forEach((item) => {
        item.style.pointerEvents = "auto";
      });
    }
  }

  async EnviarNota(ev) {
    this.$notaInput = document.querySelector("#notaInput");
    this.USUARIO = document.querySelector("#usuario");

    const idEstacion = ev.currentTarget.idEstacion;

    if (this.$notaInput.value == "") {
      alert("No se puede agregar una nota vacia");
      return;
    }

    this.RESULT__NOTA = await Fetcher.Instance.RequestData(
      "AgregarNota?idProyecto=2",
      RequestType.POST,
      new Nota(
        idEstacion,
        `${this.USUARIO.value} - ${this.$notaInput.value}`,
        false
      ),
      true
    );

    if (this.RESULT__NOTA.response) {
      this.$notaInput.value = "";
    }
  }

  async ConsultaNota(ev) {
    this.TARGET = ev.currentTarget.idEstacion;
    this.NOMBRE_SITIO = ev.currentTarget.Nombre;
    this.$modalTitle = document.querySelector(".modal__title3");
    this.$notasContainer = document.querySelector(".notasContainer");

    this.$modalTitle.innerText = `Notas sobre: ${this.NOMBRE_SITIO}`;
    this.$notasContainer.innerHTML = "";

    const RESULT_CONSULTA_NOTA = await Fetcher.Instance.RequestData(
      "ConsultarNotas?idProyecto=2",
      RequestType.POST,
      new Nota(this.TARGET, "", false),
      true
    );

    RESULT_CONSULTA_NOTA.forEach((notaText) => {
      this.$notasContainer.innerHTML += `<p class="modal__paragraph2">${notaText.notaUsuario}</p>`;
    });
  }
}

export { TablaSimplificada };
