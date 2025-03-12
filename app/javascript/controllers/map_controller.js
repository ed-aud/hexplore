import { Controller } from "@hotwired/stimulus"
import mapboxgl from "mapbox-gl"

export default class extends Controller {
  // Location values are retrieving location objects from seed file via Hex Grid controller & Index page
  static values = {
    apiKey: String,
    gyms: Array,
    pubs: Array,
    stations: Array,
  };

  static targets = [
    "map",
    "filters",
    "output"
  ];

  // Create a default state for filters
  selectedFilters = {
    pubs: false,
    stations: false
  };
  // Array storing Hex Grid data
  hexGrid = [];

  // Array storing all hexagons are shaded green (via their ID) for when a user toggles off a given filter (as we need to reset these)
  greenHexagons = [];

  connect() {
    mapboxgl.accessToken = this.apiKeyValue;

    this.map = new mapboxgl.Map({
      container: this.mapTarget,
      style: "mapbox://styles/mapbox/streets-v10",
    });

    const searchBounds = [
      [-0.0100, 51.5545],
      [-0.0865, 51.5066],
    ];

    this.#boundingBox(searchBounds);
    // Ensure that Hex Grid (and associated fucntions) is only generated once the map has loaded
    this.map.on("load", () => {
      this.#generateHexGrid(searchBounds);
      this.#hexagonClick();
    });
    console.log('hio')
  }

  displayData(){
    console.log('hio')
  }
  // Function to define the outer bounds of the base map
  #boundingBox(searchBounds) {
    this.map.fitBounds(searchBounds, { padding: 70, maxZoom: 15, duration: 0.3 });
  }

  // Function to generate the base Hex Grid, overlaid onto the same outer bounds as the base map
  #generateHexGrid(searchBounds) {
    const options = { units: "kilometers" };
    const hexGrid = turf.hexGrid(searchBounds.flat(), 0.4, options);

    // Ensure each hexagon has a unique ID stored in its properties to retrieve later when looking for matches
    const hexGridWithIds = hexGrid.features.map((feature, index) => {
      feature.properties = feature.properties || {};
      feature.properties.id = index;
      return feature;
    });
    this.hexGrid = hexGridWithIds;

    // Pass the hexagons as a source to the map
    this.map.addSource("hexGrid", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: hexGridWithIds
      }
    });

    // Overlay the Hex Grid layer on the map linked to new map source [as above]
    this.map.addLayer({
      id: "hexGridLayer",
      type: "fill",
      source: "hexGrid",
      layout: {},
      paint: {
        "fill-color": "#ffffff",
        "fill-opacity": 0.6,
        "fill-outline-color": "#000000",
      },
    });
  }

  // Function to allow a user to click on a hexagon to see an info pop-up
  #hexagonClick() {
    this.map.on("click", "hexGridLayer", (event) => {
      const clickedHexagonId = event.features[0].properties.id;
      const coordinates = event.lngLat;

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          `<div class="clicked-hexagon">
            <strong class="hexagon-title">Hive ${clickedHexagonId}</strong>
            <p>(${coordinates.lng.toFixed(5)}, ${coordinates.lat.toFixed(5)})</p>
            <button class="btn btn-primary btn-hexagon" onclick="window.location.href='/hexagons'">
              View Hive
            </button>
          </div>`)
        .addTo(this.map);
    });
  }

  // Function to handle when a user toggles a filter
  toggleFilter(event) {
    const filterValue = event.target.dataset.mapFilterValue;
    const isChecked = event.target.checked;

    // Update the selectedFilters state
    this.selectedFilters[filterValue] = isChecked;

    // Reset the colour of any previously coloured hexagons (given selectedFilters has changed) and empty the array they are stored in
    this.greenHexagons.forEach((hexId) => {
      this.updateHexagonColor(hexId, "#FFFFFF");
    });
    this.greenHexagons = [];

    // Reprocess hexagon colours based on new filters
    this.updateHexagonsBasedOnFilters();
  }

  // Function to update the hexagons based on selected filters
  updateHexagonsBasedOnFilters() {
    if (this.selectedFilters.pubs) {
      this.pubsValue.forEach((pub) => this.checkLocationInHexagon(pub, "#25a244"));
    }

    if (this.selectedFilters.stations) {
      this.stationsValue.forEach((station) => this.checkLocationInHexagon(station, "#25a244"));
    }
  }

  // Function to locate each instance of selected filter category (e.g., every pub) and iterate over each hexagon to check if it contains selected instance location(s)
  checkLocationInHexagon(location, color) {
    const locationPoint = turf.point([location.lon, location.lat]);

    this.hexGrid.forEach((hexagon) => {
      const hexagonPolygon = turf.polygon(hexagon.geometry.coordinates);
      const isInside = turf.booleanPointInPolygon(locationPoint, hexagonPolygon);

      // If a hexagon contains an instance location, call function to change it's colour to green
      if (isInside) {
        if (!this.greenHexagons.includes(hexagon.properties.id)) {
          this.updateHexagonColor(hexagon.properties.id, color);
          this.greenHexagons.push(hexagon.properties.id);
        }
      }
    });
  }

  // Function to update the colour of any hexagons that contain location(s) matching selecting filters
  updateHexagonColor() {
    const source = this.map.getSource("hexGrid");

    if (source) {
    const hexGridData = source._data.features;

      // Reset the the colour for each hexagon to white
      hexGridData.forEach((hex) => {
          hex.properties.fillColor = "#FFFFFF";
      });

      // Iterate through hexagons to (a) check whether an instances of the selected location(s) is within a hexagon and, if so, (b) change the colour accordingly
      hexGridData.forEach((hex) => {
          const isInsidePub = this.pubsValue.some((pub) => {
              const pubPoint = turf.point([pub.lon, pub.lat]);
              return turf.booleanPointInPolygon(pubPoint, hex);
          });

          const isInsideStation = this.stationsValue.some((station) => {
              const stationPoint = turf.point([station.lon, station.lat]);
              return turf.booleanPointInPolygon(stationPoint, hex);
          });

          // Logic to colour hexagons if 100% of selected filters are matched in a given hexagon
          if (this.selectedFilters.pubs && this.selectedFilters.stations) {
            if (isInsidePub && isInsideStation) {
                hex.properties.fillColor = "#25a244";
            }
          } else if (this.selectedFilters.pubs && isInsidePub) {
            hex.properties.fillColor = "#25a244";
          } else if (this.selectedFilters.stations && isInsideStation) {
            hex.properties.fillColor = "#25a244";
          }
      });

      // Update the Hex Grid source with the new colour data
      source.setData({
          type: "FeatureCollection",
          features: hexGridData
      });

      // Update the fill color property of the hexagon layer
      const colorExpression = ["match", ["get", "id"]];
      hexGridData.forEach((hex) => {
        colorExpression.push(hex.properties.id, hex.properties.fillColor || "#FFFFFF");
      });
      colorExpression.push("#FFFFFF");

      this.map.setPaintProperty("hexGridLayer", "fill-color", colorExpression);
    }
  }
}
