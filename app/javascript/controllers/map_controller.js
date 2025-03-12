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

  parks = [
    { name: "Victoria Park", lat: 51.5313, lon: -0.0367 },
    { name: "Mile End Park", lat: 51.5220, lon: -0.0405 },
    { name: "Hampstead Heath", lat: 51.5560, lon: -0.1630 },
    { name: "Regent's Park", lat: 51.5316, lon: -0.1537 },
    { name: "Brunswick Square", lat: 51.5230, lon: -0.1280 },
    { name: "Putney Lower Common", lat: 51.4464, lon: -0.2150 },
    { name: "Clissold Park", lat: 51.5656, lon: -0.0973 },
    { name: "Stepney Green Park", lat: 51.5197, lon: -0.0527 },
    { name: "St John's Square", lat: 51.5228, lon: -0.1065 },
    { name: "Russell Square", lat: 51.5243, lon: -0.1267 },
    { name: "Barbican Estate Gardens", lat: 51.5201, lon: -0.0928 },
    { name: "Finsbury Park", lat: 51.5656, lon: -0.1018 },
    { name: "Tower Hamlets Cemetery Park", lat: 51.5228, lon: -0.0295 },
    { name: "London Fields", lat: 51.5465, lon: -0.0655 },
    { name: "King's Square Gardens", lat: 51.5225, lon: -0.1005 },
    { name: "Shoreditch Park", lat: 51.5311, lon: -0.0859 },
    { name: "Parks and Gardens at the Museum of London", lat: 51.5181, lon: -0.0962 },
    { name: "Borough Gardens", lat: 51.4949, lon: -0.0878 },
    { name: "Bethnal Green Gardens", lat: 51.5261, lon: -0.0571 },
    { name: "Brockwell Park", lat: 51.4482, lon: -0.0980 },
    { name: "Haggerston Park", lat: 51.5343, lon: -0.0757 },
    { name: "Peckham Rye Park", lat: 51.4667, lon: -0.0594 },
    { name: "Exmouth Market Gardens", lat: 51.5244, lon: -0.1064 },
    { name: "Wapping Green", lat: 51.5073, lon: -0.0653 },
    { name: "Hackney Downs", lat: 51.5500, lon: -0.0597 },
    { name: "Mansford Street Park", lat: 51.5225, lon: -0.0625 },
    { name: "Greenwich Peninsula Ecology Park", lat: 51.4985, lon: 0.0107 },
    { name: "Epping Forest (north edge)", lat: 51.6667, lon: 0.0399 },
    { name: "Old Street Garden", lat: 51.5261, lon: -0.0850 },
    { name: "Redchurch Street Green Space", lat: 51.5223, lon: -0.0711 },
    { name: "Spitalfields City Farm", lat: 51.5201, lon: -0.0742 },
    { name: "Bunhill Fields Burial Ground", lat: 51.5249, lon: -0.0890 },
    { name: "Cannon Street Green", lat: 51.5043, lon: -0.0789 },
    { name: "Southbank Green Space", lat: 51.5072, lon: -0.1140 },
    { name: "Paddington Green", lat: 51.5233, lon: -0.1925 }
  ]

  selectedFilters = {}; // Keeps track of selected filters

  connect() {
    mapboxgl.accessToken = this.apiKeyValue;

    this.map = new mapboxgl.Map({
      container: this.mapTarget,
      style: "mapbox://styles/mapbox/streets-v10",
    });

    const londonBounds = [
      [-0.489, 51.28],
      [0.236, 51.686],
    ];

    this.#boundingBox(londonBounds);
    this.map.on("load", () => {
      this.#generateHexGrid(londonBounds);
      this.#hexagonClick();
    });
  }

  #boundingBox(londonBounds) {
    this.map.fitBounds(londonBounds, { padding: 70, maxZoom: 15, duration: 0.3 });
  }

  #generateHexGrid(londonBounds) {
    const options = { units: "kilometers" };
    const hexGrid = turf.hexGrid(londonBounds.flat(), 0.5, options);

    // Ensure each hexagon has an 'id' in its properties
    const hexGridWithIds = hexGrid.features.map((feature, index) => {
      feature.properties = feature.properties || {}; // Ensure properties exist
      feature.properties.id = index; // Assign a unique 'id' for each hexagon
      return feature;
    });

    // Store hexGridWithIds in the class instance for later use
    this.hexGrid = hexGridWithIds;

    // Add the hexGrid data to the Mapbox source
    this.map.addSource("hexGrid", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: hexGridWithIds
      }
    });

    // Add the hex grid layer to the map
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

  checkLocationInHexagon(location) {
    const locationPoint = turf.point([location.lon, location.lat]);

    // Iterate over each hexagon stored in this.hexGrid and check if it contains selected location(s)
    this.hexGrid.forEach((hexagon) => {
      const hexagonPolygon = turf.polygon(hexagon.geometry.coordinates);
      const isInside = turf.booleanPointInPolygon(locationPoint, hexagonPolygon);

      if (isInside) {
        console.log(`${location.name} is inside hexagon ${hexagon.properties.id}`);
        this.updateHexagonColor(hexagon.properties.id, "#25a244");
      }
    });
  }

  updateHexagonColor(hexagonIds, color) {
    const layer = this.map.getLayer("hexGridLayer");

    if (layer) {
      const source = this.map.getSource("hexGrid");

      if (source) {
        const hexGridData = source._data.features;

        // Ensure hexagonIds is an array
        if (!Array.isArray(hexagonIds)) {
          hexagonIds = [hexagonIds]; // Wrap the hexagonId in an array if it's not already
        }

        // Set colors in the properties of the hexagons
        hexGridData.forEach((hex) => {
          if (hexagonIds.includes(hex.properties.id)) {
            hex.properties.fillColor = color; // Apply the color
          } else if (!hex.properties.fillColor) {
            hex.properties.fillColor = "#FFFFFF"; // Default color for non-matched hexagons
          }
        });

        // After modifying the data, we need to update the source
        source.setData({
          type: "FeatureCollection",
          features: hexGridData
        });

        // Construct the 'match' expression with hexagon IDs and colors
        const colorExpression = ["match", ["get", "id"]];

        // Add each hexagon's id and its color to the expression
        hexGridData.forEach((hex) => {
          colorExpression.push(hex.properties.id, hex.properties.fillColor || "#FFFFFF");
        });

        // Fallback color if no match is found
        colorExpression.push("#FFFFFF");

        // Update the fill color dynamically using the paint property
        this.map.setPaintProperty("hexGridLayer", "fill-color", colorExpression);
      }
    } else {
      console.error("Hex grid layer or source not found");
    }
  }

  processLocations() {
    this.parks.forEach((park) => this.checkLocationInHexagon(park));
  }

  toggleFilter(event) {
    const filterValue = event.target.dataset.mapFilterValue;
    const isChecked = event.target.checked;

    if (isChecked) {
      this.selectedFilters[filterValue] = true;
    } else {
      delete this.selectedFilters[filterValue];
    }

    console.log("Currently toggled filters:", this.selectedFilters);

    this.processLocations();
  }

  #hexagonClick() {
    this.map.on("click", "hexGridLayer", (event) => {
      const clickedHexagonId = event.features[0].properties.id;
      const coordinates = event.lngLat;
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<strong>Hive ${clickedHexagonId}</strong><br> ${coordinates.lng.toFixed(5)}, ${coordinates.lat.toFixed(5)}`)
        .addTo(this.map);
    });
  }
}




// export default class extends Controller {
//   static values = {
//     apiKey: String,
//   };

//   static targets = [
//     "filters",
//     "map"
//   ];

//   // Empty object to store selected filters
//   selectedFilters = {};

//   connect() {
//     mapboxgl.accessToken = this.apiKeyValue;

//     this.map = new mapboxgl.Map({
//       container: this.mapTarget,
//       style: "mapbox://styles/mapbox/streets-v10",
//     });

//     const londonBounds = [
//       [-0.489, 51.28],
//       [0.236, 51.686],
//     ];

//     // Define outer bounds for London and once map is loaded layer on the HexGrid
//     this.#boundingBox(londonBounds);
//     this.map.on("load", () => {
//       this.#generateHexGrid(londonBounds);
//       this.#hexagonClick();
//     });

//     this.fetchParksInLondon();
//   }

//   // Function to load map centered on London bounds
//   #boundingBox(londonBounds) {
//     this.map.fitBounds(londonBounds, { padding: 70, maxZoom: 15, duration: 0.3 });
//   }

//   // Function to add HexGrid overlay and collect hexagon centre points
//   #generateHexGrid(londonBounds) {
//     const options = { units: "kilometers" };
//     const hexGrid = turf.hexGrid(londonBounds.flat(), 1, options);

//     // Assign each hexagon an ID and calculate its centre-point (lat / lon)
//     const hexagonData = this.#calculateHexagonData(hexGrid);

//     // Add the hexagonal grid to the map and style the layer
//     this.map.addSource("hexGrid", {
//       type: "geojson",
//       data: hexGrid,
//     });

//     this.map.addLayer({
//       id: "hexGridLayer",
//       type: "fill",
//       source: "hexGrid",
//       layout: {},
//       paint: {
//         "fill-color": "#ffffff",
//         "fill-opacity": 0.3,
//         "fill-outline-color": "#000000",
//       },
//     });

//     this.hexGrid = hexGrid;
//   }

//   // Function to retrieve the centre point for each hexagon and assign it an ID
//   #calculateHexagonData(hexGrid) {
//     return hexGrid.features.map((feature, index) => {
//       const centre = turf.center(feature);
//       return {
//         id: index,
//         centre: centre.geometry.coordinates
//       };
//     });
//   }

//   // Function to populated the toggledFilters object with all selected options
//   toggleFilter(event) {
//     const filterValue = event.target.dataset.mapFilterValue;
//     const isChecked = event.target.checked;

//     if (isChecked) {
//       this.selectedFilters[filterValue] = true;
//     } else {
//       delete this.selectedFilters[filterValue];
//     }

//     console.log("Currently toggled filters:", this.selectedFilters);
//   }

//   async fetchParksInLondon() {
//     // const londonBounds = [-0.489, 51.28, 0.236, 51.686];
//     // const url = `https://api.mapbox.com/search/searchbox/v1/category/park?access_token=${this.apiKeyValue}&language=en&limit=25&bbox=${londonBounds.join(',')}`

//     const bounds = [-0.0892, 51.4965, -0.0532, 51.5325];
//     const url = `https://api.mapbox.com/search/searchbox/v1/category/park?access_token=${this.apiKeyValue}&language=en&limit=25&bbox=${bounds.join(',')}`

//     try {
//       const response = await fetch(url);
//       const data = await response.json();

//       console.log(data)

//     } catch (error) {
//       console.error('Error fetching parks:', error);
//     }
//   }

//   // Function to allow a user to click on a hexagon to see initial information
//   #hexagonClick() {
//     this.map.on("click", "hexGridLayer", (event) => {
//       const coordinates = event.lngLat;
//       new mapboxgl.Popup()
//         .setLngLat(coordinates)
//         .setHTML(`<strong>Hexplore Hive</strong><br> ${coordinates.lng.toFixed(5)}, ${coordinates.lat.toFixed(5)}`)
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
