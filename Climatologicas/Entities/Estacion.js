import { GlobalData } from "../scripts/Global/GlobalData.js";

class Estacion {
    constructor(estacionCruda) {
        this.IdEstacion = estacionCruda.idEstacion;
        this.Enlace = estacionCruda.enlace;
        this.FallaEnergia = estacionCruda.fallaEnergia;
        this.Latitud = estacionCruda.latitud;
        this.Longitud = estacionCruda.longitud;
        this.Nombre = estacionCruda.nombre;
        this.Tiempo = estacionCruda.tiempo;
        this.TipoEstacion = estacionCruda.tipoEstacion;
        this.TipoPoleo = estacionCruda.tipoPoleo
        GlobalData.Instance.Estaciones.set(this.IdEstacion, this);        
    }

}

export { Estacion };