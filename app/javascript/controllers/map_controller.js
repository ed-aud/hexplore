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

  // Empty object to store selected filters
  selectedFilters = {};

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

    // Define outer bounds for London and once map is loaded layer on the HexGrid
    this.#boundingBox(londonBounds);
    this.map.on("load", () => {
      this.#generateHexGrid(londonBounds);
      this.#hexagonClick();
    });

    this.fetchParksInLondon();
  }

  // Function to load map centered on London bounds
  #boundingBox(londonBounds) {
    this.map.fitBounds(londonBounds, { padding: 70, maxZoom: 15, duration: 0.3 });
  }

  // Function to add HexGrid overlay and collect hexagon centre points
  #generateHexGrid(londonBounds) {
    const options = { units: "kilometers" };
    const hexGrid = turf.hexGrid(londonBounds.flat(), 1, options);

    // Assign each hexagon an ID and calculate its centre-point (lat / lon)
    const hexagonData = this.#calculateHexagonData(hexGrid);

    // Add the hexagonal grid to the map and style the layer
    this.map.addSource("hexGrid", {
      type: "geojson",
      data: hexGrid,
    });

    this.map.addLayer({
      id: "hexGridLayer",
      type: "fill",
      source: "hexGrid",
      layout: {},
      paint: {
        "fill-color": "#ffffff",
        "fill-opacity": 0.3,
        "fill-outline-color": "#000000",
      },
    });

    this.hexGrid = hexGrid;
  }

  // Function to retrieve the centre point for each hexagon and assign it an ID
  #calculateHexagonData(hexGrid) {
    return hexGrid.features.map((feature, index) => {
      const centre = turf.center(feature);
      return {
        id: index,
        centre: centre.geometry.coordinates
      };
    });
  }

  // Function to populated the toggledFilters object with all selected options
  toggleFilter(event) {
    const filterValue = event.target.dataset.mapFilterValue;
    const isChecked = event.target.checked;

    if (isChecked) {
      this.selectedFilters[filterValue] = true;
    } else {
      delete this.selectedFilters[filterValue];
    }

    console.log("Currently toggled filters:", this.selectedFilters);
  }

  async fetchParksInLondon() {
    const londonBounds = [-0.489, 51.28, 0.236, 51.686];
    const url = `https://api.mapbox.com/search/searchbox/v1/category/park?access_token=${this.apiKeyValue}&language=en&limit=25&bbox=${londonBounds.join(',')}`

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log(data)

    } catch (error) {
      console.error('Error fetching parks:', error);
    }
  }

  // Function to allow a user to click on a hexagon to see initial information
  #hexagonClick() {
    this.map.on("click", "hexGridLayer", (event) => {
      const coordinates = event.lngLat;
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`<strong>Hexplore Hive</strong><br> ${coordinates.lng.toFixed(5)}, ${coordinates.lat.toFixed(5)}`)
        .addTo(this.map);
    });
  }
}







// async fetchParksInLondon() {
//   const londonBounds = [-0.489, 51.28, 0.236, 51.686];
//   const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/park.json?bbox=${londonBounds.join(',')}&types=poi&limit=10&access_token=${this.apiKeyValue}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();

//     console.log(data)

//     // Check if we got any features back
//     console.log("Total results:", data.features ? data.features.length : 0);

//     // Get all park locations from the response
//     const parks = data.features;

//     // Output the park locations
//     parks.forEach(park => {
//       console.log(`Park: ${park.text}, Coordinates: ${park.geometry.coordinates}`);
//     });

//     return parks;
//   } catch (error) {
//     console.error('Error fetching parks:', error);
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
