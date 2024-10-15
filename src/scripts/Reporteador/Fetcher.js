import { Core } from "../Core.js";
import { EnumProyecto } from "../Utilities/Enums.js";

const FetcherGraficador = {
  SinData: {},
  methodType: {
    GET: "GET",
    POST: "POST",
  },
  version: 0,
  uriAssets: "https://virtualwavecontrol.com.mx/RecursosWeb/WebCore24/",
  uri: "https://virtualwavecontrol.com.mx/api24/VWC/app2024/", 
  /**
   * Funcion para hacer request del tipo get y post , Nota : Si es tipo Post jsonizar debe estar en true
   * @param {{action : string, method : string, data = {}, jsonizar = boolean}} ParametrosOpcionales
   * @returns
   */
  request: async function ({
    action = EnumControllerPoleo.CONSULTAR,
    method = this.methodType.GET,
    data = this.SinData,
    jsonizar = true,
    project = Core.Instance.IdProyecto,
  }) {
    const options = {
      method: method,
      mode: "cors",
      headers: {
        // 'Accept':'text/plain',
        "Content-Type": "application/json",
      },
      body: jsonizar ? JSON.stringify(data) : data,
    };

    //Los metodos get no aceptan body
    if (method == "GET") {
      delete options.body;
      delete options.headers;
    }

    const fetchresult = await fetch(`${this.uri}/${action}?idProyecto=${Core.Instance.IdProyecto}`, options);
    let jsonData = null;

    jsonData = await fetchresult.json();
    return jsonData;
  },
  getImage: function (projectName, folderRoot, assetName, ext) {
    return `${Core.Instance.ResourcesPath}${folderRoot}/${assetName}.${ext}?v=${this.version}`;
  }
};

const EnumPeticiones = {
  READ: "getInfraestructura",
  HISTORICOS: "GetReportes",
};

const EnumNameProjecto = {
  TanquesPadierna: 'TanquesPadierna',
}

const getNombreProyectoIdProyecto = (idProyecto) => {
  switch (idProyecto) {
    case EnumProyecto.GustavoAMadero: return "GustavoAMadero";
    case EnumProyecto.Padierna: return "Padierna";
    case EnumProyecto.Lerma: return "Lerma";
    case EnumProyecto.Yaqui: return "Yaqui";
    case EnumProyecto.Chalmita: return "Chalmita";
    case EnumProyecto.Encharcamientos: return "Encharcamientos";
    case EnumProyecto.Sectores: return "Sectores";
    case EnumProyecto.Lumbreras: return "Lumbreras";
    case EnumProyecto.SantaCatarina: return "SantaCatarina";
    case EnumProyecto.Chiconautla: return "Chiconautla";
    case EnumProyecto.Sorpasso: return "Sorpasso";
    case EnumProyecto.SistemaCutzamala: return "SistemaCutzamala";
    case EnumProyecto.ClimatologicasHidrometricas: return "ClimatologicasHidrometricas";
    case EnumProyecto.Pruebas: return "Pruebas";
    case EnumProyecto.LineaMorada: return "LineaMorada";
  }

}
export { FetcherGraficador, EnumPeticiones, EnumProyecto, EnumNameProjecto, getNombreProyectoIdProyecto };
