import { Controller } from "@hotwired/stimulus"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"

export default class extends Controller {
  static values = { apiKey: String };
  static targets = ["address"]

  connect() {
    this.geocoder = new MapboxGeocoder({
      accessToken: this.apiKeyValue,
      types: "country,region,place,postcode,locality,neighborhood,address"
    })
    console.log(this.geocoder)
    console.log(this.element)
    this.geocoder.addTo(this.addressTarget)
    console.log(this.geocoder)
    // Listen for a selected result
    this.geocoder.on("result", event => this.#setInputValue(event))
    // Listen for when the geocoder is cleared
    this.geocoder.on("clear", () => this.#clearInputValue())
  }
  disconnect() {
    this.geocoder.onRemove()
  }
  #setInputValue(event) {
    // Update the input with the full place name
    this.locationTarget.value = event.result["place_name"]
  }
  #clearInputValue() {
    // Clear the input field
    this.locationTarget.value = ""
  }
}
