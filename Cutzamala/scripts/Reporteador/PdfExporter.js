import UIReportes from "./UIReportes.js";

class PDFExporter {
    Exporting = null;
    ChartReference = null;
    TituloProyecto = null;
    FechaInicial = null;
    FechaFinal = null;
    IdSegnales = null;
    _instance = null;
    constructor() {
        // this.Exporting = am5plugins_exporting.Exporting.new(UIReportes.root, {
        //     menu: am5plugins_exporting.ExportingMenu.new(UIReportes.root, {})
        // })
    }
    /**
     * Retorna la instance
     * @returns {PDFExporter}
     */
    static get INSTANCE() {
        if (!this._instance) {
            this._instance = new PDFExporter()
        }
        return this._instance;
    }
    async export() {
        this.Exporting = am5plugins_exporting.Exporting.new(UIReportes.root, {
            menu: am5plugins_exporting.ExportingMenu.new(UIReportes.root, {})
        })
        // se obtiuene referencia a pdfmake
        const pdfmakeInstance = await this.Exporting.getPdfmake();
        // Variable para el nombre del reporte
        let name = `Reporte de ${this.TituloProyecto} `;

        // Se recorre IdSegnalesSeleccionadas y se concatena el id al nombre del reporte
        this.IdSegnales.forEach(element => {
            name += `${element.Nombre} `;
        });

        // Se concatena el intervalo de la fecha del reporte
        name += `de ${this.FechaInicial.toISOString()} a ${this.FechaFinal.toISOString()}`

        // Se obtine el elemto del HTML
        let chart = document.getElementById("chartdiv");
        // Se colocan estilos al elemento
        chart.style.backgroundColor = "white";

        const image = await this.Exporting.export("png");

        // Se coloca el estilo de backgroun al elemento
        chart.style.backgroundColor = '#0b0a0d';
        // Se guarda el primer elemento de la instancia        

        let configuracionDocumento = {
            pageSize: "A4",
            pageOrientation: "landscape",
            pageMargins: [10, 10, 30, 10],
            content: [],
        };

        // Se colcan las imagenes en el documento
        configuracionDocumento.content.push({ // CDMX
            image: "data:image/png;base64,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",
            margin: [20, 0, 0, 0],
            width: 50,
            height: 50,
        });

        configuracionDocumento.content.push({ // SACMEX
            image: "data:image/png;base64,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",
            margin: [80, -50, 0, 0],
            width: 50,
            height: 50,
        });

        configuracionDocumento.content.push({ // VWC
            image: "data:image/png;base64,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",
            margin: [140, -50, 0, 0],
            width: 50,
            height: 50,
        });

        configuracionDocumento.content.push({
            text: name,
            fontSize: 12,
            margin: [230, -30, 0, 0],
            alignment: "left"
        });

        configuracionDocumento.content.push({
            image: image,
            margin: [0, 30, 0, 0],
            width: 800,
            height: 480,
            alignment: "center"
        });
        pdfmakeInstance.createPdf(configuracionDocumento).download(`${name.replaceAll(' ', '_').replaceAll(',', '_')}.pdf`);
    }
    descargarPDF(chartReference, TituloProyecto, FechaInicial, FechaFinal, IdSegnalesSeleccionadas) {
        this.ChartReference = chartReference;
        this.TituloProyecto = TituloProyecto;
        this.FechaInicial = FechaInicial;
        this.FechaFinal = FechaFinal;
        this.IdSegnales = IdSegnalesSeleccionadas;
        this.export();
    }
}

export { PDFExporter }