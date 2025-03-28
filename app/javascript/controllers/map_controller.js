import { Controller } from "@hotwired/stimulus"
import mapboxgl from "mapbox-gl"

export default class extends Controller {
  // Location values are retrieving location objects from seed file via Pages controller & Index page
  static values = {
    apiKey: String,
    coordinates: Array,
    marker: Object,
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
    "inputChecked"
  ];

  // Array(s) / Object(s) to store key Filter, Hex Grid and Hexagon datas
  hexGrid = [];
  matchedHexagons = [];
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

    // Formats coordinates to be accepted by setMaxBounds method
    const nwPointBB = [(centrePoint[0] + 0.04110), (centrePoint[1] + 0.02095)]
    const sePointBB = [(centrePoint[0] - 0.04110), (centrePoint[1] - 0.02095)]
    const boundingBox = new mapboxgl.LngLatBounds(sePointBB, nwPointBB);

    // Load the map based on search
    this.map.setMaxBounds(boundingBox);

    // Load the Hex Grid (and associated functions) based on search and once map has loaded
    this.map.on("load", () => {
      this.generateHexGrid(searchBounds);
      this.hexagonClick();
      this.toggleFilterOnReload();

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

  // Function to generate the base Hex Grid, overlaid onto the same outer bounds as the base map
  generateHexGrid(searchBounds) {
    const options = { units: "kilometers" };
    const hexGrid = turf.hexGrid(searchBounds.flat(), 0.4, options);

    // Ensure each hexagon has a unique ID stored in its properties to retrieve later when looking for matches
    const hexGridWithIds = hexGrid.features.map((feature, index) => {
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
        "fill-color": "#92E6A7",
        "fill-opacity": 0.4,
        "fill-outline-color": "#000000",
      },
    });


    const fullScreenPolygon = turf.polygon([
      [
        [-180, 90],
        [180, 90],
        [180, -90],
        [-180, -90],
        [-180, 90]
      ],
    ]);

    const hexGridPolygons = turf.multiPolygon(
      hexGridWithIds.map(hex => hex.geometry.coordinates)
    );

    const maskPolygon = turf.difference(fullScreenPolygon, hexGridPolygons);

    // Add the outer blur layer (the mask)
    this.map.addLayer({
      id: "outerBlur",
      type: "fill",
      source: {
        type: "geojson",
        data: maskPolygon
      },
      layout: {},
      paint: {
        "fill-color": "rgba(250, 250, 250, 0.9)",
        "fill-opacity": 1,
        "fill-outline-color": "#000000"
      }
    });
  }

  // Function to handle a user toggling a filter catefory
  toggleFilter(event) {
    const filterValue = event.target.dataset.mapFilterValue;
    const isChecked = event.target.checked;
    // Update the selectedFilters state
    this.selectedFilters[filterValue] = isChecked;
    // debugger
    // If no filters are selected, reset all hexagons to white
    if (Object.values(this.selectedFilters).every(val => !val)) {
      this.matchedHexagons = this.hexGrid.map(hex => hex.properties.id);
      this.updateHexagonColour();
      return;
    }

    // Re-calculate which hexagons need to be marked as green based on selected filters
    this.updateHexagonSelectionPerFilters();
  }

  toggleFilterOnReload(event) {
    // Get the current URL params & split into individual values
    let params = new URLSearchParams(window.location.href);
    const filtersValue = params.get('filters').split(' ')[0].split(',')

    // Function to check if filters value is equal with target data set (and check box if it is)
    filtersValue.forEach(element => {
      this.inputCheckedTargets.forEach((target)=>{
        if (
          target.dataset.mapFilterValue.includes(element) ||
          element.includes(target.dataset.mapFilterValue)
        ) {
          target.checked = true;
          this.selectedFilters[target.dataset.mapFilterValue] = true;
        }

      })
    })
    if (Object.values(this.selectedFilters).every(val => !val)) {
      this.matchedHexagons = [];
      this.updateHexagonColour();
      return;
    }
    this.updateHexagonSelectionPerFilters();

    // Remove previous search filters from params
    const url = new URL(window.location.href);
    url.searchParams.delete('filters');
    window.history.replaceState({}, '', url);
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
    this.matchedHexagons = intersection;
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
      hex.properties.fillColor = "#92E6A7";
    });

    // Function to updated Hexagons in matched hexagons array to green
    hexGridData.forEach((hex) => {
      if (this.matchedHexagons.includes(hex.properties.id)) {
        hex.properties.fillColor = "#92E6A7";
      } else {
        hex.properties.fillColor = "#FFFFFF"
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
      colorExpression.push(hex.properties.id, hex.properties.fillColor || "#9CFBAB");
    });
    colorExpression.push("#9CFBAB");

    // Function to update the fill colour of the Hex Grid layer
    this.map.setPaintProperty("hexGridLayer", "fill-color", colorExpression);
  }

  // Function to allow a user to click on a hexagon to see an info pop-up
  hexagonClick() {
    this.map.on("click", "hexGridLayer", (event) => {
      event.preventDefault();

      const clickedHexagonId = event.features[0].properties.id;
      let hexCoords;
      this.hexGrid.forEach((hexagon) => {
        if (hexagon.properties.id === clickedHexagonId) {
          hexCoords = turf.centroid(hexagon)
        }
      })

      const coordinates = event.lngLat;
      const coordinates1 = hexCoords;
      const selectedFilterArray = []

      Object.entries(this.selectedFilters).filter(([key, value]) => {
        value === true && selectedFilterArray.push(key)
      })

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          `<div class="clicked-hexagon">
            <p>Click here to learn more about this hexagon and add it to your hive!</p>
            <form name="myForm" action="/hexagons" method="post">
              <input type="hidden" name="myparam" value="${window.location.search}">
              <input type="hidden" name="hexagon[lat]" value="${coordinates1.geometry.coordinates[1]}">
              <input type="hidden" name="hexagon[lon]" value="${coordinates1.geometry.coordinates[0]}">
              <input type="hidden" name="pois" value="${selectedFilterArray}">
              <input type="submit" name="commit" value="View Hexagon" class="btn btn-primary btn-hexagon-pop-up">
            </form>
          </div>`)
        .addTo(this.map);
    });
  }
}
