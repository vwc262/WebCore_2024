import { EnumControllerMapeo, EnumProyecto, EnumTipoSignal, RequestType } from "../Utilities/Enums.js";
import { Reporteador } from "./Reporteador.js";
import { ControladorCSV } from "./CSVController.js";
import { PDFExporter } from "./PdfExporter.js";
import { APIGraficador } from "./APIGraficador.js";
import { Core } from "../Core.js";

class AppGraficador {

    static #_instance = undefined;

    /**
     * @returns {AppGraficador}
     */
    static get Instance() {
        if (!this.#_instance) {
            this.#_instance = new AppGraficador();
        }
        return this.#_instance;
    }

    IdProyecto = Core.Instance.IdProyecto;
    maxVariablesGraficar = 6;
    buttonSignalsSelected = [];
    actualWidthFactor = 0.0;
    actualHeightFactor = 0.0;
    actualFactor = 0.0;
    idRow = 0;
    rowInput;
    rowSeleccionada = "";
    btnSeleccionado;
    rowsEstations = [];
    idSeleccionado = 0;
    segnales_graficacion_dinamicas_dic = {};

    minDate;
    maxDate;
    auxDate;
    fechaIzquierda = true;
    porHoraCheck = false;
    dia;
    mes;
    anio;
    maxHora = 23;
    maxMinutes = 59;
    minHora = 0;
    minMinutes = 0;

    constructor() { }

    async fetchEstaciones() {
        const estaciones = await APIGraficador.Instance.request(`${EnumControllerMapeo.READ}?idProyecto=${this.IdProyecto}`,
            RequestType.GET,
            undefined,
            false);

        this.estaciones = estaciones;
    }

    async Start() {

        let d = new Date();
        AppGraficador.Instance.minDate = d;
        AppGraficador.Instance.maxDate = d;
        let maxD = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${(d.getDate()).toString().padStart(2, '0')}`;
        let minD = AppGraficador.Instance.minDate;

        const options = {
            type: 'default',
            months: 1,
            jumpMonths: 1,
            settings: {
                range: {
                    disablePast: false,
                },
                selection: {
                    day: 'single',
                },
                lang: 'es', // Cambia el idioma a español
                iso8601: false, // Inicia la semana en lunes (ISO 8601)
                visibility: {
                    monthShort: true, // Nombres de meses completos
                    weekNumbers: false, // Muestra números de la semana
                    weekend: false, // Resalta los fines de semana
                },
            },
            dateToday: 'today',
            actions: {
                clickDay(event, self) {
                    // self.classList.remove('selected')
                    console.log(this)
                    let d = new Date();
                    let dates = self.selectedDates.map(_date => {
                        let _d = d;

                        if (_date != undefined) {

                            let string_splitted = _date.split('-');
                            let year = string_splitted[0];
                            let month = parseInt(string_splitted[1] - 1);
                            let day = string_splitted[2];

                            this.anio = year;
                            this.mes = month;
                            this.dia = day;

                            _d = new Date(Date.UTC(year, month, day, d.getHours(), d.getMinutes(), 0, 0))
                        }

                        return _d;
                    });

                    /* ================ Validaciones para la seleccion de fechas ================ */
                    // Validacion por si se selecciona la fecha inicial
                    if (AppGraficador.Instance.fechaIzquierda) {
                        // Si fue la segunda en seleccionar y se selecciono el mismo dia validamos que Dates tenga valor
                        if (dates.length > 0) {
                            AppGraficador.Instance.minDate = new Date(Math.min(...dates));
                            minD = AppGraficador.Instance.minDate;
                            AppGraficador.Instance.dateLeft.value = `${minD.getFullYear()}-${(minD.getMonth() + 1).toString().padStart(2, '0')}-${(minD.getDate()).toString().padStart(2, '0')}`;
                        }
                        // En caso de que no tenga valor se le asigna el valor final al valor inicial
                        else {
                            AppGraficador.Instance.minDate = AppGraficador.Instance.maxDate;
                            minD = AppGraficador.Instance.minDate;
                            AppGraficador.Instance.dateLeft.value = `${minD.getFullYear()}-${(minD.getMonth() + 1).toString().padStart(2, '0')}-${(minD.getDate()).toString().padStart(2, '0')}`;
                        }
                        Reporteador.Instance.setFechas(AppGraficador.Instance.minDate, AppGraficador.Instance.maxDate);
                        this.minDate = AppGraficador.Instance.minDate;
                    }
                    // Validaciones por si se selecciona la fecha final
                    else {
                        // Si fue la segunda en seleccionar y se selecciono el mismo dia validamos que Dates tenga valor
                        if (dates.length > 0) {
                            AppGraficador.Instance.maxDate = new Date(Math.max(...dates));
                            // Validamos que la fecha final sea mayor a la inicial
                            if (AppGraficador.Instance.maxDate > AppGraficador.Instance.minDate) {
                                maxD = AppGraficador.Instance.maxDate;
                                AppGraficador.Instance.dateRigth.value = `${maxD.getFullYear()}-${(maxD.getMonth() + 1).toString().padStart(2, '0')}-${(maxD.getDate()).toString().padStart(2, '0')}`;
                            }
                            // en caso de que la fecha final no sea mayor a la inicial
                            else {
                                AppGraficador.Instance.auxDate = AppGraficador.Instance.maxDate; // Guardamos la fecha seleccionada
                                AppGraficador.Instance.maxDate = AppGraficador.Instance.minDate; // Le pasamos el valor de la fecha mayor a la fecha final
                                AppGraficador.Instance.minDate = AppGraficador.Instance.auxDate; // Y guardamos el valor de la fecha seleccionada en la fecha final

                                minD = AppGraficador.Instance.minDate;
                                AppGraficador.Instance.dateRigth.value = AppGraficador.Instance.dateLeft.value;
                                AppGraficador.Instance.dateLeft.value = `${minD.getFullYear()}-${(minD.getMonth() + 1).toString().padStart(2, '0')}-${(minD.getDate()).toString().padStart(2, '0')}`;
                            }
                            Reporteador.Instance.setFechas(AppGraficador.Instance.minDate, AppGraficador.Instance.maxDate);
                        }
                        // n caso de que no tenga valor se le asigna el valor inicial al valor final
                        else {
                            AppGraficador.Instance.dateRigth.value = `${minD.getFullYear()}-${(minD.getMonth() + 1).toString().padStart(2, '0')}-${(minD.getDate()).toString().padStart(2, '0')}`;
                            Reporteador.Instance.setFechas(AppGraficador.Instance.minDate, AppGraficador.Instance.minDate);
                        }
                    }

                    AppGraficador.Instance.calendarioDate.style.display = "none";
                },
            },
            date: {
                min: `2024-01-01`,
                max: maxD,
                selected: {
                    dates: [new Date().toISOString().split('T')[0]], // Fecha actual en formato YYYY-MM-DD
                    month: new Date().getMonth(), // Mes actual (0-11)
                    year: new Date().getFullYear() // Año actual
                }
            },
        };

        const calendar = new VanillaCalendar('#calendar', options);
        calendar.init();

        this.fetchEstaciones();
        this.GetReferences();
        this.setDateTime();

        this.dateLeft.value = maxD;
        this.dateRigth.value = maxD;

        let interval = setInterval(() => {

            if (this.estaciones != undefined && this.estaciones.length > 0) {
                clearInterval(interval);

                // this.GetReferences();
                this.AsignacionEventos();
            }
        }, 200);

        const mostarSignals = document.getElementsByClassName("mostarSignal");
        for (let i = 0; i < mostarSignals.length; i++) {
            mostarSignals[i].addEventListener("click", (e) => {
                e.target.textContent = e.target.textContent == "+" ? "-" : "+";
                this.habilitarRow(i + 1)
                AppGraficador.Instance.btnSeleccionado = e.target;
            });
        }

        window.addEventListener("resize", this.scaleDocument);
        this.scaleDocument();
    }

    setDateTime() {
        for (var i = 0; i < 25; i++) {
            const option1 = document.createElement('option')
            option1.text = i < 10 ? `0${i}` : i;
            option1.id = `h1_${i}`;

            const option2 = document.createElement('option')
            option2.text = i < 10 ? `0${i}` : i;
            option2.id = `m1_${i}`;

            this.FirstHours.append(option1);
            this.SecondHours.append(option2);
        }

        for (var i = 0; i < 65; i += 5) {
            const option1 = document.createElement('option')
            option1.text = i < 10 ? `0${i}` : i;
            option1.id = `h2_${i}`;

            const option2 = document.createElement('option')
            option2.text = i < 10 ? `0${i}` : i;
            option2.id = `m2_${i}`;

            this.FirstMinuts.append(option1);
            this.SecondMinuts.append(option2);
        }

        this.SecondHours.value = 24;
        this.SecondMinuts.value = 60;
    }

    scaleDocument() {

        const contentWidth = 1920;
        const contentHeight = 1080;

        let currentScreenWidth = window.innerWidth;
        let currentScreenHeight = window.innerHeight;

        let widthScale = (currentScreenWidth / contentWidth).toFixed(3);
        let heightScale = (currentScreenHeight / contentHeight).toFixed(3);

        let body = document.getElementsByTagName('body')[0];

        if (widthScale > heightScale) {
            let margin = (currentScreenWidth - (contentWidth * heightScale)) / 2;
            body.style = `transform: scale(${(heightScale)}); margin: 0px 0px 0px ${margin}px; transform-origin: left top; width: 1920px; height: 1080px;`;
        }
        else
            body.style = `transform: scale(${widthScale}); margin: 0px 0px 0px 0px; transform-origin: left top; width: 1920px; height: 1080px;`;


        Reporteador.Instance.AjustarChart();
    }

    GetReferences() {
        this.graficarBtn = document.getElementById('graficar');
        this.borrarBtn = document.getElementById('borrar');
        this.csvBtn = document.getElementById('descargarCSV');
        this.containerCSV = document.getElementById('containerCSV');
        this.pdfBtn = document.getElementById('descargarPDF');
        this.containerPDF = document.getElementById('containerPDF');
        this.regresarBtn = document.getElementById('regresar');
        this.searchImg = document.getElementById('searchImg');

        this.menuChart = document.getElementById('menu_chart');
        this.pantallaPrincipal = document.getElementById('pantalla_inicial');

        this.chartdiv = document.getElementById('chartdiv');
        this.chartdivContainer = document.getElementsByClassName('chartdivContainer')[0];
        this.noDatadiv = document.getElementById('noDatadiv');

        this.segnales_graficacion_dinamicas = document.getElementsByClassName('segnales_graficacion_dinamicas')[0];

        // this.inputSearch = document.getElementById("search");
        this.lista_sitios = document.getElementById('lista_sitios');

        this.menu_fechas = document.getElementsByClassName('menu_fechas')[0];
        this.menu_estacion = document.getElementsByClassName('menu_estacion')[0];
        this.menu_signals = document.getElementsByClassName('menu_signals')[0];

        this.contenedor_lista_sitios = document.getElementsByClassName('contenedor_lista_sitios')[0];
        this.contenedor_signals = document.getElementsByClassName('contenedor_signals')[0];
        this.headerParametros = document.getElementById('headerParametros');
        this.headerSignalsParametros = document.getElementById('headerSignalsParametros');
        this.btnCerrarSignals = document.getElementById('btnCerrarSignals');

        this.dateLeft = document.getElementById('dateLeft');
        this.dateRigth = document.getElementById('dateRigth');
        this.dateDRigth = document.getElementById('dateDRigth');
        this.FirstHours = document.getElementById('FirstHours');
        this.FirstMinuts = document.getElementById('FirstMinuts');
        this.SecondHours = document.getElementById('SecondHours');
        this.SecondMinuts = document.getElementById('SecondMinuts');
        this.porHora = document.getElementById('porHora');
        this.Date_Time = document.getElementsByClassName('Date_Time')[0];
        this.calendarioDate = document.getElementById('calendarioDate');

        this.popUpAceptar = document.getElementById('popUpAceptar');
        this.popUpContainer = document.getElementById('popUpContainer');

        this.NombreEstacionA = "";
    }

    AsignacionEventos() {

        this.regresarBtn.style.background = `url(${Reporteador.Instance.ResourcesPath}/Reportes/btn_Volver.png?)`;
        this.csvBtn.style.background = `url(${Reporteador.Instance.ResourcesPath}/Reportes/btn_csv.png?)`;
        this.pdfBtn.style.background = `url(${Reporteador.Instance.ResourcesPath}/Reportes/btn_pdf.png?)`;
        this.porHora.style.background = `url(${Reporteador.Instance.ResourcesPath}/General/check_a.png?)`;
        this.btnCerrarSignals.style.background = `url(${Reporteador.Instance.ResourcesPath}/General/btn_cerrar.png?)`;

        this.graficarBtn.addEventListener('click', function (event) {
            Reporteador.Instance.fetchData();
        });

        this.regresarBtn.addEventListener('click', function (event) {
            window.close();
        });

        this.borrarBtn.addEventListener('click', function (event) {

            Reporteador.Instance.idSignalsAGraficar.forEach((IdSignal, index) => {

                const signal = Reporteador.Instance.idSignalsAGraficar[index];
                let id = `e_${signal.IdEstacion}_s_${signal.IdSignal}`;

                let btn = document.getElementById(id);
                if (btn != undefined || btn != null) btn.classList = 'bntSignal signalNA';
            });

            AppGraficador.Instance.segnales_graficacion_dinamicas.innerHTML = '';
            AppGraficador.Instance.segnales_graficacion_dinamicas_dicL = {};
            this.cerrarPaneldeSitios

            Reporteador.Instance.idSignalsAGraficar = [];
            AppGraficador.Instance.buttonSignalsSelected = [];

        });

        this.csvBtn.addEventListener('click', (event) => {
            this.popUpContainer.style.display = "flex";
            ControladorCSV.ObtenerCSV(Reporteador.Instance, Reporteador.Instance.idSignalsAGraficar.Nombre, Reporteador.Instance.fechaInicial, Reporteador.Instance.fechaFinal, Reporteador.Instance.idSignalsAGraficar);
        });

        this.pdfBtn.addEventListener('click', (event) => {
            this.popUpContainer.style.display = "flex";
            PDFExporter.INSTANCE.descargarPDF(Reporteador.Instance.root, AppGraficador.Instance.GetNombreProyecto(), Reporteador.Instance.fechaInicial, Reporteador.Instance.fechaFinal, Reporteador.Instance.idSignalsAGraficar);
        });

        this.graficarBtn.style.background = `url(${Reporteador.Instance.ResourcesPath}/General/boton_graficador.png?)`;
        this.borrarBtn.style.background = `url(${Reporteador.Instance.ResourcesPath}/General/boton_basura.gif?)`;

        this.estaciones.forEach(estacion => {

            const id_est = document.createElement('div');
            id_est.classList = 'id_est';
            id_est.innerHTML = `${estacion.idEstacion}`;

            const nombre_est = document.createElement('div');
            nombre_est.classList = 'nombre_est';
            nombre_est.innerHTML = `${estacion.nombre}`;

            const rowEstacion = document.createElement('div');
            rowEstacion.classList = 'rowEstacion';

            rowEstacion.append(id_est);
            rowEstacion.append(nombre_est);

            /* Nueva logica para agregar las signals*/
            const rowContenedor = document.createElement('div');
            rowContenedor.classList = "rowContenedor";
            rowContenedor.id = "menu_seleccion";

            const menu_seleccion = document.createElement('div');
            menu_seleccion.classList = "menu_seleccion";

            const contenedor_segnales_seleccion = document.createElement('div');
            contenedor_segnales_seleccion.classList = 'contenedor_segnales_seleccion';

            const signals_Contenedor = document.createElement('div');
            signals_Contenedor.classList = "signals_Contenedor";
            signals_Contenedor.id = `signals_Contenedor_${estacion.idEstacion}`;

            this.lista_sitios.append(rowContenedor);
            rowContenedor.append(rowEstacion)
            rowContenedor.append(menu_seleccion)

            menu_seleccion.append(contenedor_segnales_seleccion);
            contenedor_segnales_seleccion.append(signals_Contenedor);

            this.createSignalButtons(estacion.idEstacion);

            this.rowsEstations.push(rowContenedor);

            rowEstacion.addEventListener('click', e => {

                this.cerrarPaneldeSitios();
                contenedor_segnales_seleccion.style.display = "flex";
                rowEstacion.classList.add('rowEstacionSelected');
            });

        });

        this.dateLeft.addEventListener("click", () => {
            this.fechaIzquierda = true;
            this.calendarioDate.style.display = getComputedStyle(this.calendarioDate).display === "none" ? "flex" : "none";
        });

        this.dateRigth.addEventListener("click", () => {
            this.fechaIzquierda = false;
            this.calendarioDate.style.display = getComputedStyle(this.calendarioDate).display === "none" ? "flex" : "none";
        });

        this.porHora.addEventListener("click", e => {
            this.porHoraCheck = !this.porHoraCheck;
            var state = this.porHoraCheck == true ? "b" : "a";
            this.maxDate = this.minDate;
            this.maxDate.setHours(23);
            this.dateDRigth.style.display = this.porHoraCheck == true ? "none" : "inline";
            this.Date_Time.style.display = this.porHoraCheck == true ? "flex" : "none";
            this.porHora.style.background = `url(${Reporteador.Instance.ResourcesPath}/General/check_${state}.png?)`;

            this.dateRigth.value = this.dateLeft.value;
            Reporteador.Instance.setFechas(this.minDate, this.maxDate);

        });

        this.FirstHours.addEventListener("change", e => {
            this.minHora = e.target.value == 24 ? 23 : e.target.value;
            this.minMinutes = e.target.value == 24 ? 59 : this.minMinutes;
            this.minDate.setHours(e.target.value);
            Reporteador.Instance.setFechasWhitTime(this.minDate, this.minDate, this.minHora, this.maxHora, this.minMinutes, this.maxMinutes);
        })

        this.FirstMinuts.addEventListener("change", e => {
            this.minMinutes = this.FirstHours.value == 24 ? 59 : parseInt(e.target.value);
            this.minDate.setMinutes(e.target.value);
            Reporteador.Instance.setFechasWhitTime(this.minDate, this.minDate, this.minHora, this.maxHora, this.minMinutes, this.maxMinutes);
        })

        this.SecondHours.addEventListener("change", e => {
            this.maxHora = e.target.value == 24 ? 23 : e.target.value;
            this.maxMinutes = e.target.value == 24 ? 59 : this.maxMinutes;
            this.maxDate.setHours(e.target.value);
            Reporteador.Instance.setFechasWhitTime(this.minDate, this.minDate, this.minHora, this.maxHora, this.minMinutes, this.maxMinutes);
        })

        this.SecondMinuts.addEventListener("change", e => {
            this.maxMinutes = this.maxHora == 24 ? 59 : e.target.value;
            this.maxDate.setMinutes(e.target.value);
            Reporteador.Instance.setFechasWhitTime(this.minDate, this.minDate, this.minHora, this.maxHora, this.minMinutes, this.maxMinutes);
        })

        this.popUpAceptar.addEventListener("click", () => {
            this.popUpContainer.style.display = "none";
        })

        this.btnCerrarSignals.addEventListener("click", () => {
            const nameSignal = document.getElementById(`${this.rowSeleccionada}`);
            nameSignal.setAttribute("disabled", "disabled");
            this.btnSeleccionado.textContent = "+"

            this.contenedor_lista_sitios.style.display = "none";
            this.headerSignalsParametros.style.display = "none";
            this.contenedor_signals.style.display = "flex";
            this.headerParametros.style.display = "flex";
        })
    }

    cerrarPaneldeSitios() {
        const allRowEstaciones = this.rowsEstations.flatMap(r =>
            Array.from(r.querySelectorAll('.rowEstacion'))
        );

        this.rowsEstations.forEach((contenedor, index) => {
            const menuSeleccion = contenedor.querySelector('.menu_seleccion');
            menuSeleccion.querySelector('.contenedor_segnales_seleccion').style.display = 'none';
        });

        allRowEstaciones.forEach(row => row.classList.remove('rowEstacionSelected'));
    }

    habilitarRow(idRow) {
        const nameSignal = document.getElementById(`nameSignal_${idRow}`);
        const atributo = nameSignal.getAttribute("disabled");
        const isDisabled = atributo != null ? atributo === "disabled" : false;
        this.rowInput = nameSignal;
        this.rowSeleccionada = `nameSignal_${idRow}`;
        this.borrarSignal(idRow)

        if (isDisabled)
            nameSignal.removeAttribute("disabled");
        else
            nameSignal.setAttribute("disabled", "disabled");

        // nameSignal.addEventListener('click', e => {

        //     this.borrarSignal(idRow)
        //     this.rowInput = nameSignal;
        //     this.contenedor_signals.style.display = "none";

        //     this.contenedor_lista_sitios.style.display = "flex";
        //     this.rowSeleccionada = `nameSignal_${idRow}`;
        // });

        this.contenedor_lista_sitios.style.display = isDisabled == true ? "flex" : "none";
        this.headerSignalsParametros.style.display = isDisabled == true ? "flex" : "none";
        this.contenedor_signals.style.display = isDisabled == true ? "none" : "flex";
        this.headerParametros.style.display = isDisabled == true ? "none" : "flex";
    }

    borrarSignal(idRow) {
        this.cerrarPaneldeSitios();
        const btnSelected = document.getElementById(this.segnales_graficacion_dinamicas_dic[idRow]);

        if (btnSelected != null) {
            this.segnales_graficacion_dinamicas_dic[idRow] = null;
            const _idIgnalAu = btnSelected.IdSignal;
            const _indexAu = Reporteador.Instance.idSignalsAGraficar.findIndex(s => s.IdSignal == _idIgnalAu);
            Reporteador.Instance.idSignalsAGraficar.splice(_indexAu, 1);
            btnSelected.classList = 'bntSignal signalNA';
            btnSelected.style.backgroundColor = "transparent";
            this.rowInput.value = "";
        }
    }

    createSignalButtons(idEstacion) {
        const estacion = this.estaciones.filter(e => e.idEstacion == idEstacion)[0];
        const segnales_seleccion_con = document.getElementById(`signals_Contenedor_${idEstacion}`);

        let EnumTipoSignalString = Object.keys(EnumTipoSignal);
        var segnales_seleccion = segnales_seleccion_con;
        segnales_seleccion.innerHTML = '';

        estacion.signals.filter(s => s.tipoSignal != EnumTipoSignal.Mantenimiento
            && s.tipoSignal != EnumTipoSignal.PerillaBomba
            && s.tipoSignal != EnumTipoSignal.PerillaGeneral
            && s.tipoSignal != EnumTipoSignal.Enlace
            && s.tipoSignal != EnumTipoSignal.FallaAC
            && s.tipoSignal != EnumTipoSignal.PuertaAbierta
            && s.tipoSignal != EnumTipoSignal.Tiempo
        ).forEach(s => {
            const label_signal = document.createElement('div');
            label_signal.classList = `label_signal_seleccion`;
            label_signal.innerHTML = `${s.tipoSignal == EnumTipoSignal.Tiempo ? 'Poleo' : s.nombre}`;

            const ico_signal = document.createElement('img');
            ico_signal.classList = `ico_signal_seleccion`;
            ico_signal.src = `${Reporteador.Instance.ResourcesPath}/Encabezados/${EnumTipoSignalString[s.tipoSignal]}.png?`;

            const bntSignal = document.createElement('div');
            bntSignal.IdSignal = s.idSignal;
            bntSignal.IdTipoSignal = s.tipoSignal;
            bntSignal.NombreSignal = s.tipoSignal == EnumTipoSignal.Tiempo ? 'Poleo' : s.nombre;
            bntSignal.NombreEstacion = estacion.nombre;
            bntSignal.classList = `bntSignal signalNA`;
            bntSignal.id = `e_${idEstacion}_s_${s.idSignal}`;
            bntSignal.disabled = 0;

            segnales_seleccion.append(bntSignal);

            let na_index = this.buttonSignalsSelected.indexOf(bntSignal.id);

            if (na_index >= 0) {
                bntSignal.classList = `bntSignal`;
            }

            bntSignal.append(ico_signal);
            bntSignal.append(label_signal);

            bntSignal.addEventListener('click', (e) => {
                const IdSignal = e.currentTarget.IdSignal;
                const IdTipoSignal = e.currentTarget.IdTipoSignal;
                const NombreSignal = e.currentTarget.NombreSignal;
                const NombreEstacion = e.currentTarget.NombreEstacion;
                const txtRowAGraficar = `${NombreSignal} (${NombreEstacion})`
                const idRow = parseInt(this.rowInput.id.split("_")[1]);
                const index = Reporteador.Instance.idSignalsAGraficar.findIndex(s => s.IdSignal == IdSignal);

                const isDisabled = index >= 0;

                if (!isDisabled) {

                    if (Reporteador.Instance.idSignalsAGraficar.length < this.maxVariablesGraficar) {

                        this.idSeleccionado = s.idEstacion;
                        e.currentTarget.classList = 'bntSignal';
                        const backgroundColor = Reporteador.Instance.coloresSignals[idRow - 1];
                        bntSignal.style.backgroundColor = backgroundColor;

                        const row_segnales_graficacion = document.createElement('div');
                        row_segnales_graficacion.classList = 'row_segnales_graficacion';

                        const contenedor_segnales_graficacion = document.createElement('div');
                        contenedor_segnales_graficacion.classList = 'contenedor_segnales_graficacion';

                        const iconoAGraficar = document.createElement('img');
                        iconoAGraficar.classList = 'icono_singal';
                        iconoAGraficar.src = `${Reporteador.Instance.ResourcesPath}/Encabezados/${EnumTipoSignalString[s.tipoSignal]}.png`;

                        const quitarSignal = document.createElement('img');
                        quitarSignal.classList = 'quitar rotate45deg';
                        quitarSignal.src = `${Reporteador.Instance.ResourcesPath}/General/mas_nrm.png?`;

                        const segnalAGraficar = document.createElement('div');
                        segnalAGraficar.classList = 'label_signal';
                        segnalAGraficar.innerHTML = `(${NombreEstacion}) - ${NombreSignal}`;
                        segnalAGraficar.style.backgroundColor = backgroundColor;

                        const borderSegnal = document.createElement('div');
                        borderSegnal.classList = 'border_signal';
                        borderSegnal.innerHTML = `---`;

                        this.rowInput.value = txtRowAGraficar;
                        this.idSeleccionado = idRow;
                        this.segnales_graficacion_dinamicas_dic[idRow] = e.currentTarget.id;
                        this.contenedor_signals.style.display = "flex";
                        this.headerParametros.style.display = "flex";

                        row_segnales_graficacion.append(contenedor_segnales_graficacion);
                        row_segnales_graficacion.append(borderSegnal);

                        contenedor_segnales_graficacion.append(quitarSignal);
                        contenedor_segnales_graficacion.append(iconoAGraficar);
                        contenedor_segnales_graficacion.append(segnalAGraficar);


                        Reporteador.Instance.idSignalsAGraficar.push({
                            IdSignal: IdSignal,
                            IdTipoSignal: IdTipoSignal,
                            Color: backgroundColor,
                            Nombre: `${NombreSignal} - (${NombreEstacion})`,
                            IdEstacion: idEstacion,
                        });
                        this.buttonSignalsSelected.push(e.target.parentElement.id);


                        row_segnales_graficacion.addEventListener('click', () => {

                            const _index = Reporteador.Instance.idSignalsAGraficar.findIndex(s => s.IdSignal == IdSignal);

                            this.segnales_graficacion_dinamicas.removeChild(this.segnales_graficacion_dinamicas.children[_index]);
                            Reporteador.Instance.idSignalsAGraficar.splice(_index, 1);

                            bntSignal.classList = 'bntSignal signalNA';
                            this.buttonSignalsSelected.splice(bntSignal.id, 1);


                            this.graficarBtn.style.display = Reporteador.Instance.idSignalsAGraficar.length > 0 ? 'block' : 'none';
                            this.borrarBtn.style.display = Reporteador.Instance.idSignalsAGraficar.length > 0 ? 'block' : 'none';
                        });

                        this.graficarBtn.style.display = Reporteador.Instance.idSignalsAGraficar.length > 0 ? 'block' : 'none';
                        this.borrarBtn.style.display = Reporteador.Instance.idSignalsAGraficar.length > 0 ? 'block' : 'none';
                    }

                    else {
                        alert(`máximo ${this.maxVariablesGraficar} variables a graficar.`);
                    }
                    this.contenedor_lista_sitios.style.display = "none";
                    this.headerSignalsParametros.style.display = "none";
                }
            });
        });
    }

    GetNombreProyecto() {

        var name = 'N/A';
        let keys = Object.keys(EnumProyecto);

        switch (this.IdProyecto) {
            // Por si se necesita un nombre en particular por proyecto
            case EnumProyecto.PozosPAI:
                name = `Pozos P.A.I. Norte`;
                break;
            default:
                name = `${keys[this.IdProyecto]}`;
                break;
        }

        return name.replace(/([A-Z])/g, " $1").trim();
    }

}

export { AppGraficador };

// window.onload = () => AppGraficador.Instance.Start();