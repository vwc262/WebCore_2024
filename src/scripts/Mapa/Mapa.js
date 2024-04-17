import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";

class Mapa {
  constructor() {
    this.markers = [];
  }

  create() {
    this.initMap();
    // this.createMarkers();
  }

  async initMap() {
    let map;
    const initPosition = { lat: 19.42883139576554, lng: -99.13096374906871 };
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
      zoom: 13,
      center: initPosition,
      mapId: "DEMO_MAP_ID",
      mapTypeControl: true,
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
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM,
      },
      fullscreenControl: false,
    });

    Core.Instance.data.forEach((dataMarker) => {
      const markerTag = document.createElement("div");

      markerTag.className = "marker-tag";
      markerTag.textContent = dataMarker.Nombre;
      const marker = new AdvancedMarkerView({
        map: map,
        position: { lat: dataMarker.Latitud, lng: dataMarker.Longitud },
        content: markerTag,
      });
    });
  }
}

export { Mapa };
