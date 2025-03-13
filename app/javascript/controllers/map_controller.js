import { Controller } from "@hotwired/stimulus"
import mapboxgl from "mapbox-gl"

export default class extends Controller {
  // Location values are retrieving location objects from seed file via Hex Grid controller & Index page
  static values = {
    apiKey: String,
    coordinates: Array,
    filters: Object,

    // Remove when filters working
    gyms: Array,
    pubs: Array,
    stations: Array,
  };

  static targets = [
    "map",
    "filters",
  ];

  // Array(s) / Object(s) to store key Filter, Hex Grid and Hexagon datas
  hexGrid = [];
  greenHexagons = [];
  selectedFilters = {};

  // Function to load the map and necessary Hex Grid functions on page load
  connect() {
    mapboxgl.accessToken = this.apiKeyValue;

    this.map = new mapboxgl.Map({
      container: this.mapTarget,
      style: "mapbox://styles/mapbox/streets-v10"
    });

    const searchBounds = [
      [-0.0100, 51.5545],
      [-0.0865, 51.5066],
    ];

    // Ensure that the map loads with the correct bounds
    this.#boundingBox(searchBounds);

    // Ensure that Hex Grid (and associated functions) is only generated once the map has loaded
    this.map.on("load", () => {
      this.map.setCenter(this.coordinatesValue);
      this.map.setZoom(13);
      this.#generateHexGrid(searchBounds);
      this.#hexagonClick();
    });

    // Initialise base state for filters
    Object.keys(this.filtersValue).forEach(filter => {
      this.selectedFilters[filter] = false;
    });
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

  // Function to handle a user toggling a filter catefory
  toggleFilter(event) {
    const filterValue = event.target.dataset.mapFilterValue;
    const isChecked = event.target.checked;

    // Update the selectedFilters state
    this.selectedFilters[filterValue] = isChecked;

    // If no filters are selected, reset all hexagons to white
    if (Object.values(this.selectedFilters).every(val => !val)) {
      this.greenHexagons = [];
      this.updateHexagonColour();
      return;
    }

    // Re-calculate which hexagons need to be marked as green based on filters now selected
    this.updateHexagonsBasedOnFilters();
  }

  // Function to update the hexagons based on selected filters
  updateHexagonsBasedOnFilters() {
    const selectedCategories = Object.keys(this.selectedFilters).filter(category => this.selectedFilters[category]);

    // If no categories are selected, reset all hexagons to white
    if (selectedCategories.length === 0) {
      this.greenHexagons = [];
      this.updateHexagonColour();
      return;
    }

    // Track hexagons per category
    const hexagonsByCategory = {};

    selectedCategories.forEach(category => {
      hexagonsByCategory[category] = new Set();

      this.filtersValue[category].forEach((location) => {
        this.hexGrid.forEach((hexagon) => {
          const hexagonPolygon = turf.polygon(hexagon.geometry.coordinates);
          const locationPoint = turf.point([location.lon, location.lat]);

          if (turf.booleanPointInPolygon(locationPoint, hexagonPolygon)) {
            hexagonsByCategory[category].add(hexagon.properties.id);
          }
        });
      });
    });

    // Find intersection:** Only hexagons appearing in *every* selected category
    let intersection = [...hexagonsByCategory[selectedCategories[0]]];

    selectedCategories.forEach(category => {
      intersection = intersection.filter(hexId => hexagonsByCategory[category].has(hexId));
    });

    // Update the green hexagons list and refresh colors
    this.greenHexagons = intersection;

    // Check if greenHexagons is not empty before calling updateHexagonColors

    this.updateHexagonColour();

  }

  // Function to find each location instance of a selected category (e.g., every pub) and iterate over each hexagon to check if it contains instance location(s)
  checkLocationInHexagon(location, color) {
    const locationPoint = turf.point([location.lon, location.lat]);

    this.hexGrid.forEach(hexagon => {
      const hexagonPolygon = turf.polygon(hexagon.geometry.coordinates);
      const isInside = turf.booleanPointInPolygon(locationPoint, hexagonPolygon);

      // If a hexagon contains an instance location, call function to change it's colour to green
      if (isInside && !this.greenHexagons.includes(hexagon.properties.id)) {
        this.updateHexagonColour(hexagon.properties.id, color);
        this.greenHexagons.push(hexagon.properties.id);
      }
    });
  }

  // Function to update the colour of any hexagons that contain location(s) matching selecting filters
  updateHexagonColour() {
    const source = this.map.getSource("hexGrid");

    // Check if the source exists
    if (!source) return;

    const hexGridData = source._data.features;

    // Step 1: Reset all hexagons to white
    hexGridData.forEach((hex) => {
      hex.properties.fillColor = "#FFFFFF";
    });

    // Step 2: Update hexagons in greenHexagons to green
    hexGridData.forEach((hex) => {
      if (this.greenHexagons.includes(hex.properties.id)) {
        hex.properties.fillColor = "#25a244";  // Set to green
      }
    });

    // Step 3: Update the hexagon source with the new data
    source.setData({
      type: "FeatureCollection",
      features: hexGridData
    });

    // Step 4: Apply the updated color information to the hex grid layer
    const colorExpression = ["match", ["get", "id"]];
    hexGridData.forEach((hex) => {
      colorExpression.push(hex.properties.id, hex.properties.fillColor || "#FFFFFF");
    });
    colorExpression.push("#FFFFFF");

    // Set the fill-color paint property for the hex grid layer
    this.map.setPaintProperty("hexGridLayer", "fill-color", colorExpression);
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
            <button class="btn btn-primary btn-hexagon" onclick="window.location.href='/hexagons/5'">
              View Hive
            </button>
          </div>`)
        .addTo(this.map);
    });
  }
}
