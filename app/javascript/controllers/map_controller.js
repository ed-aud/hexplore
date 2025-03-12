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
            <button class="btn btn-primary btn-hexagon" onclick="window.location.href='/hexagons/5'">
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





// OLD CODE - - - - - - - - - - - - - - - - - - - - - -
//   // Store filters that a user selects
//   selectedFilters = {};
//   // Store which hexagons are shaded green (via their ID) in case a user toggles off a certain filter
//   greenHexagons = [];

//   connect() {
//     mapboxgl.accessToken = this.apiKeyValue;

//     this.map = new mapboxgl.Map({
//       container: this.mapTarget,
//       style: "mapbox://styles/mapbox/streets-v10",
//     });

//     const searchBounds = [
//       [-0.0100, 51.5545],
//       [-0.0865, 51.5066],
//     ];

//     this.#boundingBox(searchBounds);
//     this.map.on("load", () => {
//       this.#generateHexGrid(searchBounds);
//       this.#hexagonClick();
//     });
//   }

//   // Function to define the outer bounds of the base map
//   #boundingBox(searchBounds) {
//     this.map.fitBounds(searchBounds, { padding: 70, maxZoom: 15, duration: 0.3 });
//   }

//   // Function to generate the base Hex Grid, overlaid onto the same outer bounds as the base map
//   #generateHexGrid(searchBounds) {
//     const options = { units: "kilometers" };
//     const hexGrid = turf.hexGrid(searchBounds.flat(), 0.4, options);

//     // Ensure each hexagon has an associated ID stored in its properties and store for later use
//     const hexGridWithIds = hexGrid.features.map((feature, index) => {
//       feature.properties = feature.properties || {}; // Ensure properties exist
//       feature.properties.id = index; // Assign a unique 'id' for each hexagon
//       return feature;
//     });
//     this.hexGrid = hexGridWithIds;

//     // Pass the hexagons from the Hex Grid to Turf.js
//     this.map.addSource("hexGrid", {
//       type: "geojson",
//       data: {
//         type: "FeatureCollection",
//         features: hexGridWithIds
//       }
//     });

//     // Overlay the Hex Grid layer on the map
//     this.map.addLayer({
//       id: "hexGridLayer",
//       type: "fill",
//       source: "hexGrid",
//       layout: {},
//       paint: {
//         "fill-color": "#ffffff",
//         "fill-opacity": 0.6,
//         "fill-outline-color": "#000000",
//       },
//     });
//   }

//   // Function to locate each instance of selected filter location and iterate over each hexagon to check if it contains selected location(s)
//   checkLocationInHexagon(location) {
//     const locationPoint = turf.point([location.lon, location.lat]);

//     this.hexGrid.forEach((hexagon) => {
//       const hexagonPolygon = turf.polygon(hexagon.geometry.coordinates);
//       const isInside = turf.booleanPointInPolygon(locationPoint, hexagonPolygon);

//       if (isInside) {
//         console.log(`${location.name} is inside hexagon ${hexagon.properties.id}`);
//         this.updateHexagonColor(hexagon.properties.id, "#25a244");
//         this.greenHexagons.push(hexagon.properties.id); // Store the green hexagon id
//       }
//     });
//   }

//   // Function to update the colour of any hexagons that do contain location(s) matching selecting filters
//   updateHexagonColor(hexagonIds, color) {
//     const layer = this.map.getLayer("hexGridLayer");

//     if (layer) {
//       const source = this.map.getSource("hexGrid");

//       if (source) {
//         const hexGridData = source._data.features;

//         // Ensure matched hexagon IDs are stored as an array
//         if (!Array.isArray(hexagonIds)) {
//           hexagonIds = [hexagonIds];
//         }

//         // Set colors in the properties of the hexagons
//         hexGridData.forEach((hex) => {
//           if (hexagonIds.includes(hex.properties.id)) {
//             hex.properties.fillColor = color; // Apply the color
//           } else if (!hex.properties.fillColor) {
//             hex.properties.fillColor = "#FFFFFF"; // Default color for non-matched hexagons
//           }
//         });

//         // After modifying the data, we need to update the source
//         source.setData({
//           type: "FeatureCollection",
//           features: hexGridData
//         });

//         // Construct the 'match' expression with hexagon IDs and colors
//         const colorExpression = ["match", ["get", "id"]];

//         // Add each hexagon's id and its color to the expression
//         hexGridData.forEach((hex) => {
//           colorExpression.push(hex.properties.id, hex.properties.fillColor || "#FFFFFF");
//         });

//         // Fallback color if no match is found
//         colorExpression.push("#FFFFFF");

//         // Update the fill color dynamically using the paint property
//         this.map.setPaintProperty("hexGridLayer", "fill-color", colorExpression);
//       }
//     } else {
//       console.error("Hex grid layer or source not found");
//     }
//   }

//   // Function to find each location associated with a given filter and pass each to the function looking for matched Hexagons
//   processLocations() {
//     this.stations.forEach((station) => this.checkLocationInHexagon(station));
//   }

//   // Function to populated the toggledFilters object with all selected options
//   toggleFilter(event) {
//     const filterValue = event.target.dataset.mapFilterValue;
//     const isChecked = event.target.checked;

//     if (isChecked) {
//       this.selectedFilters[filterValue] = true;
//       this.processLocations(); // Recheck stations and highlight them
//     } else {
//       delete this.selectedFilters[filterValue];

//       // Remove green shading from hexagons
//       this.greenHexagons.forEach((hexId) => {
//         this.updateHexagonColor(hexId, "#FFFFFF"); // Set color back to white
//       });
//       this.greenHexagons = []; // Clear the list of green hexagons
//     }

//     console.log("Currently toggled filters:", this.selectedFilters);
//   }

//   // Function to allow a user to click on a hexagon to see information
//   #hexagonClick() {
//     this.map.on("click", "hexGridLayer", (event) => {
//       const clickedHexagonId = event.features[0].properties.id;
//       const coordinates = event.lngLat;
//       new mapboxgl.Popup()
//         .setLngLat(coordinates)
//         .setHTML(
//           `<div class="clicked-hexagon">
//             <strong class="hexagon-title">Hive ${clickedHexagonId}</strong>
//             <p>(${coordinates.lng.toFixed(5)}, ${coordinates.lat.toFixed(5)})</p>
//             <button class="btn btn-primary btn-hexagon" onclick="window.location.href='/hexagons/2'">
//               View Hive
//             </button>
//           </div>`)
//         .addTo(this.map);
//     });
//   }
// }
