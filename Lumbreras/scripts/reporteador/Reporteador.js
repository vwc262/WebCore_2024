import { EnumControllerHistorial, EnumTipoSignal, RequestType } from "../Utilities/Enums.js";
import { AppGraficador } from "./AppGraficador.js";
import { APIGraficador } from "./APIGraficador.js";

/**
 * Antes Core
 */
class Reporteador {

    static #_instance = undefined;

    /**
     * @returns {Reporteador}
     */
    static get Instance() {
        if (!this.#_instance) {
            this.#_instance = new Reporteador();
        }
        return this.#_instance;
    }

    root = undefined;
    #fetchedSignals = 0;
    chartRef = {};

    get ResourcesPath() {
        return `https://virtualwavecontrol.com.mx/RecursosWeb/GraficadorMobile`;
    }

    coloresSignals = [
        '#1f77b4',
        '#ff7f0e',
        '#2ca02c',
        '#d62728',
        '#9467bd',
        '#8c564b',
        '#e377c2',
        '#7f7f7f',
        '#bcbd22',
        '#17becf',
    ];

    tipoSignalName = {
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
        13: "Poleo",
        14: "Mantenimiento",
        15: "Puerta Abierta",
        16: "Voltaje Rango",
        17: "Corriente Rango",
        18: "Potencia Total",
        19: "Factor Potencia",
        20: "Precipitacion ",
        21: "Temperatura",
        22: "Humedad",
        23: "Evaporacion",
        24: "Intensidad",
        25: "Direccion"
    };

    unidades = {
        1: "m",
        2: "kg/cm",
        3: "l/s",
        4: "m",
        10: "V"
    };

    fechaInicial = '';
    fechaFinal = '';
    idSignalsAGraficar = [];
    idSignasNoData = [];

    data = [];
    dataCruda = [];

    constructor() {
        this.setFechas(new Date(), new Date());
    }

    setFechas(minDate, maxDate) {

        const offsetMinutes = new Date().getTimezoneOffset();

        minDate.setHours(0);
        minDate.setMinutes(0);
        minDate.setSeconds(0);
        minDate.setMilliseconds(0);
        const adjustedDateI = new Date(minDate.getTime() - offsetMinutes * 60000);
        this.fechaInicial = adjustedDateI.toISOString().replace("Z", "");

        maxDate.setHours(23);
        maxDate.setMinutes(59);
        maxDate.setSeconds(59);
        maxDate.setMilliseconds(999);
        const adjustedDateF = new Date(maxDate.getTime() - offsetMinutes * 60000);
        this.fechaFinal = adjustedDateF.toISOString().replace("Z", "");
    }

    setFechasWhitTime(minDate, maxDate, minHour, maxHour, minMinute, maxMinute) {

        const offsetMinutes = new Date().getTimezoneOffset();

        minDate.setHours(minHour);
        minDate.setMinutes(minMinute);
        minDate.setSeconds(0);
        minDate.setMilliseconds(0);
        const adjustedDateI = new Date(minDate.getTime() - offsetMinutes * 60000);
        this.fechaInicial = adjustedDateI.toISOString().replace("Z", "");

        maxDate.setHours(maxHour);
        maxDate.setMinutes(maxMinute);
        maxDate.setSeconds(59);
        maxDate.setMilliseconds(999);
        const adjustedDateF = new Date(maxDate.getTime() - offsetMinutes * 60000);
        this.fechaFinal = adjustedDateF.toISOString().replace("Z", "");
    }

    /** Peticion a la base de datos con los parametros preseleccionados */
    async fetchData() {

        this.dataCruda = [];
        this.idSignasNoData = [];
        this.#fetchedSignals = 0;
        const date = new Date();
        this.root?.dispose();
        this.root = am5.Root.new("chartdiv", {
        });

        this.idSignalsAGraficar.forEach(async signal => {

            const data = {
                idSignal: signal.IdSignal,
                fechaInicial: this.fechaInicial,
                fechaFinal: this.fechaFinal,
            };

            const jsonData = await APIGraficador.Instance.request(`${EnumControllerHistorial.READ}?idProyecto=${AppGraficador.Instance.IdProyecto}`, RequestType.POST, data, true);
            if (jsonData.length > 0) {
                this.dataCruda.push(jsonData);
            } else {
                this.idSignasNoData.push(signal.IdSignal);
            }

            this.#fetchedSignals++;
        });

        let interval = setInterval(() => {
            if (this.idSignalsAGraficar.length == this.#fetchedSignals) {
                clearInterval(interval);

                //this.removerSignalsSinData();
                this.procesarInformacion();
            } else {
                if (new Date().getTime() - date.getTime() > 1000 * 10 * 1) {
                    clearInterval(interval);
                    AppGraficador.Instance.chartdivContainer.style.display = 'none';
                    AppGraficador.Instance.noDatadiv.style.display = 'flex';
                }
            }
        }, 200);

    }

    removerSignalsSinData() {
        this.idSignasNoData.forEach(IdSignal => {
            const index = Reporteador.Instance.idSignalsAGraficar.findIndex(s => s.IdSignal == IdSignal);
            const signal = Reporteador.Instance.idSignalsAGraficar[index];
            let id = `e_${signal.IdEstacion}_s_${signal.IdSignal}`;

            let btn = document.getElementById(id);
            if (btn != undefined || btn != null) btn.classList = 'bntSignal signalNA';

            AppGraficador.Instance.buttonSignalsSelected.splice(id, 1);
            Reporteador.Instance.idSignalsAGraficar.splice(index, 1);
            AppGraficador.Instance.segnales_graficacion_dinamicas.removeChild(AppGraficador.Instance.segnales_graficacion_dinamicas.children[index]);
        });
    }

    procesarInformacion() {
        //  remove all elements from the root, simply clear children of its container
        this.root.container.children.clear();

        if (this.dataCruda.length > 0) {

            AppGraficador.Instance.chartdivContainer.style.display = 'flex';
            AppGraficador.Instance.noDatadiv.style.display = 'none';

            let aux = [];
            this.dataCruda.forEach((infoSignal) => {
                infoSignal.forEach((d, index) => {
                    // let _d = new Date(new Date(d.tiempo).setSeconds(0));
                    // let minutos = _d.getMinutes();
                    // let minutosRedondeados = Math.round(minutos / 5) * 5
                    // _d.setMinutes(minutosRedondeados);

                    let _d = new Date(new Date(d.tiempo))

                    if (
                        this.data[_d] == undefined ||
                        this.data[_d] == null
                    ) {
                        this.data[_d] = {
                            date: _d,
                        };
                        aux.push(this.data[_d]);
                    }
                    this.data[_d][d.idSignal] = d.valor < 0 ? 0 : d.valor;
                    if (this.idSignalsAGraficar.find(s => s.IdSignal == d.idSignal).IdTipoSignal == EnumTipoSignal.Bomba) {
                        this.data[_d][d.idSignal] = d.valor == 1 ? 2 : d.valor == 2 ? 1 : d.valor;
                    }
                });
            });

            aux.sort((a, b) => new Date(a.date) - new Date(b.date));
            this.data = aux;
            this.plot();

            AppGraficador.Instance.containerPDF.style.display = 'flex';
            AppGraficador.Instance.containerCSV.style.display = 'flex';
        }
        else {
            AppGraficador.Instance.containerPDF.style.display = 'none';
            AppGraficador.Instance.containerCSV.style.display = 'none';

            AppGraficador.Instance.chartdivContainer.style.display = 'none';
            AppGraficador.Instance.noDatadiv.style.display = 'flex';
        }
    }

    plot() {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/root_element

        var root = this.root;

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
            })
        );

        chart.get("colors").set("step", 3);

        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var xAxis = chart.xAxes.push(
            am5xy.DateAxis.new(root, {
                maxDeviation: 0.1,
                groupData: true,
                baseInterval: {
                    timeUnit: "minute",
                    count: 1,
                },
                renderer: am5xy.AxisRendererX.new(root, {
                    // minGridDistance: 80,
                    minorGridEnabled: true,
                }),
                dateFormats: {
                    day: "dd MMM",
                    hour: "dd MMM HH:mm",
                    minute: "dd MMM HH:mm",
                },
                // Formatos cuando el usuario cambia el zoom (periodChange)
                periodChangeDateFormats: {
                    day: "dd MMM",
                    hour: "dd MMM HH:mm",
                    minute: "dd MMM HH:mm",
                },
                tooltip: am5.Tooltip.new(root, {}),
            })
        );


        // Forzar la actualización del eje
        xAxis.get("renderer").labels.template.adapters.add("text", function (text, target) {

            const en_months = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            const es_months = [
                "Ene", "Feb", "Mar", "Abr", "May", "Jun",
                "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
            ];

            if (text != undefined) {
                const splitted = text.split(' ');

                if (splitted.length > 2) {

                    var m = splitted[1];
                    var i = en_months.indexOf(m);
                    var esp = m;

                    if (i >= 0) {
                        esp = es_months[i];
                    }

                    return `${ splitted[0] } ${ esp } ${ splitted[2] }`;
                } else {
                    return `${ text }`;
                }
            }

            return '';
        });

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
                maxDeviation: 0.1,
                groupData: true,
                baseInterval: {
                    timeUnit: "minute",
                    count: 1,
                },
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

        this.idSignalsAGraficar.forEach((signalObj) => {

            if (yRenderer[signalObj.IdTipoSignal] == undefined) {
                yRenderer[signalObj.IdTipoSignal] = am5xy.AxisRendererY.new(root, {
                    opposite: false,
                });
            }

            this.CreateYAxis(
                chart,
                root,
                yRenderer[signalObj.IdTipoSignal],
                yAxis,
                signalObj
            );
            var props = this.CreateSeries(
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

        this.chartRef = chart;

        chart.appear(1000, 100);

        setTimeout(() => {
            AppGraficador.Instance.scaleDocument();
        }, 100);
    }

    AjustarChart() {
        const container = document.getElementById("chartdiv");
        var aria = container.querySelector('div[aria-hidden="true"]');

        if (aria != null) {

            var canvas = aria.children[0].children[0];

            var widthChart = this.chartRef.width();
            var heightChart = this.chartRef.height();

            var widthCanvas = canvas.getBoundingClientRect().width;
            var heightCanvas = canvas.getBoundingClientRect().height;

            var factorWidth = 1 - (widthCanvas / widthChart);
            var factorHeight = 1 - (heightCanvas / heightChart);

            // container.firstChild.style.transform = `scaleX(${(1 + factorWidth) * ((1 + 1 - AppGraficador.Instance.actualWidthFactor) * (AppGraficador.Instance.actualFactor > 0.55 ? 0.85 : 0.98))}) scaleY(${(1 + factorHeight) * ((1 + 1 - AppGraficador.Instance.actualHeightFactor) * (AppGraficador.Instance.actualFactor > 0.55 ? 0.85 : 0.98))})`;
            container.firstChild.style.transform = `scaleX(0.5) scaleY(0.5)`;
        }
    }

    CreateYAxis(chart, root, yRenderer, yAxis, signalObj) {
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
                        let textoAPoner = '';
                        let value = parseInt(text);
                        switch (value) {
                            case 0:
                                textoAPoner = 'Mto';
                                break;
                            case 1:
                                textoAPoner = 'Off';
                                break;
                            case 2:
                                textoAPoner = 'On';
                                break;
                            case 3:
                                textoAPoner = 'F';
                                break;
                        }
                        return text % 1 != 0 ? '' : textoAPoner;
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
    }

    GetSignalNameByTipoSignal(tipoSignal) {
        return this.tipoSignalName[tipoSignal];
    }

    SetUnities(idTipoSignal) {
        let unidades = this.unidades[idTipoSignal] ?? '';
        switch (idTipoSignal) {
            case 2:
                unidades += "[baseline-shift:super;font-size:10]2"
                break;
            case 4:
                unidades += "[baseline-shift:super;font-size:10]3"
                break;
        }
        return unidades;
    }

    VWCTextValueFormatter(valueY, tipoSignal) {
        let valor = valueY;

        if (tipoSignal == EnumTipoSignal.Enlace) {
            switch (valueY) {
                case 0: valor = `Fuera de línea |${valueY}|`; break;
                case 1: valor = `En línea Radio |${valueY}|`; break;
                case 2: valor = `En línea Celular |${valueY}|`; break;
                case 3: valor = `En línea Radio - Celular |${valueY}|`; break;

                default: valor = `N/A |${valueY}|`; break;
            }
        } else if (tipoSignal == EnumTipoSignal.Tiempo) {
            switch (valueY) {

                case 10: valor = `Infinitum |${valueY}|`; break;
                case 11: valor = `Backup Celular |${valueY}|`; break;
                case 12: valor = `Directo Satélite |${valueY}|`; break;
                case 13: valor = `Error Directo Satélite |${valueY}|`; break;
                case 14: valor = `Directo Celular |${valueY}|`; break;
                case 15: valor = `Error Directo Celular |${valueY}|`; break;

                case 19: valor = `SIN CONEXIÓN |${valueY}|`; break;

                default: valor = `N/A |${valueY}|`; break;
            }
        }

        return valor;
    }

    CreateSeries(chart, root, yRenderer, xAxis, yAxis, signalObj) {
        let tooltip = am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            // labelText: `{name} : {valueY} ${this.SetUnities(signalObj.IdTipoSignal)}`,
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

        series.get("tooltip").label.adapters.add("text", function (text, target) {
            text = "";
            var tooltipDataItem = series?.get("tooltipDataItem");
            text += `${series?.get("name")} : ${Reporteador.Instance.VWCTextValueFormatter(tooltipDataItem?.get("valueY"), signalObj.IdTipoSignal)} ${Reporteador.Instance.SetUnities(signalObj.IdTipoSignal)}`; // Edit the text as per requirement.
            return text
        });

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
        Object.values(this.data).forEach(k => {
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
    }

}

export { Reporteador };