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
}
/**
 * @returns {EnumControllerMapeo}
 */
const EnumControllerMapeo = {
    READ: 'ReadSignalsEstacion',
    DELETE: 'DeleteSignalMapeo',
    UPDATE: 'UpdateSignalMapeo'
};

export { RequestType, EnumProyecto, EnumControllerMapeo }