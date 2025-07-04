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
  Lerma: 3,
  Iztapalapa: 4,
  Chalmita: 5,
  Yaqui: 6,
  SistemaCutzamala: 7,
  PruebasCampo: 8,
  SantaCatarina: 9,
  Chiconautla: 10,
  Sorpasso: 11,
  EscudoNacional: 12,
  ClimatologicasHidrometricas: 13,
  Teoloyucan: 14,
  Pruebas: 15,
  LineaMorada: 16,
  PozosAIFA: 17,
  PozosZumpango: 18,
  PaseoDelRio: 19,
  Aduana: 20,
  PozosPAI: 21,
  PozosCoyoacan: 22,
  PozosAzcapotzalco: 23,
  Encharcamientos: 24,
  Lumbreras: 25,
  Ramales: 26,
  PortalDeSalida: 27,
};
/**
 * @returns NombreProyecto
 */
const EnumNombreProyecto = {
  0: "Default",
  1: "TanquesGustavoAMadero",
  2: "TanquesPadierna",
  3: "PozosSistemaLerma",
  4: "TanquesIztapalapa",
  5: "TanquesChalmita",
  6: "Yaqui",
  7: "SistemaCutzamala",
  8: "PruebasCampo",
  9: "TanquesSantaCatarina",
  10: "PozosChiconautla",
  11: "Sorpasso",
  12: "EscudoNacional",
  13: "ClimatologicasHidrometricas",
  14: "PozosTeoloyucan",
  15: "Pruebas",
  16: "LineaMorada",
  17: "PozosAIFA",
  18: "PozosZumpango",
  19: "PaseoDelRio",
  20: "TanquesAduana",
  21: "PozosPAI",
  22: "PozosCoyoacan",
  23: "PozosAzcapotzalco",
  24: "Encharcamientos",
  25: "Lumbreras",
  26: "Ramales",
  27: "PortalDeSalida",
};

/**
 * @returns NombreProyectoFolder
 */
const EnumNombreProyectoFolder = {
  "Default": 0,
  "GustavoAMadero2024": 1,
  "Padierna2024": 2,
  "PozosSistemaLerma2024": 3,
  "Iztapalapa2024": 4,
  "Lerma2024": 5,
  "Yaqui2024": 6,
  "SistemaCutzamala2024": 7,
  "PruebasCampo2024": 8,
  "SantaCatarina2024": 9,
  "Chiconautla2024": 10,
  "Sorpasso2024": 11,
  "EscudoNacional2024": 12,
  "ClimatologicasHidrometricas2024": 13,
  "Teoloyucan2024": 14,
  "Pruebas2024": 15,
  "LineaMorada2024": 16,
  "PozosAIFA2024": 17,
  "PozosZumpango2024": 18,
  "PaseoDelRio2025": 19,
  "Aduana2024": 20,
  "PozosPAI2024": 21,
  "PozosCoyoacan2024": 22,
  "PozosAzcapotzalco2024": 23,
  "Encharcamientos2025": 24,
  "Lumbreras2025": 25,
  "Ramales2025": 26,
  "PortalDeSalida2025": 27,
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
  VoltajeRango: 16,
  CorrienteRango: 17,
  PotenciaTotal: 18,
  FactorPotencia: 19,
  Precipitacion: 20,
  Temperatura: 21,
  Humedad: 22,
  RadiacionSolar: 23,
  Intensidad: 24,
  Direccion: 25,
  Compuerta: 26
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
  16: "VoltajeRango",
  17: "CorrienteRango",
  18: "Potencia Total",
  19: "Factor Potencia",
  20: "Precipitacion",
  21: "Temperatura",
  22: "Humedad",
  23: "RadiacionSolar",
  24: "Intensidad",
  25: "Direccion",
  26: "Compuerta"
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
  16: "VR",
  17: "CR",
  18: "PT",
  19: "FP",
  20: "PRP",
  21: "TEMP",
  22: "HUM",
  23: "EVA",
  24: "INTS",
  25: "DIR",
  26: "COM"
};

/**
 * @returns {EnumUnidadesSignal}
 */
const EnumUnidadesSignal = {
  1: "m",
  2: "<sup>kg</sup>/<sub>cm<sup>2</sup></sub>",
  3: "m3/s",
  4: "m<sup>3</sup>",
  5: "%",
  10: "V",
  16: "V",
  17: "A",
  18: "W",
  19: "%",
  20: "<sup>mm</sup>/<sup>H</sup>",
  21: "°C",
  22: "%",
  23: "%",
  24: "m/s",
  25: "°",
  26: "°",
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
  // Alarmado: 0,
  Alarmado: 511,
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
const EnumTipoPolygon = {
  Default: 0,
  Hidraulico: 1,
  Radio: 2,
}

const EnumTipoHeader = {
  Deafult: 0,
  Sacmex: 1,
  Seguiagua: 2,
}

const EnumSemaforo = {
  NoDisponible: 0,
  Normal: 1,
  Preventivo: 2,
  Critico: 3
}

/**
 * Enum que contiene las acciones para pedir historicos a la api
 */
const EnumControllerHistorial = {
  READ: 'ReadHistorial',
  READPOLEO: 'ReadHistorialPoleo',
};

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
  EnumTipoPolygon,
  EnumNombreProyectoFolder,
  EnumTipoHeader,
  EnumControllerHistorial,
  EnumSemaforo
};

