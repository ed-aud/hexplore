import { Controller } from "@hotwired/stimulus"
import mapboxgl from "mapbox-gl"

export default class extends Controller {
  // Location values are retrieving location objects from seed file via Hex Grid controller & Index page
  static values = {
    apiKey: String,
    coordinates: Array,
    gyms: Array,
    pubs: Array,
    stations: Array,
    latitude: Number,
    longitude: Number,
    filters: Object,
    hexagonId: Number,
  };

  static targets = [
    "map",
    "filters",
    "output",
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

    // Take search coordinates and define a constant Hex Grid & Map load size
    let centrePoint = []
    this.coordinatesValue === null ? centrePoint = [-0.1278, 51.5074] : centrePoint = this.coordinatesValue
    const nwPoint = [(centrePoint[0] + 0.03825), (centrePoint[1] + 0.02395)]
    const sePoint = [(centrePoint[0] - 0.03825), (centrePoint[1] - 0.02395)]
    const searchBounds = [nwPoint, sePoint]

    // Load the map based on search
    this.#boundingBox(searchBounds);

    // Load the Hex Grid (and associated functions) based on search and once map has loaded
    this.map.on("load", () => {
      this.map.setCenter(this.coordinatesValue);
      this.map.setZoom(13);
      this.#generateHexGrid(searchBounds);
      this.#hexagonClick();
      // this.#sendCoordinates();
    });

    // Initialise base state for filters
    Object.keys(this.filtersValue).forEach(filter => {
      this.selectedFilters[filter] = false;
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
    this.updateHexagonSelectionPerFilters();
  }

  // Function to update hexagons based on selected filters
  updateHexagonSelectionPerFilters() {
    const hexagonsPerCategory = {};
    const selectedCategories = Object.keys(this.selectedFilters).filter(category => this.selectedFilters[category]);

    // Function to find each location in a selected category (e.g., every pub) and iterate over each hexagon to check if it contains location instance(s)
    selectedCategories.forEach(category => {
      hexagonsPerCategory[category] = new Set();

      this.filtersValue[category].forEach((location) => {
        this.hexGrid.forEach((hexagon) => {
          const hexagonPolygon = turf.polygon(hexagon.geometry.coordinates);
          const locationPoint = turf.point([location.lon, location.lat]);

          if (turf.booleanPointInPolygon(locationPoint, hexagonPolygon)) {
            hexagonsPerCategory[category].add(hexagon.properties.id);
          }
        });
      });
    });

    // Find the hexagons which contain an instance of each selected filter (i.e., intersection of all desired categories)
    let intersection = [...hexagonsPerCategory[selectedCategories[0]]];

    selectedCategories.forEach(category => {
      intersection = intersection.filter(hexId => hexagonsPerCategory[category].has(hexId));
    });

    // Update array of Hexagons to be shaded green and call function to update their colour accordingly
    this.greenHexagons = intersection;
    this.updateHexagonColour();
  }

  // Function to update the colour of any hexagons that contain location(s) matching selected filters
  updateHexagonColour() {
    // Find map source, checking if a valid source exists
    const source = this.map.getSource("hexGrid");
    if (!source) return;

    const hexGridData = source._data.features;

    // Function to reset all hexagons to white
    hexGridData.forEach((hex) => {
      hex.properties.fillColor = "#FFFFFF";
    });

    // Function to updated Hexagons in greenHexagons array to green
    hexGridData.forEach((hex) => {
      if (this.greenHexagons.includes(hex.properties.id)) {
        hex.properties.fillColor = "#25a244";  // Set to green
      }
    });

    // Function to pass the Hex Grid map the new data
    source.setData({
      type: "FeatureCollection",
      features: hexGridData
    });

    // Function to pass the new data to the Hex Grid layer
    const colorExpression = ["match", ["get", "id"]];
    hexGridData.forEach((hex) => {
      colorExpression.push(hex.properties.id, hex.properties.fillColor || "#FFFFFF");
    });
    colorExpression.push("#FFFFFF");

    // Function to update the fill colour of the Hex Grid layer
    this.map.setPaintProperty("hexGridLayer", "fill-color", colorExpression);
  }

  // Function to allow a user to click on a hexagon to see an info pop-up
  #hexagonClick() {
    this.map.on("click", "hexGridLayer", (event) => {
      event.preventDefault();
      const clickedHexagonId = event.features[0].properties.id;
      console.log(clickedHexagonId);
      let hexCoords;
      this.hexGrid.forEach((hexagon) => {
        if (hexagon.properties.id === clickedHexagonId) {
          hexCoords = turf.centroid(hexagon)
          console.log({hexCoords})
        }
      })
      const coordinates = event.lngLat;
      const coordinates1 = hexCoords;

      // console.log(coordinates1.geometry.coordinates[0]);

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          `<div class="clicked-hexagon">
            <strong class="hexagon-title">Hive ${clickedHexagonId}</strong>
            <p>(${coordinates1.geometry.coordinates[0]}, ${coordinates1.geometry.coordinates[1]})</p>
            <button class="btn btn-primary btn-hexagon" >
              View Hive
            </button>
            <form name="myForm" action="/hexagons" method="post">
              <input type="text" name="hexagon[lat]" value="${coordinates1.geometry.coordinates[0]}">
              <input type="text" name="hexagon[lon]" value="${coordinates1.geometry.coordinates[1]}">
              <input type="submit" name="commit" value="View Hive">
            </form>
          </div>`)
        .addTo(this.map);
    });
  }
}
