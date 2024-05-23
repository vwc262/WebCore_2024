import { Configuracion } from "../../config/config.js";
import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { EnumEnlace, EnumTipoSignal } from "../Utilities/Enums.js";
import { ExtraRowVariables } from "./ExtraRowVariables.js";
import { Row } from "./Row.js";
import { RowVariables } from "./RowVariables.js";

/**
 * @returns {Tabla}
 */
class Tabla {
  /**
   * @type {[Row]}
   */
  rows = [];

  /**
   * @type {[RowVariables]}
   */
  rowVariables = [];

  constructor() {
    /**
     * @type {HTMLElement}
     */
    this.tBody = document.querySelector(".curved-tBody");
    this.tBodyVariablesContainer = document.querySelector(
      ".curved-table-variables-container"
    );

    this.cantidadElementos = Core.Instance.data.length;
    this.indice = 0;
    this.expandRowPressed = {
      extraRows: 0,
      actualIndex: 0,
      btn: null,
    };
    this.elementosVisibles = 15;

    this.extraRows = [];

    this.curvedRows = document.getElementsByClassName("curved-Row");
    this.curvedRowsVariables = document.getElementsByClassName(
      "curved-Row-variables"
    );

    // Mouse wheel event
    this.tBody.addEventListener("wheel", (event) => {
      let upwards = event.wheelDelta > 0 || event.detail < 0;
      this.setScrollDirection(upwards);
      this.SVGScrollHandler.setFollowerPositionFromTable(
        -(this.indice / this.normalizedTableOffset)
      );
    });

    // Mouse wheel event (older browsers)
    this.tBody.addEventListener("mousewheel", (event) => {
      let upwards = event.wheelDelta > 0 || event.detail < 0;
      this.setScrollDirection(upwards);
    });

    // Touch move event
    this.tBody.addEventListener("touchmove", (event) => {
      console.log("Touch move event");
      // Your code here
    });

    this.btnTabla = document.querySelector(".btnTabla");
    this.btnTabla.style.background = `url("${Core.Instance.ResourcesPath}General/btn_abrir.png?v=${Core.Instance.version}")`;
    this.btnTabla.addEventListener("click", () => {
      if (this.expandRowPressed.btn != null) {
        this.expandRowPressed.btn.click();
      }

      let visible = this.tBodyVariablesContainer.getAttribute("visible");
      if (visible == null || visible == undefined) visible = false;
      else if (visible == "0") visible = false;
      else visible = true;

      this.tBodyVariablesContainer.setAttribute(
        "visible",
        `${visible ? "0" : "1"}`
      );
      console.log(this.quantityColumns);
      this.tBodyVariablesContainer.style = `right:${visible ? `-455` : `${(this.quantityColumns * 86) - 455 + 55}`
        }px;`;
      this.btnTabla.style.background = `url("${Core.Instance.ResourcesPath
        }General/${visible ? "btn_abrir" : "btn_abrirrotate"}.png?v=${Core.Instance.version
        }")`;
    });

    this.columns = {
      1: Core.Instance.data.filter(
        (estacion) =>
          estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Nivel).length > 0
      ),
      2: Core.Instance.data.filter(
        (estacion) =>
          estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Presion).length > 0
      ),
      3: Core.Instance.data.filter(
        (estacion) =>
          estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Gasto).length > 0
      ),
      4: Core.Instance.data.filter(
        (estacion) =>
          estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Totalizado)
            .length > 0
      ),
      5: Core.Instance.data.filter(
        (estacion) =>
          estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.ValvulaAnalogica)
            .length > 0
      ),
      6: Core.Instance.data.filter(
        (estacion) =>
          estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.ValvulaDiscreta)
            .length > 0
      ),
      7: Core.Instance.data.filter(
        (estacion) =>
          estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Bomba).length > 0
      ),
      9: Core.Instance.data.filter(
        (estacion) =>
          estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.PerillaGeneral)
            .length > 0
      ),
      10: Core.Instance.data.filter(
        (estacion) =>
          estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.Voltaje).length > 0
      ),
      12: Core.Instance.data.filter(
        (estacion) =>
          estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.FallaAC).length > 0
      ),
      15: Core.Instance.data.filter(
        (estacion) =>
          estacion.ObtenerSignalPorTipoSignal(EnumTipoSignal.PuertaAbierta)
            .length > 0
      ),
    };

    Object.keys(this.columns).forEach((key) => {
      if (this.columns[key].length == 0) {
        let th = document.querySelector(`.thContainer[tag="${key}"]`);
        th.remove();
        delete this.columns[key];
      } else this.columns[key] = [];
    });

    this.quantityColumns = Object.keys(this.columns).length;

    this.online = document.querySelector('.texto-resumen[tag="online"]');
    this.offline = document.querySelector('.texto-resumen[tag="offline"]');
    this.mantenimiento = document.querySelector(
      '.texto-resumen[tag="mantenimiento"]'
    );

    Object.keys(EnumTipoSignal).forEach((key) => {
      let th = document.querySelector(
        `.thContainer[tag="${EnumTipoSignal[key]}"]`
      );
      if (th != null) {
        let img = th.firstElementChild;
        img.setAttribute(
          "src",
          `${Core.Instance.ResourcesPath}Encabezados/${key}.png?v=${Core.Instance.version}`
        );
      }
    });

    let fondoTabla = document.querySelector(`.fondo-tabla`);
    fondoTabla.setAttribute(
      "src",
      `${Core.Instance.ResourcesPath}General/fondoTabla.png?v=${Core.Instance.version}`
    );

    let fondoTablaVariables = document.querySelector(`.fondo-tabla-variables`);
    fondoTablaVariables.setAttribute(
      "src",
      `${Core.Instance.ResourcesPath}General/tablaVariables.png?v=${Core.Instance.version}`
    );

    let summaryFondo = document.querySelector(`.contenedor-resumen`);
    summaryFondo.style.background = `url(${Core.Instance.ResourcesPath}General/Summary.png?v=${Core.Instance.version})`;

    this.Configuracion = Configuracion.GetConfiguracion(
      Core.Instance.IdProyecto
    );

    this.upwards = true;
  }

  /**
   *
   * @param {boolean} upwards direccion (hacia arriba)
   */
  setScrollDirection(upwards) {
    this.indice += upwards ? 1 : -1;
    this.upwards = upwards;

    this.refreshTable();
  }

  refreshTable() {
    // console.log(this.indice, -(this.cantidadElementos - this.elementosVisibles), (this.expandRowPressed.extraRows > 0 ? (- this.expandRowPressed.extraRows + 1) : 0));
    this.UpdateNormalizedValue();
    if (
      this.indice <
      -(this.cantidadElementos - this.elementosVisibles) +
      (this.expandRowPressed.extraRows > 0
        ? -this.expandRowPressed.extraRows + 1
        : 0)
    ) {
      this.indice =
        -(this.cantidadElementos - this.elementosVisibles) +
        (this.expandRowPressed.extraRows > 0
          ? -this.expandRowPressed.extraRows + 1
          : 0);
    }
    if (this.indice > 0) {
      this.indice = 0;
    }

    let indexCurvedRows = 0;
    let indexEstacion = -this.indice;

    Object.keys(this.extraRows).forEach((key) => {
      this.extraRows[key].rowContainer.remove();
      delete this.extraRows[key];
    });

    let overflowOnTop = false;
    let isTotallyOverflowed = false;

    let estacionOverflowed = Core.Instance.data.find(
      (estacion) => estacion.IdEstacion == this.expandRowPressed.IdEstacion
    );
    if (estacionOverflowed) {
      overflowOnTop =
        -this.indice > this.expandRowPressed.actualIndex &&
        this.expandRowPressed.extraRows +
        this.indice +
        this.expandRowPressed.actualIndex >=
        0;

      // console.log(overflowOnTop, -this.indice, this.expandRowPressed.actualIndex, this.expandRowPressed.extraRows + this.indice + this.expandRowPressed.actualIndex);

      if (overflowOnTop) {
        indexEstacion = Core.Instance.data.indexOf(estacionOverflowed);
      } else if (-this.indice > this.expandRowPressed.actualIndex) {
        indexEstacion -= this.expandRowPressed.extraRows - 1;
      }
    }

    for (
      let indexRow = indexEstacion;
      indexRow < this.cantidadElementos;
      indexRow++
    ) {
      if (
        this.curvedRows[indexCurvedRows] != undefined &&
        this.rows[indexRow] != undefined
      ) {
        let estacion = Core.Instance.data[indexEstacion];

        let row = this.rows[indexRow];
        let rowVariables = this.rowVariables[indexRow];

        row.IdEstacion = estacion.IdEstacion;
        rowVariables.IdEstacion = estacion.IdEstacion;

        this.curvedRows[indexCurvedRows].innerHTML = "";
        this.curvedRowsVariables[indexCurvedRows].innerHTML = "";

        if (estacion.IdEstacion == this.expandRowPressed.IdEstacion) {
          let startOrginal =
            0 + overflowOnTop
              ? -this.indice - this.expandRowPressed.actualIndex
              : 0;
          for (
            let ordinalSignal = startOrginal;
            ordinalSignal < this.expandRowPressed.extraRows;
            ordinalSignal++
          ) {
            if (
              this.curvedRows[indexCurvedRows] != undefined &&
              this.rows[indexRow] != undefined
            ) {
              const columns = {};
              Object.keys(this.columns).forEach((key) => {
                columns[key] = [];
              });

              this.extraRows.push(
                new ExtraRowVariables(
                  estacion.IdEstacion,
                  columns,
                  ordinalSignal
                )
              );
              this.extraRows[this.extraRows.length - 1].create();

              this.curvedRows[indexCurvedRows].innerHTML = "";
              this.curvedRowsVariables[indexCurvedRows].innerHTML = "";

              if (ordinalSignal == 0) {
                this.curvedRows[indexCurvedRows].appendChild(row.rowContainer);

                this.curvedRowsVariables[indexCurvedRows].appendChild(
                  rowVariables.rowContainer
                );
                this.curvedRowsVariables[indexCurvedRows].style.background =
                  "linear-gradient(90deg, rgba(70, 95, 138, 0.35) 0%, rgba(70, 95, 138, 0.35) 60%, rgba(0, 0, 0, 0.75) 90%)";
              } else {
                this.curvedRowsVariables[indexCurvedRows].appendChild(
                  this.extraRows[this.extraRows.length - 1].rowContainer
                );
                this.curvedRowsVariables[indexCurvedRows].style.background =
                  "linear-gradient(90deg, rgba(24, 64, 89, 0.5) 0%, rgba(24, 64, 89, 0.3) 60%, rgba(0, 0, 0, 0) 90%)";
              }
            }

            // console.log('\t\t', 'indexEstacion', indexEstacion, 'indexRow', indexRow, 'indexCurvedRows', indexCurvedRows, 'indice', this.indice);

            indexCurvedRows++;
          }

          indexEstacion++;
          continue;
        }

        // console.log('upwards', this.upwards, 'overflowOnTop', overflowOnTop, 'indexEstacion', indexEstacion, 'indexRow', indexRow, 'indexCurvedRows', indexCurvedRows, 'indice', this.indice);

        this.curvedRows[indexCurvedRows].appendChild(row.rowContainer);
        this.curvedRowsVariables[indexCurvedRows].appendChild(
          rowVariables.rowContainer
        );

        this.curvedRowsVariables[indexCurvedRows].style.background =
          "linear-gradient(90deg, rgba(70, 95, 138, 0.35) 0%, rgba(70, 95, 138, 0.35) 60%, rgba(0, 0, 0, 0.75) 90%)";

        row.Update();
        rowVariables.Update(indexRow);
      }

      indexEstacion++;
      indexCurvedRows++;
    }

    // console.log('------------------------------------------------------');
  }

  create() {
    this.curvedScroll();

    let canvas = document.querySelector("#svgScroll");
    this.SVGScrollHandler.init(canvas);

    let indexCurvedRows = 0;
    for (
      let indexEstacion = -this.indice;
      indexEstacion < Core.Instance.data.length;
      indexEstacion++
    ) {
      const estacion = Core.Instance.data[indexEstacion];

      const columns = {};
      Object.keys(this.columns).forEach((key) => {
        columns[key] = [];
      });

      this.rows.push(
        new Row(
          estacion.IdEstacion,
          function (mouseover, IdEstacion) {
            this.hoverRow(mouseover, IdEstacion);
          }.bind(this)
        )
      );
      this.rowVariables.push(
        new RowVariables(
          estacion.IdEstacion,
          columns,
          0,
          this.expandRowPressed,
          indexEstacion,
          function () {
            this.refreshTable();
          }.bind(this),
          function (mouseover, IdEstacion) {
            this.hoverRow(mouseover, IdEstacion);
          }.bind(this)
        )
      );

      const row = this.rows[this.rows.length - 1];
      row.create();
      const rowVariables = this.rowVariables[this.rowVariables.length - 1];
      rowVariables.create();

      if (this.curvedRows[indexCurvedRows] != undefined) {
        this.curvedRows[indexCurvedRows].innerHTML = "";
        this.curvedRows[indexCurvedRows].appendChild(row.rowContainer);

        this.curvedRowsVariables[indexCurvedRows].innerHTML = "";
        this.curvedRowsVariables[indexCurvedRows].appendChild(
          rowVariables.rowContainer
        );
      }

      indexCurvedRows++;
    }

    this.UpdateNormalizedValue();
    this.suscribirEventos();
    this.update();
  }

  UpdateNormalizedValue() {
    this.normalizedTableOffset =
      this.cantidadElementos -
      this.elementosVisibles +
      (this.expandRowPressed.extraRows > 0
        ? this.expandRowPressed.extraRows + 1
        : 0);
  }

  hoverRow(mouseover, IdEstacion, stopPropagation) {
    let row = this.rows.find((f) => f.IdEstacion == IdEstacion);
    let rowVariable = this.rowVariables.find((f) => f.IdEstacion == IdEstacion);

    row.rowContainer.style.background = `${mouseover ? "rgba(87,168,152,0.35)" : "rgba(87,168,152,0.0)"
      } `;
    rowVariable.rowContainer.style.background = `${mouseover ? "rgba(87,168,152,0.35)" : "rgba(87,168,152,0.0)"
      } `;

    if (!stopPropagation) {
      const estacion = Core.Instance.data.find(
        (estacion) => estacion.IdEstacion == IdEstacion
      );
      const estilosEstacionEtiqueta =
        this.Configuracion.perfil.estilosEstacion.find(
          (element) => element.IdEstacion == IdEstacion
        );

      EventsManager.Instance.EmitirEvento("OnMouseHoverTabla", {
        isMouseOut: !mouseover,
        estacion: estacion,
        css: estilosEstacionEtiqueta.Imagen,
        stopPropagation: true,
      });
    }
  }

  curvedScroll() {
    // // value="0" min="0" max="3"
    // let $slider = document.querySelector(".sliderVertical");
    // this.scrollValue = 0;
    // $slider.setAttribute(
    //   "max",
    //   `${this.cantidadElementos - this.elementosVisibles}`
    // );
    // $slider.addEventListener("input", (event) => {
    //   console.log(event.currentTarget.value);
    //   this.setScrollDirection(event.currentTarget.value < this.scrollValue);
    //   this.scrollValue = event.currentTarget.value;
    // });
  }
  normalizedTableOffset = 0;
  SVGScrollHandler = {
    minY: 169,
    maxY: 923,
    follower: undefined,
    canvasCoordinates: undefined,
    path: undefined,
    filler: undefined,
    init: function (canvas) {
      setTimeout(() => {
        this.canvasCoordinates = canvas.getBoundingClientRect();
        this.follower = document.querySelector(".follower");
        this.path = document.querySelector(".scrollCurve");
        this.filler = document.querySelector("#filler");
        this.startAtOrigin();
        this.setEvents(canvas);
      }, 10);
    },
    startAtOrigin: function () {
      let point = this.path.getPointAtLength(0);
      this.follower.setAttribute("cx", point.x);
      this.follower.setAttribute("cy", point.y);
    },
    setEvents: function (canvas) {
      canvas.addEventListener("mousedown", (event) => {
        canvas.addEventListener("mousemove", this.onMouseMove);
      });
      canvas.addEventListener("touchstart", (event) => {
        canvas.addEventListener("touchmove", this.onTouchMove);
      });
      canvas.addEventListener("touchend", (event) => {
        canvas.removeEventListener("touchmove", this.onTouchMove);
      });
      canvas.addEventListener("mouseleave", (event) => {
        canvas.removeEventListener("mousemove", this.onMouseMove);
      });
      canvas.addEventListener("mouseup", (event) => {
        canvas.removeEventListener("mousemove", this.onMouseMove);
      });
    },
    onMouseMove: (mouseEvent) => {
      let yValNormalized = this.SVGScrollHandler.getNormalizedValue(
        mouseEvent.offsetY
      );
      this.SVGScrollHandler.setFollowerPosition(yValNormalized, true);
    },
    onTouchMove: (touchEvent) => {
      let yValNormalized = this.SVGScrollHandler.getNormalizedValue(
        touchEvent.touches[0].clientY
      );
      this.SVGScrollHandler.setFollowerPosition(yValNormalized, true);
    },
    getNormalizedValue: (yVal) => {
      return (
        (yVal - this.SVGScrollHandler.minY) /
        (this.SVGScrollHandler.maxY - this.SVGScrollHandler.minY)
      );
    },
    setFollowerPosition: (yValNormalized) => {
      if (
        this.SVGScrollHandler.path &&
        yValNormalized >= 0 &&
        yValNormalized <= 1
      ) {
        let point = this.SVGScrollHandler.path.getPointAtLength(
          this.SVGScrollHandler.path.getTotalLength() * yValNormalized
        );
        this.SVGScrollHandler.follower.setAttribute("cx", point.x);
        this.SVGScrollHandler.follower.setAttribute("cy", point.y);
        let length = this.SVGScrollHandler.filler.getTotalLength();
        this.SVGScrollHandler.filler.style.strokeDashoffset =
          length - length * yValNormalized;
        this.UpdateNormalizedValue();
        this.indice = Math.round(this.normalizedTableOffset * -yValNormalized);

        this.refreshTable();
      }
    },
    setFollowerPositionFromTable: (yValNormalized) => {
      if (
        this.SVGScrollHandler.path &&
        yValNormalized >= 0 &&
        yValNormalized <= 1
      ) {
        let point = this.SVGScrollHandler.path.getPointAtLength(
          this.SVGScrollHandler.path.getTotalLength() * yValNormalized
        );
        this.SVGScrollHandler.follower.setAttribute("cx", point.x);
        this.SVGScrollHandler.follower.setAttribute("cy", point.y);
        let length = this.SVGScrollHandler.filler.getTotalLength();
        this.SVGScrollHandler.filler.style.strokeDashoffset =
          length - length * yValNormalized;
      }
    },
  };

  update() {
    let onlineCount = Core.Instance.data.filter(
      (estacion) => estacion.Enlace != EnumEnlace.FueraLinea && !estacion.IsTimeout() && !estacion.IsEnMantenimiento()
    ).length;
    let offlineCount = Core.Instance.data.filter(
      (estacion) => {
        if (estacion.IsTimeout()) return true;
        else if( estacion.IsEnMantenimiento()) return false;
        else if(estacion.Enlace == EnumEnlace.FueraLinea) return true
      }
    ).length;    

    let enMantenimiento = Core.Instance.data.filter((estacion) =>
      estacion.IsEnMantenimiento() && !estacion.IsTimeout()
    ).length;


    this.online.innerHTML = onlineCount;
    this.offline.innerHTML = offlineCount
    this.mantenimiento.innerHTML = enMantenimiento;
  }

  suscribirEventos() {
    EventsManager.Instance.Suscribirevento(
      "Update",
      new EventoCustomizado(() => this.update())
    );
    EventsManager.Instance.Suscribirevento(
      "OnMouseHoverPerfil",
      new EventoCustomizado((data) =>
        this.hoverRow(data.mouseover, data.IdEstacion, data.stopPropagation)
      )
    );
  }
}

export { Tabla };
