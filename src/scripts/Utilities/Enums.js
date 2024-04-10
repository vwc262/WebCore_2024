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
 * @returns NombreProyecto
 */
const EnumNombreProyecto = {
    Default: 0,
    1: 'TanquesGustavoAMadero',
    2: 'TanquesPadierna',
    3: 'PozosSistemaLerma',
    4: 'TanquesYaqui',
    5: 'TanquesChalmita',
    6: 'Encharcamientos',
    7: 'Sectores',
    8: 'Lumbreras',
}

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
 * @returns {EnumTipoSignalString}
 */
var EnumTipoSignalString =
{
    0: 'Default',
    1: 'Nivel',
    2: 'Presion',
    3: 'Gasto',
    4: 'Totalizado',
    5: 'ValvulaAnalogica',
    6: 'ValvulaDiscreta',
    7: 'Bomba',
    8: 'PerillaBomba',
    9: 'PerillaGeneral',
    10: 'Voltaje',
    11: 'Enlace',
    12: 'FallaAC',
    13: 'Tiempo',
    14: 'Mantenimiento',
    15: 'PuertaAbierta',
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

export { RequestType, EnumProyecto, EnumControllerMapeo, EnumUnidadesSignal, EnumNombreProyecto, EnumTipoSignal, EnumTipoSignalString }