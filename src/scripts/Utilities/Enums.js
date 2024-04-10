/**
 * @returns {{RequestType}}} 
 */
const RequestType = {
    GET: "GET",
    POST: "POST"
};
/**
 * @returns {EnumProyecto}
 */
const EnumProyecto = {
    Default: 0,
    GustavoAMadero: 1,
    Padierna: 2,
    PozosSistemaLerma: 3,
    Yaqui: 4,
    Chalmita: 5,
    Encharcamientos: 6,
    Sectores: 7,
    Lumbreras: 8,
};
/**
 * @returns {EnumControllerMapeo}
 */
const EnumControllerMapeo = {
    READ: 'ReadSignalsEstacion',
    DELETE: 'DeleteSignalMapeo',
    UPDATE: 'UpdateSignalMapeo'
};
/**
 * @returns {EnumTipoSignal}
 */
var EnumTipoSignal =
{
    Default: 0,
    Nivel: 1,
    Presion: 2,
    Gasto: 3,
    Totalizado: 4,
    ValvulaAnalogica: 5,
    ValvulaDiscreta: 6,
    Bomba: 7,
    PerillaBomba: 8,
    PerillaGeneral: 9,
    Voltaje: 10,
    Enlace: 11,
    FallaAC: 12,
    Tiempo: 13,
    Mantenimiento: 14,
    PuertaAbierta: 15
}

/**
 * @returns {EnumUnidadesSignal}
 */
const EnumUnidadesSignal = {
    1: "m",
    2: "kg/cm2",
    3: "l/s",
    4: "m3",
    10: "v"
}

export { RequestType, EnumProyecto, EnumControllerMapeo, EnumTipoSignal, EnumUnidadesSignal }