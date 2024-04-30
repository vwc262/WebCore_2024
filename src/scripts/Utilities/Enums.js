/**
 * @returns {{RequestType}}}
 */
const RequestType = {
  GET: "GET",
  POST: "POST",
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
  SantaCatarina: 9,
  Chiconautla: 10
};
/**
 * @returns NombreProyecto
 */
const EnumNombreProyecto = {
  Default: 0,
  1: "TanquesGustavoAMadero",
  2: "TanquesPadierna",
  3: "PozosSistemaLerma",
  4: "TanquesYaqui",
  5: "TanquesChalmita",
  6: "Encharcamientos",
  7: "Sectores",
  8: "Lumbreras",
  9: "TanquesSantaCatarina",
  10: "PozosChiconautla"
};

/**
 * @returns {EnumControllerMapeo}
 */
const EnumControllerMapeo = {
  READ: "ReadSignalsEstacion",
  DELETE: "DeleteSignalMapeo",
  UPDATE: "UpdateSignalMapeo",
  INSERTCOMANDO: "InsertComando",
  READESTADOCOMANDO: "ReadEstadoComandos"
};
/**
 * @returns {EnumTipoSignal}
 */
var EnumTipoSignal = {
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
  PuertaAbierta: 15,
};

/**
 * @returns {EnumTipoSignalString}
 */
var EnumTipoSignalString = {
  0: "Default",
  1: "Nivel",
  2: "Presion",
  3: "Gasto",
  4: "Totalizado",
  5: "ValvulaAnalogica",
  6: "ValvulaDiscreta",
  7: "Bomba",
  8: "PerillaBomba",
  9: "PerillaGeneral",
  10: "Voltaje",
  11: "Enlace",
  12: "FallaAC",
  13: "Tiempo",
  14: "Mantenimiento",
  15: "PuertaAbierta",
};

/**
 * @returns {EnumTipoSignalString}
 */
var EnumTipoSignalNomenclatura = {
  0: "D",
  1: "N",
  2: "P",
  3: "G",
  4: "T",
  5: "VA",
  6: "VD",
  7: "B",
  8: "PB",
  9: "PG",
  10: "V",
  11: "E",
  12: "AC",
  13: "T",
  14: "M",
  15: "PA",
};

/**
 * @returns {EnumUnidadesSignal}
 */
const EnumUnidadesSignal = {
  1: "m",
  2: "<sup>kg</sup>/<sub>cm<sup>2</sup></sub>",
  3: "<sup>l</sup>/<sub>s</sub>",
  4: "m<sup>3</sup>",
  10: "V",
};

/**
 * @returns {EnumValorValvulaDiscreta}
 */
const EnumValorValvulaDiscreta = {
  NoDisponible: 0,
  Cerrado: 1,
  Abierto: 2,
};

/**
 * @returns {EnumFallaAC}
 */
const EnumFallaAC = {
  Alarmado: 0,
  Normal: 1,
};

/**
 * @returns {EnumPuertaAbierta}
 */
const EnumPuertaAbierta = {
  Alarmado: 0,
  Normal: 1,
};

/**
 * @returns {EnumValorBomba}
 */
const EnumValorBomba = {
  NoDisponible: 0,
  Arrancada: 1,
  Apagada: 2,
  Falla: 3,
};

/**
 * @returns {EnumPerillaBomba}
 */
const EnumPerillaBombaString = {
  0: "Off",
  1: "Remoto",
  2: "Local",
};

/**
 * @returns {EnumPerillaGeneral}
 */
const EnumPerillaGeneralString = {
  0: 'Manual',
  1: 'Remoto',
  2: 'Automatismo',
};

/**
 * @returns {EnumPerillaBomba}
*/
const EnumPerillaBomba = {
  Off: 0,
  Remoto: 1,
  Local: 2,
};

/**
 * @returns {EnumPerillaGeneral}
*/
const EnumPerillaGeneral = {
  Manual: 0,
  Remoto: 1,
  Automatismo: 2,
};

/**
 * @returns {EnumEnlace}
 */
const EnumEnlace = {
  FueraLinea: 0,
  Radio: 1,
  Celular: 2,
  Hibrido: 3,
};

/**
 * @returns {EnumDentroLimite}
 */
const EnumDentroLimite = {
  Bajo: 0,
  Normal: 1,
  Alto: 2,
};

const EnumAppEvents = {
  LogOut: "LogOut",
  Update: "Update",
  ParticularChanged: "ParticularChanged",
};

const EnumModule = {
  Perfil: "Perfil",
  Particular: "Particular",
  Mapa: "Mapa",
  Graficador: "Graficador",
};

const EnumEstadoComando = {
  Default: 0,
  Insertado: 1,
  Leido: 2,
  Ejecutado: 3,
  Error: 4,
}

export {
  RequestType,
  EnumProyecto,
  EnumControllerMapeo,
  EnumUnidadesSignal,
  EnumNombreProyecto,
  EnumTipoSignal,
  EnumTipoSignalString,
  EnumTipoSignalNomenclatura,
  EnumValorValvulaDiscreta,
  EnumFallaAC,
  EnumPuertaAbierta,
  EnumValorBomba,
  EnumPerillaBomba,
  EnumPerillaGeneral,
  EnumPerillaBombaString,
  EnumPerillaGeneralString,
  EnumEnlace,
  EnumDentroLimite,
  EnumAppEvents,
  EnumModule,
  EnumEstadoComando,
};
