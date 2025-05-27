import { EnumProyecto } from "../Utilities/Enums.js";
import { AppGraficador } from "./AppGraficador.js";
import { Reporteador } from "./Reporteador.js";

class PDFExporter {
    Exporting = null;
    ChartReference = null;
    TituloProyecto = null;
    FechaInicial = null;
    FechaFinal = null;
    IdSegnales = null;
    _instance = null;
    scale_graph = 0.5;
    scale_header = 0.20;

    // Configuración de estilos
    STYLES = {
        header: {
            margin: [40, -15, 40, 10], // [left, top, right, bottom]
            width: 3334 * this.scale_header,
            height: 215 * this.scale_header
        },
        title: {
            fontSize: 15,
            bold: true,
            margin: [40, 10, 40, 0],
            alignment: "center",
            color: "#2c3e50",
            font: "Roboto"
        },
        title2: {
            fontSize: 10,
            bold: true,
            margin: [40, 0, 40, 15],
            alignment: "center",
            color: "#2c3e50",
            font: "Roboto"
        },
        content: {
            margin: [80, 5, 40, 10],
            alignment: "left",
            fit: [1193 * this.scale_graph, 894 * this.scale_graph], // Mantiene relación de aspecto
        },
        page: {
            pageSize: "A4",
            pageOrientation: "landscape",
            pageMargins: [40, 40, 40, 40], // Márgenes más amplios
            defaultStyle: {
                font: "Roboto"
            }
        }
    };

    constructor() {
        this.Exporting = am5plugins_exporting.Exporting.new(Reporteador.Instance.root, {
            menu: am5plugins_exporting.ExportingMenu.new(Reporteador.Instance.root, {})
        });
    }

    static get INSTANCE() {
        if (!this._instance) {
            this._instance = new PDFExporter();
        }
        return this._instance;
    }

    async getFontBuffer(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return new Uint8Array(arrayBuffer);
    }

    getFormatoFecha(fechaISO) {
        var fechaISO_splitted = fechaISO.split('T');
        var anio_mes_dia = fechaISO_splitted[0].split('-')

        var anio = anio_mes_dia[0];
        var mes = anio_mes_dia[1];
        var dia = anio_mes_dia[2];

        var horas_minutos_segundos = fechaISO_splitted[1].split(':');
        var horas = horas_minutos_segundos[0];
        var minutos = horas_minutos_segundos[1];

        return `${anio}/${mes}/${dia} ${horas}:${minutos}`
    }

    async export() {
        this.Exporting = am5plugins_exporting.Exporting.new(Reporteador.Instance.root, {
            menu: am5plugins_exporting.ExportingMenu.new(Reporteador.Instance.root, {})
        });

        const pdfmakeInstance = await this.Exporting.getPdfmake();

        // Formatear título del reporte
        let titulo = `Reporte de ${this.TituloProyecto.replace(/([A-Z])/g, " $1").trim()}\r\n`;

        let nombreArchivo = `Reporte de `;
        // Se recorre idSignalsAGraficar
        Reporteador.Instance.idSignalsAGraficar.forEach((element, i) => {

            // Se valida que el index sea el ultimo de idSignalsAGraficar 
            if (i === Reporteador.Instance.idSignalsAGraficar.length - 1)
                // En caso de que se cumpla la condicion se concatena el id
                nombreArchivo += `${element.Nombre} `;
            else
                // En caso de que no se concatena el id y una coma
                nombreArchivo += `${element.Nombre}, `;
        });
        // Se concatena el intervalo de la fecha del reporte
        nombreArchivo += `de ${this.getFechaTitulo(Reporteador.Instance.fechaInicial)} a ${this.getFechaTitulo(Reporteador.Instance.fechaFinal)}`;
        nombreArchivo = `${nombreArchivo.replace(/([A-Z])/g, " $1").trim().replaceAll('.', '').replaceAll(' ', '_')}.pdf`
        

        let variables = ``;
        this.IdSegnales.forEach(element => {
            variables += `\t• ${element.Nombre}`;
        });
        variables += `\nPeríodo: ${this.getFormatoFecha(this.FechaInicial)} a ${this.getFormatoFecha(this.FechaFinal)}`;

        // Preparar gráfica
        let chart = document.getElementById("chartdiv");
        chart.style.backgroundColor = "white";
        const grafica = await this.Exporting.export("png");
        chart.style.backgroundColor = '#0b0a0d';

        // Configuración del documento
        let configuracionDocumento = {
            ...this.STYLES.page,
            content: [
                // Header institucional
                {
                    image: this.obtenerHeader(),
                    ...this.STYLES.header
                },

                // Título del reporte
                {
                    text: titulo,
                    ...this.STYLES.title
                },

                // variables del reporte
                {
                    text: variables,
                    ...this.STYLES.title2
                },

                // Contenido (gráfica)
                {
                    image: grafica,
                    ...this.STYLES.content,
                },

                // Pie de página (opcional)
                {
                    text: "© " + new Date().getFullYear() + " - Todos los derechos reservados",
                    alignment: "center",
                    fontSize: 10,
                    color: "#7f8c8d",
                    margin: [0, 5, 0, 0]
                }
            ],

            // Estilos personalizados para reutilizar
            styles: {
                headerStyle: {
                    fontSize: 12,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                }
            }
        };

        pdfmakeInstance.createPdf(configuracionDocumento)
            .download(`${nombreArchivo.replace(/[\s,]+/g, '_')}.pdf`);

    }

    obtenerHeader() {
        switch (AppGraficador.Instance.IdProyecto) {
            case EnumProyecto.PozosPAI:
                return OCAVAM_Cybercom.Logo;
            case EnumProyecto.LineaMorada:
                return AguaDePuebla_VWC.Logo;
            default:
                return AguaDePuebla.Logo;
        }
    }

    async fileToDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    descargarPDF(chartReference, TituloProyecto, FechaInicial, FechaFinal, IdSegnalesSeleccionadas) {
        this.ChartReference = chartReference;
        this.TituloProyecto = TituloProyecto;
        this.FechaInicial = FechaInicial;
        this.FechaFinal = FechaFinal;
        this.IdSegnales = IdSegnalesSeleccionadas;
        this.export();
    }

    getFechaTitulo(fechaOriginal) {
        // Extraemos los componentes de la fecha
        const [fecha, hora] = fechaOriginal.split('T');
        const [anio, mes, dia] = fecha.split('-');
        const [hh, mm] = hora.split(':');

        // Formateamos con guiones bajos
        return `${anio}_${mes}_${dia}_${hh}h${mm}min`;
    }
}

export { PDFExporter };