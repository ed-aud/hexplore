import { Controller } from "@hotwired/stimulus"
import mapboxgl from 'mapbox-gl'

export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array,
    mainMarker: Array,
    hexagonId: Number,
  }

  connect() {
    mapboxgl.accessToken = this.apiKeyValue;
    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/mapbox/streets-v10"
    })
    this.map.scrollZoom.disable();
    this.addMarkersToMap();
    this.fitMapToMarkers();
  }

  addMarkersToMap() {
    // Set hexagon centre point as the centre of the map (w/o marker)
    new mapboxgl.Marker()
      .setLngLat([ this.markersValue[0].lon, this.markersValue[0].lat ])

    // Add all matched POIs to map with a marker
    const otherMarkers = this.markersValue.slice(1)

    otherMarkers.forEach((marker) => {
      const popup = new mapboxgl.Popup().setHTML(marker.info_window_html)
      new mapboxgl.Marker()
      .setLngLat([ marker.lon, marker.lat ])
      .setPopup(popup)
      .addTo(this.map)
    });
  }

  fitMapToMarkers() {
    const bounds = new mapboxgl.LngLatBounds()
    this.markersValue.forEach(marker => bounds.extend([ marker.lon, marker.lat ]))
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 })
  }
}
