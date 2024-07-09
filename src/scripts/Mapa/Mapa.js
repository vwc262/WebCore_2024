import { Configuracion } from "../../config/config.js";
import { Core } from "../Core.js";
import { EventoCustomizado, EventsManager } from "../Managers/EventsManager.js";
import { EnumEnlace, EnumNombreProyecto, EnumTipoPolygon } from "../Utilities/Enums.js";

class Mapa {
  constructor() {
    this.polygons = []; // se guarda la referencia a cada polilyne
    this.markers = [];
    this.initPosition = { lat: 19.42883139576554, lng: -99.13096374906871 };
    this.optionDiagrama = 0;
  }

  create() {
    this.initMap();
  }

  async initMap() {
    this.map;
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

    this.map = new Map(document.getElementById("map"), {
      zoom: 13,
      center: this.initPosition,
      mapId: "219e5ba03781534c",
      mapTypeControl: true,
      disableDefaultUI: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.LEFT_TOP,
        mapTypeIds: ["terrain", "satellite", "74130bcd25f050cd"],
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER,
      },
      scaleControl: true,
      streetViewControl: false,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM,
      },
      fullscreenControl: false,
    });

    this.markerPositions = Core.Instance.data.map((dataMarker) => ({
      lat: dataMarker.Latitud,
      lng: dataMarker.Longitud,
    }));

    if (this.markerPositions.length > 0) {
      this.CalcularCentroMarkers();
    }

    Core.Instance.data.forEach((dataMarker) => {
      //console.log(dataMarker);
      this.markerContainer = document.createElement("div");
      this.markerTag = document.createElement("div");
      this.markerImg = document.createElement("img");

      this.markerContainer.className = "markerContainer";
      this.markerContainer.setAttribute(`IdEstacion`, dataMarker.IdEstacion);

      this.markerTag.className = "marker-tag";
      this.markerTag.textContent = dataMarker.Nombre;

      this.markerImg.classList.add("marker-img");

      this.markerContainer.append(this.markerTag, this.markerImg);
      const marker = new AdvancedMarkerView({
        map: this.map,
        position: { lat: dataMarker.Latitud, lng: dataMarker.Longitud },
        content: this.markerContainer,
      });

      marker.addListener("gmp-click", () => {
        this.SetCenterMarker(dataMarker);
        // this.map.setZoom(15);
        //console.log("Marker Click:", dataMarker);
      });

      this.markers.push(marker);
    });

    this.$CenterControlDiv = document.createElement("div");
    this.$CenterControl = this.CrearBotonCentrar(this.map);


    this.$CenterControlDiv.append(this.$CenterControl);
    this.CONFIG__PROYECTO = Configuracion.GetConfiguracion(
      Core.Instance.IdProyecto
    );

    if (this.CONFIG__PROYECTO.mapa?.dobleDiagrama) {
      const botones = this.CrearBotonesDiagramas(this.map);
      botones.forEach(btn => {
        this.$CenterControlDiv.append(btn);
      });
    }
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      this.$CenterControlDiv
    );

    this.CrearPolylines(this.map);

    this.suscribirEventos();
    this.Update();
  }

  suscribirEventos() {
    EventsManager.Instance.Suscribirevento(
      "Update",
      new EventoCustomizado(() => this.Update())
    );
    EventsManager.Instance.Suscribirevento(
      "OnClickTablaToMarker",
      new EventoCustomizado((data) => {
        this.SetCenterMarker(data.dataMarker);
      })
    );
  }

  Update() {
    this.markers.forEach((marker) => {
      let IdEstacion = parseInt(marker.firstChild.getAttribute("idestacion"));
      let markerImg = marker.firstChild.getElementsByTagName("img")[0];

      const estacion = Core.Instance.GetDatosEstacion(IdEstacion);
      markerImg.setAttribute(
        "src",
        `${Core.Instance.ResourcesPath}Iconos/pin_${estacion.IsTimeout()
          ? "t"
          : estacion.IsEnMantenimiento()
            ? "m"
            : estacion.Enlace
        }.png`
      );
    });
  }

  SetCenterMarker(dataMarker) {
    this.map.panTo({ lat: dataMarker.Latitud, lng: dataMarker.Longitud });
  }

  CalcularCentroMarkers() {
    if (this.markerPositions.length === 0) {
      return null;
    }

    var limites = new google.maps.LatLngBounds();
    this.markerPositions.forEach((marker) => {
      limites.extend({ lat: marker.lat, lng: marker.lng });
    });

    this.map.fitBounds(limites);
  }

  CrearBotonCentrar(map) {
    this.$CenterButton = document.createElement("button");

    this.$CenterButton.classList = "controlDiv";

    this.$CenterButton.textContent = "Centrar";
    this.$CenterButton.type = "button";

    this.$CenterButton.addEventListener("click", () => {
      this.CalcularCentroMarkers();
    });
    return this.$CenterButton;
  }

  CrearBotonesDiagramas() {
    this.$PH_Buttton = document.createElement("button");
    this.$Enlaces_Button = document.createElement("button");

    this.$PH_Buttton.classList = "controlDivPH";
    this.$Enlaces_Button.classList = "controlDivE";

    this.$PH_Buttton.textContent = "Perfil Hidraulico";
    this.$Enlaces_Button.textContent = "Enlace";

    this.$PH_Buttton.type = "button";
    this.$Enlaces_Button.type = "button";

    this.$PH_Buttton.addEventListener("click", this.PintarDiagrama.bind(this, true));
    this.$Enlaces_Button.addEventListener("click", this.PintarDiagrama.bind(this, false));
    return [this.$PH_Buttton, this.$Enlaces_Button];
  }

  CrearPolylines(map) {
    this.CONFIG__PROYECTO = Configuracion.GetConfiguracion(
      Core.Instance.IdProyecto
    );

    let poly = this.optionDiagrama == 0 ? this.CONFIG__PROYECTO?.mapa?.polygons ?? [] : this.CONFIG__PROYECTO?.mapa?.EnlacePolygons ?? [];

    let tipoPoligon = this.optionDiagrama == 0 ? EnumTipoPolygon.Hidraulico : EnumTipoPolygon.Radio;

    for (const polygon of poly) {
      this.estacionId = polygon.IdEstacion;
      this.aguasArribaIds = polygon.AguasArriba;
      this.estacionMarker = Core.Instance.data.find(
        (marker) => marker.IdEstacion === this.estacionId
      );

      if (this.estacionMarker) {
        for (const aguasArribaId of this.aguasArribaIds) {
          const AguasArribaMarker = Core.Instance.data.find(
            (marker) => marker.IdEstacion === aguasArribaId
          );

          if (AguasArribaMarker) {
            const lineSymbol = {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 3,
              fillColor: tipoPoligon == EnumTipoPolygon.Hidraulico ? "cyan" : "green",
              fillOpacity: 1,
              strokeColor: "#282c41",
              strokeWeight: 2,
            };
            const polyline = new google.maps.Polyline({
              path: [
                {
                  lat: this.estacionMarker.Latitud,
                  lng: this.estacionMarker.Longitud,
                },
                {
                  lat: AguasArribaMarker.Latitud,
                  lng: AguasArribaMarker.Longitud,
                },
              ],
              geodesic: true,
              strokeColor: tipoPoligon == EnumTipoPolygon.Hidraulico ? "#00DBCCFF" : "#008F39",
              strokeOpacity: 1.0,
              strokeWeight: 2.5,
              icons: [{ icon: lineSymbol, offset: "100%" }],
            });
            polyline.setMap(map);
            this.AnimarIconoPolyline(polyline);
            this.InitAnimPathPolyline(polyline, map, {
              lat: AguasArribaMarker.Latitud,
              lng: AguasArribaMarker.Longitud,
            });
            this.polygons.push(polyline);
          }
        }
      }
    }
  }

  InitAnimPathPolyline(polyline, map, latlngGoal) {
    requestAnimationFrame(this.step.bind(this, polyline, map, latlngGoal, { acum: 0 }));

  }

  step = (polyline, map, latlngGoal, acumulation) => {
    this.AnimarPolyLine(polyline, map, latlngGoal, acumulation);
    if (acumulation.acum <= 1)
      requestAnimationFrame(this.step.bind(this, polyline, map, latlngGoal, acumulation));
  }

  AnimarPolyLine(polyline, map, targetLatLng, acumulation) {
    const step = .010;
    const result = this.lerp({ lat: polyline.getPath().getAt(0).lat(), lng: polyline.getPath().getAt(0).lng() }, targetLatLng, acumulation.acum);
    polyline.getPath().removeAt(1)
    polyline.getPath().push(new google.maps.LatLng(result.lat, result.lng));
    return acumulation.acum += step;
  }



  lerp(a, b, alpha) {
    return this.sumLatLng(a, this.multiplyLatLngAlpha(alpha, { lat: b.lat - a.lat, lng: b.lng - a.lng }));
  }

  multiplyLatLngAlpha(alpha, dif) {
    return { lat: dif.lat * alpha, lng: dif.lng * alpha }
  }

  sumLatLng(LatLngA, LatLngB) {
    return { lat: LatLngA.lat + LatLngB.lat, lng: LatLngA.lng + LatLngB.lng };
  }


  AnimarIconoPolyline(polyline) {
    var LineOffset = 0;
    var IconSpeed = 0.7;

    setInterval(() => {
      LineOffset = (LineOffset + IconSpeed) % 200;
      var LineIcon = polyline.get("icons");
      LineIcon[0].offset = LineOffset / 2 + "%";
      polyline.set("icons", LineIcon);
    }, 20);
  }

  BorrarLineas() {
    this.polygons.forEach(polyline => {
      polyline.setMap(null);
    });
    this.polygons = [];
  }

  PintarDiagrama(isPH) {
    this.BorrarLineas();
    this.optionDiagrama = isPH ? 0 : 1;
    this.CrearPolylines(this.map);
  };
}

export { Mapa };
