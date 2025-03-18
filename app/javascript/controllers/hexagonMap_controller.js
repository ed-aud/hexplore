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
      // style: ""
    })
    this.map.setMinZoom(15);
    this.map.dragPan.disable();
    this.#addMarkersToMap();
    this.map.setCenter([ `${this.markersValue[0].lng + 0.001}`, `${this.markersValue[0].lat - 0.0006}` ]);
    this.#displayPopup();
    console.log(this.markersValue)
  }


  #addMarkersToMap() {
    const mainPopup = new mapboxgl.Popup().setHTML(`<strong class="hexagon-title">Center point</strong>`)
    new mapboxgl.Marker()
      .setLngLat([ this.markersValue[0].lng, this.markersValue[0].lat ])
      .setPopup(mainPopup)
      .addTo(this.map)

     const otherMarkers = this.markersValue.slice(1,)
      otherMarkers.forEach((marker) => {
      const popup = new mapboxgl.Popup().setHTML(marker.info_window_html)
      new mapboxgl.Marker()
      .setLngLat([ marker.lng, marker.lat ])
      .setPopup(popup)
      .addTo(this.map)
    });
  }

  #displayPopup(popup){
  }
  // #showPopUps(popup){
  //   this.map.on('mouseenter',(e) => {
  //     popup.addTo(this.map);
  // });

  // // map.on('mouseleave', 'places', () => {
  // //     map.getCanvas().style.cursor = '';
  // //     popup.remove();
  // // });
  // }
}
