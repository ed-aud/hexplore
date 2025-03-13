import { Controller } from "@hotwired/stimulus"
import mapboxgl from 'mapbox-gl'

// Connects to data-controller="hexagon-show-map"
export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array,
    hexagonId: Number,
  }

  connect() {
    mapboxgl.accessToken = this.apiKeyValue;
    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/mapbox/streets-v10"
    });
    this.#addMarkersToMap();
    this.#fitMapToMarkers();
    this.#updateCoordinates();
    window.addEventListener("hexagon:updateCoordinates", this.updateCoordinates.bind(this))
  }

  disconnect() {
    window.removeEventListener("hexagon:updateCoordinates", this.updateCoordinates.bind(this))
  }

  #updateCoordinates(event){
    const { latitude, longitude } = event.detail
    console.log("Received coordinates:", latitude, longitude)
  };

  #addMarkersToMap() {
    this.markersValue.forEach((marker) => {
      new mapboxgl.Marker()
        .setLngLat([ marker.lng, marker.lat ])
        .addTo(this.map)
    })
  }

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds()
    this.markersValue.forEach(marker => bounds.extend([ marker.lng, marker.lat ]))
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 })
  }
}
