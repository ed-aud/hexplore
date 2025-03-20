import { Controller } from "@hotwired/stimulus"
import mapboxgl from 'mapbox-gl'

// Connects to data-controller="hive-index-map"
export default class extends Controller {
  static values = {
    apiKey: String,
    hexagonMarkers: Array
  }

  connect() {
    console.log(this.hexagonMarkersValue)
    mapboxgl.accessToken = this.apiKeyValue;
    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/mapbox/streets-v10"
    })

    this.#addMarkersToMap()
    this.#fitMapToMarkers()
  }

  #addMarkersToMap() {
    this.hexagonMarkersValue.forEach((marker) => {
      const popup = new mapboxgl.Popup().setHTML(marker.hive_info_window_html)
      const customMarker = document.createElement("div")
      customMarker.innerHTML = marker.hexagon_marker_html

      new mapboxgl.Marker(customMarker)
        .setLngLat([ marker.lon, marker.lat ])
        .setPopup(popup)
        .addTo(this.map)
    })
  }

  #fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds()
    this.hexagonMarkersValue.forEach(marker => bounds.extend([ marker.lon, marker.lat ]))
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 })
  }
}
