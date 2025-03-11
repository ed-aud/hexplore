import { Controller } from "@hotwired/stimulus"
import mapboxgl from "mapbox-gl"

export default class extends Controller {
  static values = {
    apiKey: String,
  };

  connect() {
    mapboxgl.accessToken = this.apiKeyValue;

    this.map = new mapboxgl.Map({
      container: this.element,
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
    });
  }

  // Function to load map centered on London bounds
  #boundingBox(londonBounds) {
    this.map.fitBounds(londonBounds, { padding: 70, maxZoom: 15, duration: 0.3 });
  }

  // Function to add HexGrid overlay and collect hexagon centre points
  #generateHexGrid(londonBounds) {
    const options = { units: "kilometers" };
    const hexGrid = turf.hexGrid(londonBounds.flat(), 0.5, options);
    const hexagonCentres = this.#calculateHexagonCentres(hexGrid);

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
  }

  // Function to retrieve the centre points for each hexagon
  #calculateHexagonCentres(hexGrid) {
    return hexGrid.features.map(feature => {
      const centre = turf.center(feature);
      return centre.geometry.coordinates;
    });
  }
}



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -



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
