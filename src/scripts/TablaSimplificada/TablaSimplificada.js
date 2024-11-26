import { Credentials } from "../Entities/Login/Credentials.js";
import { Fetcher } from "../Fetcher/Fetcher.js";
import { Core } from "../TablaSimplificada/Core.js";
import {
  EnumEnlace,
  EnumProyecto,
  EnumTipoSignal,
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
  totalizado: "totalizado",
  voltaje: "voltaje",
  correinte: "correinte",
  potenciaT: "potenciaT",
  factorP: "factorP",
  valvula: "valvula",
  mantenimiento: "mantenimiento",
  puerta: "puerta",
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
    // const SIGNALS_FILTRADAS = [1, 2, 10, 12, 14, 15, 20, 21, 22, 23, 24, 25]; // Climatologicas
    const SIGNALS_FILTRADAS = [1, 2, 3, 4, 5, 6, 7, 10, 14, 15]; // LINEA MORADA
    const SIGNALS_UNIDADES = {
      1: "m",
      2: "kg/m²", // HIDROSTATICA
      // 2: "hPa", // para climatologicas unicamente
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

    this.$tbody = document.getElementById("tbody");
    this.$sitiosOnline = document.getElementById("online");
    this.$sitiosOffline = document.getElementById("offline");
    this.$sitioRadio = document.querySelector("#sitioRadio");
    this.$sitioCelular = document.querySelector("#sitioCelular");
    this.$sitioRC = document.querySelector("#sitioRC");
    this.$thead_tr = document.querySelector("#tr_header");

    let totalOnline = 0;
    let totalOffline = 0;

    let SitiosRadio = 0;
    let SitiosCelular = 0;
    let SitiosHibridos = 0;

    this.$tbody.innerHTML = "";

    this.DATOS__AUX.forEach((ROW) => {
      console.log(ROW);

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

      Object.entries(filteredRow).forEach(([key, value]) => {
        this.NEW__CELL = document.createElement("td");

        switch (key) {
          case "Enlace":
          case "IdEstacion":
          case "Nombre":
          case "Tiempo":
            if (key === "Enlace") {
              // Crear una celda para el círculo
              this.NEW__CELL.classList.add(key);
              this.setCirculoEnlace(this.NEW__CELL, filteredRow.Tiempo);
              this.NEW__ROW.appendChild(this.NEW__CELL);
            } else {
              this.NEW__CELL.innerText =
                key == "Tiempo" ? this.FormatearFecha(value) : value;
              this.NEW__CELL.classList.add(key);
              this.NEW__ROW.appendChild(this.NEW__CELL);
            }
            break;

          case "Signals":
            SIGNALS_FILTRADAS.forEach((tipoSignal) => {
              this.NEW__CELL = document.createElement("td");

              if (tipoSignal === 7) {
                // Contenedor para múltiples bombas dentro del mismo td
                const bombasContainer = document.createElement("div");
                bombasContainer.classList.add("bombas-container");

                // Filtrar todas las señales de tipoSignal 7
                const bombas = filteredRow.Signals.filter(
                  (s) => s.tipoSignal === tipoSignal
                );

                if (bombas.length > 0) {
                  bombas.forEach((bomba) => {
                    const imagenesBomba = {
                      0: "../imgs/b_g_s.png", // no disponible
                      1: "../imgs/b_g_g.png", // encendida
                      2: "../imgs/b_g_r.png", // apagada
                      3: "../imgs/b_g_b.png", // sobrecarga
                    };

                    // Crear elemento de imagen para cada bomba
                    const imgElement = document.createElement("img");
                    imgElement.src = imagenesBomba[bomba.valor];
                    imgElement.style.width = "15px";
                    imgElement.style.height = "24px";
                    bombasContainer.appendChild(imgElement);
                  });

                  this.NEW__CELL.appendChild(bombasContainer);
                } else {
                  // Si no hay bombas, mostrar "N/A"
                  this.NEW__CELL.innerText = "N/A";
                }
              } else {
                const signal = filteredRow.Signals.find(
                  (s) => s.tipoSignal === tipoSignal
                );

                if (signal) {
                  if (
                    signal.tipoSignal === 6 ||
                    signal.tipoSignal === 10 ||
                    signal.tipoSignal === 12 ||
                    signal.tipoSignal === 14 ||
                    signal.tipoSignal === 15
                  ) {
                    // Ignorar DentroRango
                    this.NEW__CELL.innerText = `${signal.valor} ${
                      SIGNALS_UNIDADES[signal.tipoSignal]
                    }`;
                  } else {
                    // Para las demás señales, verificar DentroRango
                    this.NEW__CELL.innerText = signal.dentroRango
                      ? `${signal.valor} ${SIGNALS_UNIDADES[signal.tipoSignal]}`
                      : "---";
                  }
                } else {
                  // Si no hay señal, mostrar "N/A"
                  this.NEW__CELL.innerText = "N/A";
                }
              }

              this.NEW__ROW.appendChild(this.NEW__CELL);
            });
            break;
        }
      });

      const currentTIME = new Date();
      const dataTIME = new Date(ROW.tiempo);
      const timeDIFERENCIA = Math.abs(currentTIME - dataTIME);
      const diferenciaMINUTOS = Math.floor(timeDIFERENCIA / (1000 * 60));

      if (diferenciaMINUTOS > 15) {
        totalOffline++;
      } else {
        totalOnline++;
      }

      this.$sitiosOnline.textContent = totalOnline.toString();
      this.$sitiosOffline.textContent = Core.Instance.data.length;

      if (ROW.enlace === EnumEnlace.Celular) {
        SitiosCelular++;
        // this.$sitioCelular.innerText = `En línea por celular: ${SitiosCelular}`;
      }
      if (ROW.enlace === EnumEnlace.Radio) {
        SitiosRadio++;
        // this.$sitioRadio.innerText = `En línea por radio: ${SitiosRadio}`;
      }
      if (ROW.enlace === EnumEnlace.Hibrido) {
        SitiosHibridos++;
        // this.$sitioRC.innerText = `En línea por radio / celular: ${SitiosHibridos}`;
      }

      this.$tbody.append(this.NEW__ROW);
    });
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
    if ((key === "ValorPresion" || key === "ValorGasto") && value < 0) {
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

  setCirculoEnlace(element, value) {
    element.textContent = "";
    this.NEW__DIV = document.createElement("div");

    const currentTIME = new Date();
    const dataTIME = new Date(value);
    const timeDIFERENCIA = Math.abs(currentTIME - dataTIME);
    const diferenciaMINUTOS = Math.floor(timeDIFERENCIA / (1000 * 60));

    if (diferenciaMINUTOS > 15) {
      this.NEW__DIV.classList.add("enlace-inactivo");
      element.appendChild(this.NEW__DIV);
    } else {
      this.NEW__DIV.classList.add("enlace-activo");
      element.appendChild(this.NEW__DIV);
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
      case EnumTipoFiltro.totalizado:
        this.FiltrarSignals(EnumTipoSignal.Totalizado);
        break;
      case EnumTipoFiltro.voltaje:
        this.FiltrarSignals(EnumTipoSignal.Voltaje);
        break;
      case EnumTipoFiltro.correinte:
        this.FiltrarSignals(EnumTipoSignal.CorrienteRango);
        break;
      case EnumTipoFiltro.potenciaT:
        this.FiltrarSignals(EnumTipoSignal.PotenciaTotal);
        break;
      case EnumTipoFiltro.factorP:
        this.FiltrarSignals(EnumTipoSignal.PotenciaTotal);
        break;
      case EnumTipoFiltro.valvula:
        this.FiltrarSignals(EnumTipoSignal.ValvulaAnalogica);
        break;
      case EnumTipoFiltro.mantenimiento:
        this.FiltrarSignals(EnumTipoSignal.Mantenimiento);
        break;
      case EnumTipoFiltro.puerta:
        this.FiltrarSignals(EnumTipoSignal.PuertaAbierta);
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

    this.DATOS__AUX = this.SignalsFiltro.sort((a, b) => b.valor - a.valor).map(
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
      if (!Fetcher.Instance.isLogged)
        this.$modalLogin.classList.add("modal--show");
      else this.LogOut();
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
      new Credentials(
        this.USUARIO.value,
        this.PASSWORD.value,
        Core.Instance.IdProyecto
      ),
      true
    );

    if (RESULT_LOGOUT.response == false) {
      alert("Sesión cerrada!");
      this.loginIcon.setAttribute("src", "../imgs/loginIcon.png");
      Fetcher.Instance.isLogged = false;
    }

    //console.log(RESULT_LOGOUT);
  };

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
      this.loginIcon.setAttribute("src", "../imgs/logout.png");
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
