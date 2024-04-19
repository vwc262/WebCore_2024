import { Configuracion } from "../../config/config.js";
import { Core } from "../Core.js";
import { EnumNombreProyecto } from "../Utilities/Enums.js";

class Mapa {
  constructor() {
    this.markers = [];
    this.initPosition = { lat: 19.42883139576554, lng: -99.13096374906871 };
  }

  create() {
    this.initMap();
  }

  async initMap() {
    let map;
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
      zoom: 13,
      center: this.initPosition,
      mapId: "DEMO_MAP_ID",
      mapTypeControl: true,
      disableDefaultUI: false,
      mapTypeId: "terrain",
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.LEFT_TOP,
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

    const styles = {
      hide: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    };

    map.setOptions({ styles: styles["hide"] });

    const markerPositions = Core.Instance.data.map((dataMarker) => ({
      lat: dataMarker.Latitud,
      lng: dataMarker.Longitud,
    }));

    if (markerPositions.length > 0) {
      this.centroid = this.CalcularCentroMarkers(markerPositions);
      map.setCenter(this.centroid);
    }

    Core.Instance.data.forEach((dataMarker) => {
      //console.log(dataMarker);
      this.markerContainer = document.createElement("div");
      this.markerTag = document.createElement("div");
      this.markerImg = document.createElement("img");

      this.markerContainer.className = "markerContainer";

      this.markerTag.className = "marker-tag";
      this.markerTag.textContent = dataMarker.Nombre;

      this.markerImg.setAttribute("src", "../imgs/iconMarker.png");
      this.markerImg.classList.add("marker-img");

      if (
        dataMarker.Enlace === 1 ||
        dataMarker.Enlace === 2 ||
        dataMarker.Enlace === 3
      ) {
        this.markerImg.classList.add("marker-imgG");
      } else {
        this.markerImg.classList.add("marker-imgR");
      }

      this.markerContainer.append(this.markerTag, this.markerImg);
      const marker = new AdvancedMarkerView({
        map: map,
        position: { lat: dataMarker.Latitud, lng: dataMarker.Longitud },
        content: this.markerContainer,
      });

      marker.addEventListener("click", () => {
        map.setCenter({ lat: dataMarker.Latitud, lng: dataMarker.Longitud });
        map.setZoom(15);
        console.log("Marker Click:", dataMarker);
      });
    });

    this.$CenterControlDiv = document.createElement("div");
    this.$CenterControl = this.CrearBotonCentrar(map);

    this.$CenterControlDiv.append(this.$CenterControl);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      this.$CenterControlDiv
    );

    this.CrearPolylines(map);
  }

  CalcularCentroMarkers(positions) {
    if (positions.length === 0) {
      return null;
    }

    const centroid = positions.reduce(
      (acc, curr) => {
        acc.lat += curr.lat;
        acc.lng += curr.lng;
        return acc;
      },
      { lat: 0, lng: 0 }
    );

    centroid.lat /= positions.length;
    centroid.lng /= positions.length;

    return centroid;
  }

  CrearBotonCentrar(map) {
    this.$CenterButton = document.createElement("button");

    this.$CenterButton.style.backgroundColor = "#fff";
    this.$CenterButton.style.border = "2px solid #fff";
    this.$CenterButton.style.borderRadius = "3px";
    this.$CenterButton.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    this.$CenterButton.style.color = "rgb(25,25,25)";
    this.$CenterButton.style.cursor = "pointer";
    this.$CenterButton.style.fontFamily = "Roboto,Arial,sans-serif";
    this.$CenterButton.style.fontSize = "16px";
    this.$CenterButton.style.lineHeight = "38px";
    this.$CenterButton.style.margin = "8px 0 22px";
    this.$CenterButton.style.padding = "0 5px";
    this.$CenterButton.style.textAlign = "center";
    this.$CenterButton.textContent = "Centrar";
    this.$CenterButton.type = "button";

    this.$CenterButton.addEventListener("click", () => {
      map.setCenter(this.centroid);
    });
    return this.$CenterButton;
  }

  CrearPolylines(map) {
    this.CONFIG__PROYECTO = Configuracion.GetConfiguracion(
      Core.Instance.IdProyecto
    );

    for (const polygon of this.CONFIG__PROYECTO.mapa.polygons) {
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
              fillColor: "cyan",
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
              strokeColor: "#00DBCCFF",
              strokeOpacity: 1.0,
              strokeWeight: 2.5,
              icons: [{ icon: lineSymbol, offset: "100%" }],
            });
            polyline.setMap(map);
            this.AnimarIconoPolyline(polyline);
          }
        }
      }
    }
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
}

export { Mapa };
