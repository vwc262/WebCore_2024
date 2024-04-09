import { Core } from "../Core.js";
import Estacion from "../Entities/Estacion.js";

class Mapa {
  constructor() {
    this.markers = [];
  }

  create() {
    this.initMap();
    this.createMarkers();
  }

  async initMap() {
    this.map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 19.4286, lng: -99.251 },
      zoom: 13,
    });
  }

  createMarkers() {
    Core.Instance.data.forEach((data) => {
      const marker = new google.maps.Marker({
        position: { lat: data.Latitud, lng: data.Longitud },
        map: this.map,
      });
      this.markers.push(marker);
    });
  }
}

export { Mapa };
