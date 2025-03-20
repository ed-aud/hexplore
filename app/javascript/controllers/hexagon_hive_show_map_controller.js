import { Controller } from "@hotwired/stimulus"
import mapboxgl from 'mapbox-gl'

export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array,
    centreMarker: Object,
    hexagonId: Number,
  }

  connect() {
    mapboxgl.accessToken = this.apiKeyValue;
    this.map = new mapboxgl.Map({
      container: this.element,
      // style: "mapbox://styles/ed-aud/cm87nbe8100b401qz9zgzfjf7",
      style: "mapbox://styles/mapbox/streets-v10"
    })
    this.map.scrollZoom.disable();
    this.map.dragPan.disable();
    this.addMarkersToMap();
    this.fitMapToCentreMarker();
  }

  addMarkersToMap() {
    // All POI markers
    this.markersValue.forEach((marker) => {
      const popup = new mapboxgl.Popup().setHTML(marker.info_window_html)

      const customMarker = document.createElement("div")
      customMarker.classList.add("map-markers")
      customMarker.innerHTML = marker.marker_html

      customMarker.style.width = "30px";
      customMarker.style.height = "30px";

      new mapboxgl.Marker(customMarker)
        .setLngLat([marker.lon, marker.lat])
        .setPopup(popup)
        .addTo(this.map)
    })
  }

  fitMapToCentreMarker() {
    const bounds = new mapboxgl.LngLatBounds()
    bounds.extend([ `${this.centreMarkerValue.lon + 0.001}`, `${this.centreMarkerValue.lat - 0.0005}` ])
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 })
  }
}
