/**
 * ---------------------------------------
 * This demo was created using amCharts 5.
 *
 * For more information visit:
 * https://www.amcharts.com/
 *
 * Documentation is available at:
 * https://www.amcharts.com/docs/v5/
 * ---------------------------------------
 */

import { ArmarFechaSQL } from "../Utilities/CustomFunctions.js";
import { EnumTipoSignal } from "../Utilities/Enums.js";
import { FetcherGraficador, EnumPeticiones } from "./Fetcher.js";
import controladorVideo from "./videos.js";
import { Configuracion } from "../../config/config.js";
import { Core } from "../Core.js";

// Create root element
// https://www.amcharts.com/docs/v5/getting-started/#Root_element

var UIReportes = {
  tipoSignalName: {
    1: "Nivel (m)",
    2: "Presion (kg/cm2)",
    3: "Gasto (l/s)",
    4: "Totalizado (m3)",
    5: "ValvulaAnalogica",
    6: "ValvulaDiscreta",
    7: "Bomba",
    8: "PerillaBomba",
    9: "PerillaGeneral",
    10: "Voltaje (V)",
    11: "Enlace",
    12: "FallaAC",
    13: "Tiempo",
    14: "Mantenimiento",
    15: "Puerta Abierta",
    16: "VoltajeRango",
    17: "CorrienteRango",
    18: "PotenciaTotal",
    19: "FactorPotencia",
    20: "Precipitacion",
    21: "Temperatura",
    22: "Humedad",
    23: "Radiacion",
    24: "Intensidad",
    25: "Direccion",
  },

  unidades: {
    1: "m",
    2: "kg/cm",
    3: "l/s",
    4: "m",
    10: "V",
  },
  data: [],
  dataCruda: [],
  fechaInicial: "",
  fechaFinal: "",
  idSignalsAGraficar: [],
  idSignalsABorrar: [],
  signalesFetcheadas: 0,
  root: undefined,
  Peticion: async function () {
    this.data = [];
    this.dataCruda = [];
    this.signalesFetcheadas = 0;

    await UIReportes.FetchAllSignals();
  },
  PrepararChart: function () {
    this.root?.dispose();
    this.root = am5.Root.new("chartdiv", {
      calculateSize: (dimensions) => {
        return {
          width: 1345,
          height: 760,
        };
      },
    });
  },
  FetchAllSignals: async function () {
    UIReportes.idSignalsABorrar = [];
    UIReportes.idSignalsAGraficar.forEach(async (signalObj, index) => {
      var _data = {
        idSignal: signalObj.IdSignal,
        fechaInicial: ArmarFechaSQL(UIReportes.fechaInicial, true),
        FechaFinal: ArmarFechaSQL(UIReportes.fechaFinal, false),
      };

      var jsonDataReportes = await FetcherGraficador.request({
        action: `${EnumPeticiones.HISTORICOS}`,
        method: FetcherGraficador.methodType.POST,
        data: _data,
        jsonizar: true,
      });

      if (jsonDataReportes.Reporte.length > 0) {
        UIReportes.dataCruda.push(jsonDataReportes.Reporte);
      }
      else {
        UIReportes.idSignalsABorrar.push(index);
      }

      UIReportes.ProcesarInformacion();
    });
  },
  ProcesarInformacion: function () {
    UIReportes.signalesFetcheadas++;
    if (UIReportes.signalesFetcheadas < UIReportes.idSignalsAGraficar.length) {
      return;
    }
    else if (UIReportes.signalesFetcheadas == UIReportes.idSignalsAGraficar.length) {
      UIReportes.idSignalsABorrar.forEach((index) => {
        const signalItem = document.getElementsByClassName(`variable_${UIReportes.idSignalsAGraficar[index].IdSignal}`)[0];
        signalItem.remove();
        UIReportes.idSignalsAGraficar.splice(index, 1)
      })

      this.PrepararChart();

      //  remove all elements from the root, simply clear children of its container
      this.root.container.children.clear();

      if (UIReportes.dataCruda.length > 0) {
        let aux = [];
        let config = Configuracion.GetConfiguracion(Core.Instance.IdProyecto);
        UIReportes.dataCruda.forEach((infoSignal) => {
          infoSignal.forEach((d, index) => {
            let _d = new Date(new Date(d.Tiempo))

            if (config.promedios) {
              _d = new Date(new Date(d.Tiempo).setSeconds(0));
              let minutos = _d.getMinutes();
              let minutosRedondeados = Math.round(minutos / 5) * 5
              _d.setMinutes(minutosRedondeados);
            }

            if (
              UIReportes.data[_d] == undefined ||
              UIReportes.data[_d] == null
            ) {
              UIReportes.data[_d] = {
                date: _d,
              };
              aux.push(UIReportes.data[_d]);
              // UIReportes.idSignalsAGraficar.forEach(signalObj => {
              //   UIReportes.data[_d][signalObj.IdSignal] = undefined;
              // });
            }
            UIReportes.data[_d][d.IdSignal] = d.Valor < 0 ? 0 : d.Valor;
            if (UIReportes.idSignalsAGraficar.find(s => s.IdSignal == d.IdSignal).IdTipoSignal == EnumTipoSignal.Bomba) {
              UIReportes.data[_d][d.IdSignal] = d.Valor == 1 ? 2 : d.Valor == 2 ? 1 : d.Valor;
            }
          });
        });
        aux.sort((a, b) => new Date(a.date) - new Date(b.date));
        UIReportes.data = aux;
        //console.log(UIReportes.data);
        UIReportes.SetChart();
      } else {
        const txtSinHistoricos = document.querySelector(".sinHistoricos");
        txtSinHistoricos.style.opacity = "1";
      }
    }
  },
  SetChart: function () {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element

    var root = this.root;
    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: false,
        panX: true,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
        width: 1345,
        height: 760,
        autoResize: false,
      })
    );

    var easing = am5.ease.linear;
    chart.get("colors").set("step", 3);

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    var xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0.1,
        groupData: false,
        baseInterval: {
          timeUnit: "minute",
          count: 1,
        },

        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 80,
          minorGridEnabled: true,
        }),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    let xAxisRenderer = xAxis.get("renderer");
    xAxisRenderer.grid.template.setAll({
      stroke: am5.color(0xffffff),
      strokeWidth: 2,
    });

    xAxisRenderer.labels.template.setAll({
      stroke: am5.color(0xffffff),
      strokeWidth: 2,
      fill: am5.color(0xdaa520),
    });

    // formato para el tooltip de la fecha (eje inferior X)
    xAxis.get("tooltipDateFormats")["minute"] = "hh:mm";

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        xAxis: xAxis,
        behavior: "panXY",
      })
    );
    // cursor.events.on('cursormoved', (ev) => {
    //   console.log(ev.target)
    // })
    cursor.lineY.set("visible", false);

    // add scrollbar
    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, {
        orientation: "horizontal",
      })
    );

    var scrollbarX = am5xy.XYChartScrollbar.new(root, {
      orientation: "horizontal",
      height: 50,
    });

    scrollbarX.thumb.setAll({
      fill: am5.color(0xffffff),
      fillOpacity: 0.0,
    });

    scrollbarX.get("background").setAll({
      fill: am5.color(0xffffff),
      fillOpacity: 0.0,
      cornerRadiusTR: 0,
      cornerRadiusBR: 0,
      cornerRadiusTL: 0,
      cornerRadiusBL: 0,
    });

    scrollbarX.startGrip.set("scale", 0.8);
    scrollbarX.endGrip.set("scale", 0.8);

    chart.set("scrollbarX", scrollbarX);

    var sbxAxis = scrollbarX.chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        groupData: false,
        groupIntervals: [{ timeUnit: "minute", count: 1 }],
        baseInterval: { timeUnit: "minute", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {
          opposite: false,
          strokeOpacity: 0,
          stroke: am5.color(0xff0000),
          strokeWidth: 2,
        }),
      })
    );

    var yAxis = {},
      sbyAxis = {},
      yRenderer = {};

    UIReportes.idSignalsAGraficar.forEach((signalObj) => {
      if (yRenderer[signalObj.IdTipoSignal] == undefined) {
        yRenderer[signalObj.IdTipoSignal] = am5xy.AxisRendererY.new(root, {
          opposite: false,
        });
      }

      UIReportes.CreateYAxis(
        chart,
        root,
        yRenderer[signalObj.IdTipoSignal],
        yAxis,
        signalObj
      );
      var props = UIReportes.CreateSeries(
        chart,
        root,
        yRenderer[signalObj.IdTipoSignal],
        xAxis,
        yAxis,
        signalObj
      );

      if (sbyAxis[signalObj.IdTipoSignal] == undefined) {
        sbyAxis[signalObj.IdTipoSignal] = scrollbarX.chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {}),
          })
        );

        if (signalObj.IdTipoSignal == EnumTipoSignal.Bomba) {
        }
      }

      var sbseries = scrollbarX.chart.series.push(
        am5xy.LineSeries.new(root, {
          xAxis: sbxAxis,
          yAxis: sbyAxis[signalObj.IdTipoSignal],
          valueXField: "date",
          valueYField: "value",
          connect: false,
          color: am5.color(signalObj.Color),
          stroke: am5.color(signalObj.Color),
        })
      );

      sbseries.bullets.push(function (root) {
        return am5.Bullet.new(root, {
          sprite: am5.Circle.new(root, {
            radius: 2,
            fill: sbseries.get("color"),
            // tooltipText: '{valueY}'
          }),
        });
      });

      sbseries.data.setAll(props.data);
    });

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);
  },
  CreateYAxis: function (chart, root, yRenderer, yAxis, signalObj) {
    if (yAxis[signalObj.IdTipoSignal] == undefined) {
      const valueAxisConfig = {
        maxDeviation: 1,
        renderer: yRenderer,
        color: am5.color(signalObj.Color),
      };

      if (signalObj.IdTipoSignal == EnumTipoSignal.Bomba) {
        valueAxisConfig.min = 0;
        valueAxisConfig.max = 4;
        valueAxisConfig.extraTooltipPrecision = 1;
        valueAxisConfig.baseValue = 1;
      }

      yAxis[signalObj.IdTipoSignal] = chart.yAxes.push(
        am5xy.ValueAxis.new(root, valueAxisConfig)
      );
      if (signalObj.IdTipoSignal == EnumTipoSignal.Bomba) {
        const labels = yAxis[signalObj.IdTipoSignal].get("renderer").labels;
        labels.template.adapters.add("text", function (text, target) {
          if (text) {
            let textoAPoner = "";
            let value = parseInt(text);
            switch (value) {
              case 0:
                textoAPoner = "Mantenimento";
                break;
              case 1:
                textoAPoner = "Apagada";
                break;
              case 2:
                textoAPoner = "Arrancada";
                break;
              case 3:
                textoAPoner = "Falla";
                break;
            }
            return text % 1 != 0 ? "" : textoAPoner;
          }
        });
      }

      let label = am5.Label.new(root, {
        name: signalObj.Nombre,
        textAlign: "center",
        rotation: -90,
        y: am5.p50,
        stroke: am5.color(signalObj.Color),
      });

      label.set(
        "text",
        `[${signalObj.Color}] ${this.GetSignalNameByTipoSignal(
          signalObj.IdTipoSignal
        )}`
      );

      yAxis[signalObj.IdTipoSignal].children.unshift(label);

      if (chart.yAxes.indexOf(yAxis[signalObj.IdTipoSignal]) > 0) {
        yAxis[signalObj.IdTipoSignal].set(
          "syncWithAxis",
          chart.yAxes.getIndex(0)
        );
      }

      let yAxisRenderer = yAxis[signalObj.IdTipoSignal].get("renderer");
      yAxisRenderer.grid.template.setAll({
        stroke: am5.color(0xffffff),
        strokeWidth: 2,
      });
    }
  },
  GetSignalNameByTipoSignal: function (tipoSignal) {
    return this.tipoSignalName[tipoSignal];
  },
  SetUnities: function (idTipoSignal) {
    let unidades = UIReportes.unidades[idTipoSignal] ?? "";
    switch (idTipoSignal) {
      case 2:
        unidades += "[baseline-shift:super;font-size:10]2";
        break;
      case 4:
        unidades += "[baseline-shift:super;font-size:10]3";
        break;
    }
    return unidades;
  },
  CreateSeries: function (chart, root, yRenderer, xAxis, yAxis, signalObj) {
    let tooltip = am5.Tooltip.new(root, {
      pointerOrientation: "horizontal",
      labelText: `{name} : {valueY} ${this.SetUnities(signalObj.IdTipoSignal)}`,
      getFillFromSprite: false,
    });

    tooltip.get("background").setAll({
      fill: am5.color(signalObj.Color),
    });
    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: signalObj.Nombre,
        color: am5.color(signalObj.Color),
        xAxis: xAxis,
        yAxis: yAxis[signalObj.IdTipoSignal],
        stroke: am5.color(signalObj.Color),
        valueYField: "value",
        valueXField: "date",
        legendLabelText: "[bold {color}]{name}:[/]",
        // legendRangeLabelText: "[{color}]{name}:[/]",
        legendValueText: "[bold {color}]{valueY}[/]",
        // legendRangeValueText: "[{color}]{valueYClose}[/]",
        tooltip: tooltip,
      })
    );

    series.bullets.push(function (root) {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 4,
          fill: series.get("color"),
          // tooltipText: '{valueY}'
        }),
      });
    });

    //series.fills.template.setAll({ fillOpacity: 0.2, visible: true });
    series.strokes.template.setAll({ strokeWidth: 1 });

    yRenderer.grid.template.set("strokeOpacity", 0.05);
    yRenderer.labels.template.set(
      "fill",
      yAxis[signalObj.IdTipoSignal].get("color")
    );
    yRenderer.setAll({
      stroke: yAxis[signalObj.IdTipoSignal].get("color"),
      strokeOpacity: 1,
      opacity: 1,
    });

    // Set up data processor to parse string dates
    // https://www.amcharts.com/docs/v5/concepts/data/#Pre_processing_data
    series.data.processor = am5.DataProcessor.new(root, {
      dateFormat: "yyyy-MM-dd HH:mm",
      dateFields: ["date"],
    });

    var seriesData = [];
    Object.values(UIReportes.data).forEach((k) => {
      var data = {
        date: k.date,
        value: k[`${signalObj.IdSignal}`],
      };
      seriesData.push(data);
    });

    series.data.setAll(seriesData);

    var legend = chart.children.push(
      am5.Legend.new(root, {
        fill: am5.color(signalObj.Color),
        color: am5.color(signalObj.Color),
        width: 50,
        height: 50,
        layout: root.horizontalLayout,
        // useDefaultMarker: true
      })
    );

    legend.data.setAll(chart.series.values);
    return { series: series, data: seriesData };
  },
};

export default UIReportes;
