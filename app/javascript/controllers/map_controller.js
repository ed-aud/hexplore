import { Controller } from "@hotwired/stimulus"
import * as turf from "@turf/turf"
import mapboxgl from "mapbox-gl"

export default class extends Controller {
  static values = {
    apiKey: String,
  }

  connect() {
    mapboxgl.accessToken = this.apiKeyValue

    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/mapbox/streets-v10"
    })

    const londonBounds = [
      [-0.489, 51.28],
      [0.236, 51.686]
    ];

    this.#boundingBox(londonBounds)
    this.#hexagonOverlay(londonBounds)
  }

  // Function to load map centered on London bounds
  #boundingBox(londonBounds) {
    this.map.fitBounds(londonBounds, { padding: 70, maxZoom: 15, duration: 0.3 });
  }

  // Function to load base hive structure over London
  #hexagonOverlay(londonBounds) {
    const turfBounds = [londonBounds[0][0], londonBounds[0][1], londonBounds[1][0], londonBounds[1][1]];
    const hexGrid = turf.hexGrid(turfBounds, 5, { units: "kilometers" });

    map.on("load", function() {
      map.addSource("hex-grid", {
        type: "geojson",
        data: hexGrid
      });

      map.addLayer({
        id: "hex-grid-layer",
        type: "fill",
        source: "hex-grid",
        paint: {
          "fill-color": "#088",
          "fill-opacity": 0.4,
          "fill-outline-color": "#000",
        }
      });
    });
  }
}
