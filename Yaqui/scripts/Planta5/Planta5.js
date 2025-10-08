async function Update() {
    const result = await Fetch(`https://virtualwavecontrol.com.mx/api24/VWC/app2024/getUpdate?idProyecto=7`);
    let textGasto = document.querySelector('#signalGasto')
    let textTotalizado = document.querySelector('#signalTotalizado')
    let textTiempo = document.querySelector('.tiempo')
    let enlaceImg = document.querySelector('.enlace')
    textTiempo.innerHTML = FormatearFecha(result.Sites[4].Tiempo);
    
    enlaceImg.setAttribute('src',result.Sites[4].Enlace >= 1 && result.Sites[4].Enlace <= 3 ? '../PlantaBerros/Planta5Resources/en_linea.png' : '../PlantaBerros/Planta5Resources/fuera_linea.png'  );
    
    const signals = result.Sites[4].SignalsContainer.filter(s => s.TipoSignal == 3 || s.TipoSignal == 4);
    signals.forEach(s => {
        switch(s.TipoSignal){
            case 3:
                s.Signals.forEach(sg=>{
                    textGasto.innerHTML = sg.DentroRango ? sg.Valor.toFixed(2) : '---';
                });
                break
            case 4:
                s.Signals.forEach(sg=>{                    
                    textTotalizado.innerHTML = sg.DentroRango ? sg.Valor.toFixed(0) : '---';
                });
                break
        }        
    });
}


window.onload = () => {
    Update();
    setInterval(Update, 15 * 1000); // cada 15 seg
};

function FormatearFecha(value) {
    let date = new Date(value);
    let Opciones = {
        year: "4-digit", //numeric
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        seccond: "2-digit",
        // hour12: true,
    };
    return date.toLocaleDateString("es-MX", Opciones);
}


async function Fetch(url) {
    const config = {
        method: 'GET',
        mode: "cors",
    };
    delete config.body;
    delete config.headers;
    const response = await fetch(url, config);
    return await response.json();

}