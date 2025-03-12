import { Controller } from "@hotwired/stimulus"
import mapboxgl from "mapbox-gl"

export default class extends Controller {
  static values = {
    apiKey: String,
  };

  static targets = [
    "filters",
    "map"
  ];

  pubs = [
    { name: "The Gun", lat: 51.5181, lon: -0.0725 },
    { name: "The Half Moon (JD Wetherspoon)", lat: 51.5247, lon: -0.0532 },
    { name: "The Hayfield", lat: 51.5281, lon: -0.0431 },
    { name: "The Black Horse", lat: 51.5290, lon: -0.0500 },
    { name: "The Old Globe", lat: 51.5239, lon: -0.0496 },
    { name: "The Angel & Crown Pub", lat: 51.5331, lon: -0.0500 },
    { name: "The Florist Arms", lat: 51.5258, lon: -0.0504 },
    { name: "The Camel", lat: 51.5230, lon: -0.0505 },
    { name: "Mother Kelly's Bethnal Green", lat: 51.5287, lon: -0.0545 },
    { name: "Salmon & Ball", lat: 51.5290, lon: -0.0606 },
    { name: "Bethnal Green Tavern", lat: 51.5280, lon: -0.0590 },
    { name: "The Dundee Arms", lat: 51.5284, lon: -0.0600 },
    { name: "The Star of Bethnal Green", lat: 51.5274, lon: -0.0606 },
    { name: "The Kings Arms", lat: 51.5250, lon: -0.0596 },
    { name: "The Horn of Plenty", lat: 51.5221, lon: -0.0473 },
    { name: "The Blackfriar", lat: 51.5147, lon: -0.0990 },
    { name: "The Cheshire Cheese", lat: 51.5139, lon: -0.1102 },
    { name: "The Ten Bells", lat: 51.5195, lon: -0.0723 },
    { name: "The Crown and Shuttle", lat: 51.5220, lon: -0.0780 },
    { name: "The Old Red Cow", lat: 51.5203, lon: -0.0705 },
    { name: "The Old Globe", lat: 51.5239, lon: -0.0496 },
    { name: "The Fountain", lat: 51.5221, lon: -0.0462 },
    { name: "The George Inn", lat: 51.5013, lon: -0.0926 },
    { name: "The Prince of Wales", lat: 51.5244, lon: -0.0856 },
    { name: "The Crown", lat: 51.5220, lon: -0.0782 },
    { name: "The Well and Bucket", lat: 51.5233, lon: -0.0627 },
    { name: "The Dog & Duck", lat: 51.5145, lon: -0.1345 },
    { name: "The Royal Oak", lat: 51.5269, lon: -0.0686 },
    { name: "The George Tavern", lat: 51.5187, lon: -0.0801 },
    { name: "The Royal Sovereign", lat: 51.5410, lon: -0.1180 },
    { name: "The Old Red Lion", lat: 51.5266, lon: -0.1047 },
    { name: "The Crown & Anchor", lat: 51.5180, lon: -0.0710 },
    { name: "The Angel", lat: 51.5413, lon: -0.1025 },
    { name: "The Eagle", lat: 51.5274, lon: -0.0632 },
    { name: "The Boundary", lat: 51.5247, lon: -0.0776 },
    { name: "The Montague Arms", lat: 51.4791, lon: -0.0463 },
    { name: "The Falcon", lat: 51.5234, lon: -0.0846 },
    { name: "The Fox", lat: 51.5219, lon: -0.0820 },
    { name: "The White Swan", lat: 51.5185, lon: -0.0712 },
    { name: "The Town of Ramsgate", lat: 51.4876, lon: -0.0976 },
    { name: "The Star", lat: 51.5522, lon: -0.0126 },
    { name: "The Bell", lat: 51.5865, lon: -0.0283 }
  ]

  stations = [
    { name: "Aldgate", lat: 51.5140, lon: -0.0756 },
    { name: "Aldgate East", lat: 51.5154, lon: -0.0727 },
    { name: "Angel", lat: 51.5327, lon: -0.1030 },
    { name: "Bank", lat: 51.5134, lon: -0.0890 },
    { name: "Bethnal Green", lat: 51.5272, lon: -0.0553 },
    { name: "Borough", lat: 51.5047, lon: -0.0912 },
    { name: "Bow Road", lat: 51.5265, lon: -0.0247 },
    { name: "Cambridge Heath", lat: 51.5305, lon: -0.0559 },
    { name: "Canary Wharf", lat: 51.5033, lon: -0.0258 },
    { name: "Camden Town", lat: 51.5419, lon: -0.1448 },
    { name: "Charing Cross", lat: 51.5074, lon: -0.1276 },
    { name: "Dalston Junction", lat: 51.5465, lon: -0.0739 },
    { name: "Dalston Kingsland", lat: 51.5485, lon: -0.0760 },
    { name: "Devons Road", lat: 51.5207, lon: -0.0167 },
    { name: "Euston", lat: 51.5290, lon: -0.1337 },
    { name: "Farringdon", lat: 51.5204, lon: -0.1055 },
    { name: "Hackney Central", lat: 51.5472, lon: -0.0556 },
    { name: "Hackney Downs", lat: 51.5480, lon: -0.0600 },
    { name: "Hackney Wick", lat: 51.5435, lon: -0.0255 },
    { name: "Hoxton", lat: 51.5312, lon: -0.0767 },
    { name: "Haggerston", lat: 51.5382, lon: -0.0755 },
    { name: "Homerton", lat: 51.5477, lon: -0.0429 },
    { name: "Kings Cross", lat: 51.5307, lon: -0.1236 },
    { name: "Langdon Park", lat: 51.5235, lon: -0.0094 },
    { name: "Limehouse", lat: 51.5105, lon: -0.0244 },
    { name: "London Bridge", lat: 51.5074, lon: -0.0877 },
    { name: "London Fields", lat: 51.5422, lon: -0.0575 },
    { name: "Liverpool Street", lat: 51.5175, lon: -0.0823 },
    { name: "Mile End", lat: 51.5251, lon: -0.0334 },
    { name: "Old Street", lat: 51.5236, lon: -0.0870 },
    { name: "Pimlico", lat: 51.4913, lon: -0.1267 },
    { name: "Pudding Mill Lane", lat: 51.5147, lon: -0.0101 },
    { name: "Shadwell", lat: 51.5122, lon: -0.0569 },
    { name: "Shoreditch High Street", lat: 51.5235, lon: -0.0755 },
    { name: "South Quay", lat: 51.5021, lon: -0.0223 },
    { name: "Stepney Green", lat: 51.5215, lon: -0.0466 },
    { name: "St. Paul's", lat: 51.5139, lon: -0.0984 },
    { name: "Tower Hill", lat: 51.5100, lon: -0.0773 },
    { name: "Vauxhall", lat: 51.4844, lon: -0.1187 },
    { name: "Wapping", lat: 51.5082, lon: -0.0617 },
    { name: "Waterloo", lat: 51.5030, lon: -0.1128 },
    { name: "Whitechapel", lat: 51.5194, lon: -0.0615 }
  ]

  selectedFilters = {
    pubs: false,
    stations: false
  };

  hexGrid = [];
  greenHexagons = [];  // Store hexagon ids that have been colored green

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
    this.map.on("load", () => {
      this.#generateHexGrid(searchBounds);
      this.#hexagonClick();
    });
  }

  #boundingBox(searchBounds) {
    this.map.fitBounds(searchBounds, { padding: 70, maxZoom: 15, duration: 0.3 });
  }

  #generateHexGrid(searchBounds) {
    const options = { units: "kilometers" };
    const hexGrid = turf.hexGrid(searchBounds.flat(), 0.4, options);

    const hexGridWithIds = hexGrid.features.map((feature, index) => {
      feature.properties = feature.properties || {};
      feature.properties.id = index;
      return feature;
    });
    this.hexGrid = hexGridWithIds;

    this.map.addSource("hexGrid", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: hexGridWithIds
      }
    });

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
            <button class="btn btn-primary btn-hexagon" onclick="window.location.href='/hexagons/2'">
              View Hive
            </button>
          </div>`)
        .addTo(this.map);
    });
  }

  toggleFilter(event) {
    const filterValue = event.target.dataset.mapFilterValue;
    const isChecked = event.target.checked;

    // Update filter state
    this.selectedFilters[filterValue] = isChecked;

    // Clear previously colored hexagons
    this.greenHexagons.forEach((hexId) => {
      this.updateHexagonColor(hexId, "#FFFFFF"); // Reset color to white
    });
    this.greenHexagons = [];  // Clear green hexagons list

    // Reprocess hexagons based on selected filters
    this.updateHexagonsBasedOnFilters();
  }

  updateHexagonsBasedOnFilters() {
    console.log("Updating hexagons based on filters");
    console.log("Selected Filters:", this.selectedFilters); // Log the filter state

    if (this.selectedFilters.pubs) {
      console.log("Processing pubs");
      this.pubs.forEach((pub) => this.checkLocationInHexagon(pub, "#25a244"));
    } else {
      console.log("Pubs filter is not selected");
    }

    if (this.selectedFilters.stations) {
      console.log("Processing stations");
      this.stations.forEach((station) => this.checkLocationInHexagon(station, "#25a244"));
    } else {
      console.log("Stations filter is not selected");
    }
  }

  checkLocationInHexagon(location, color) {
    const locationPoint = turf.point([location.lon, location.lat]);

    this.hexGrid.forEach((hexagon) => {
      const hexagonPolygon = turf.polygon(hexagon.geometry.coordinates);
      const isInside = turf.booleanPointInPolygon(locationPoint, hexagonPolygon);

      if (isInside) {
        if (!this.greenHexagons.includes(hexagon.properties.id)) {
          this.updateHexagonColor(hexagon.properties.id, color);
          this.greenHexagons.push(hexagon.properties.id);
        }
      }
    });
  }

  updateHexagonColor(hexagonId, color) {
    const source = this.map.getSource("hexGrid");

    if (source) {
      const hexGridData = source._data.features;

      hexGridData.forEach((hex) => {
        if (hex.properties.id === hexagonId) {
          hex.properties.fillColor = color;
        }
      });

      source.setData({
        type: "FeatureCollection",
        features: hexGridData
      });

      const colorExpression = ["match", ["get", "id"]];
      hexGridData.forEach((hex) => {
        colorExpression.push(hex.properties.id, hex.properties.fillColor || "#FFFFFF");
      });
      colorExpression.push("#FFFFFF");

      this.map.setPaintProperty("hexGridLayer", "fill-color", colorExpression);
    }
  }
}

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





// OLD CODE - - - - - - - - - - - - - - - - - - - - - -





// Code to generate the hexagons via Ruby (server-side)
// export default class extends Controller {
//   static values = {
//     apiKey: String,
//   }

//   connect() {
//     mapboxgl.accessToken = this.apiKeyValue

//     console.log("JS up and running")

//     this.map = new mapboxgl.Map({
//       container: this.element,
//       style: "mapbox://styles/mapbox/streets-v10",
//     })

//     const londonBounds = [
//       [-0.489, 51.28],
//       [0.236, 51.686]
//     ];

//     this.#boundingBox(londonBounds)
//     // this.#hexagonOverlay()

//     // this.map.on('load', () => {
//     //   this.#hexagonOverlay()
//     // })
//   }

//   // Function to load map centered on London bounds
//   #boundingBox(londonBounds) {
//     this.map.fitBounds(londonBounds, { padding: 70, maxZoom: 15, duration: 0.3 });
//   }

  // Function to retrieve hexagons from Ruby and render map overlay via Turf.js
  // #hexagonOverlay() {
  //   fetch("/hex_grids", {
  //     method: "GET",
  //     headers: {
  //       "Accept": "application/json"
  //     }
  //   })
  //   .then(response => response.json())
  //   .then((data) => {
  //     console.log(data);

  //     // Create a GeoJSON feature collection for hexagons
  //     let hexagonGeoJSON = {
  //       type: "FeatureCollection",
  //       features: []
  //     }

  //     // Loop through each hexagon data point
  //     data.forEach(hex => {
  //       // Call the createHexagon function with lon and lat
  //       const hexagon = this.#createHexagon(hex.lon, hex.lat)

  //       // Add the generated hexagon as a feature to the GeoJSON collection
  //       hexagonGeoJSON.features.push(hexagon)
  //     })

  //     // Once the map is loaded, add the hexagons to the map
  //     this.map.on('load', () => {
  //       console.log("map load")
  //       this.map.addSource('hexagons', {
  //         type: 'geojson',
  //         data: hexagonGeoJSON
  //       })
  //       console.log("source added")

  //       this.map.addLayer({
  //         id: 'hexagons-layer',
  //         type: 'fill',
  //         source: 'hexagons',
  //         paint: {
  //           'fill-color': '#f00',
  //           'fill-opacity': 0.5
  //         }
  //       })
  //       console.log("layer added")
  //     })
  //   })
  //   .catch((error) => console.error("Error fetching hex grid data:", error));
  // }

  // #createHexagon(lon, lat) {
  //   const options = { units: "meters" }
  //   const hexagonCentre = turf.point([lon, lat])
  //   const hexagon = turf.hexagon(hexagonCentre.geometry.coordinates, 500, options)
  //   // const hexagon = turf.hexGrid([lon - 0.005, lat - 0.005, lon + 0.005, lat + 0.005], 500, options)

  //   return {
  //     type: "Feature",
  //     geometry: hexagon.geometry,
  //     properties: {}
  //   }
  // }


  // .then((data) => {
  //   console.log(data); // Check the fetched data

  //   // Create a GeoJSON feature collection for hexagons
  //   let hexagonGeoJSON = {
  //     type: "FeatureCollection",
  //     features: []
  //   }

  //   // Loop through each hexagon data point
  //   data.forEach(hex => {
  //     // Create a point from lat/lon for each hexagon center
  //     const point = turf.point([hex.lon, hex.lat])

  //     // Generate a hexagon around each point with a 500-meter radius (adjust this if needed)
  //     const hexagon = turf.circle(point, 500, { units: 'meters', steps: 6 })

  //     // Add the generated hexagon as a feature to the GeoJSON collection
  //     hexagonGeoJSON.features.push(hexagon)
  //   })

  //   // Once the map is loaded, add the hexagons to the map
  //   this.map.on('load', () => {
  //     this.map.addSource('hexagons', {
  //       type: 'geojson',
  //       data: hexagonGeoJSON
  //     })

  //     this.map.addLayer({
  //       id: 'hexagons-layer',
  //       type: 'fill',
  //       source: 'hexagons',
  //       paint: {
  //         'fill-color': '#f00',  // Red color for hexagons
  //         'fill-opacity': 0.5    // Set opacity for transparency
  //       }
  //     })
  //   })
  // })

  // async #addHexagon() {
  //   // Retrieve the hexagons array from Rails
  //   const hexGridControllerResponse = await fetch("/hex_grids")
  //   const hexagonData = await hexGridControllerResponse.json()
  //   console.log("hello")
  //   // Iterate through hexagons, using the centre-point for each to define it's outer bounds
  //   const hexagonFeatures = hexagonData.map(polygon => {
  //     return this.#createHexagon(polygon.lon, polygon.lat)
  //   })
  //   console.log("hello1")
  //   this.map.addSource("hexagons", {
  //     type: "geojson",
  //     data: {
  //       type: "FeatureCollection",
  //       features: hexagonFeatures
  //     }
  //   })
  //   console.log("hello2")
  //   this.map.addLayer({
  //     id: "hex-layer",
  //     type: "fill",
  //     source: "hexagons",
  //     paint: {
  //       "fill-color": "#90ee90",
  //       "fill-opacity": 0.5,
  //       "fill-outline-color": "#000"
  //     }
  //   })
  // }
