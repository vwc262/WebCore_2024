// Se declara un objeto
var ControladorCSV = {
    // se inicializa la funcion ObtenerCSV que recibe varios paramtros
    ObtenerCSV: function (chartReference, TituloProyecto, FechaInicial, FechaFinal, IdSegnalesSeleccionadas) {

        // Se guarda la funcion EstablecerEncabezadosCSV
        let csv = ControladorCSV.EstablecerEncabezadosCSV(IdSegnalesSeleccionadas);
        // Se guarda el IdSegnalesSeleccionadas
        let arraySegnales = IdSegnalesSeleccionadas;
        // Se guarda el tamanio de IdSegnalesSeleccionadas
        let cantidadSegnales = arraySegnales.length;
        // Se valida que el tamanio de IdSegnalesSeleccionadas no sea 0
        if (cantidadSegnales <= 0)
            return;

        // Se recorre chartReference
        const datos = Object.values(chartReference.data);
        datos.forEach(dato => {
            const keys = Object.keys(dato);
            keys.forEach((key, index) => {
                csv += `${key.includes('date') ? this.ObtenerFechaCSV(dato[key]) : dato[key]}${index < keys.length - 1 ? ',' : '\r\n'}`
            });
        });

        // Se recorre IdSegnalesSeleccionadas y se concatena el id al nombre del reporte
        let nombreArchivo = `Reporte de ${TituloProyecto} `;
        // Se recorre IdSegnalesSeleccionadas
        IdSegnalesSeleccionadas.forEach((element, i) => {

            // Se valida que el index sea el ultimo de IdSegnalesSeleccionadas 
            if (i === IdSegnalesSeleccionadas.length - 1)
                // En caso de que se cumpla la condicion se concatena el id
                nombreArchivo += `${element.Nombre} `;
            else
                // En caso de que no se concatena el id y una coma
                nombreArchivo += `${element.Nombre}, `;
        });
        // Se concatena el intervalo de la fecha del reporte
        nombreArchivo += `de ${FechaInicial.toISOString()} a ${FechaFinal.toISOString()}`;

        // Se obtine el elemto del HTML
        let aCSV = document.getElementById("aCSV");
        // Se colocan atributos al elemento
        aCSV.setAttribute("href", csv);
        aCSV.setAttribute("download", `${nombreArchivo.replaceAll(' ', '_').replaceAll(',', '_')}.csv`);
        aCSV.click();
    },

    // Funcion para saber si la llave tiene datos
    TieneValores: function (dato, keys) {
        let r = true;
        keys.forEach(key => {
            if (dato[key] != undefined) r = false;
        });
        return r;
    },

    // Funcion para obtener la fecha
    ObtenerFechaCSV: function (date) {
        return `${date.getFullYear()}-${ (date.getMonth()+1).toString().padStart(2,'0') }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()} ${date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours()}:${date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes()}`;
    },

    // Funcion para colocar el encabezado
    EstablecerEncabezadosCSV: function (IdSegnalesSeleccionadas) {
        let csv = 'data:text/json;charset=utf-8,\r\n';

        // Se recorre IdSegnalesSeleccionadas
        IdSegnalesSeleccionadas.forEach((signal, index) => {
            // Se concatena el id y se valida si el index es el ultimo de no ser el caso se concatena una coma
            csv += `${signal.Nombre}${index == IdSegnalesSeleccionadas - 1 ? '' : ','}`;
        });
        // Se concatena \r = return \n = new line
        csv += "Tiempo\r\n";
        return csv;
    }
};

export default ControladorCSV;