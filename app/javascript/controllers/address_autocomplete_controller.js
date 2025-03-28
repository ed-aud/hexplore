import { Controller } from "@hotwired/stimulus"

// Search Box API
export default class extends Controller {
  static values = { apiKey: String };
  static targets = ["address", "suggestionsOutput"]

  getSuggestions() {

    let suggestions = []
    const number_of_suggestions = 10


    const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${this.addressTarget.value}&limit=${number_of_suggestions}&session_token=[GENERATED-UUID]&access_token=${this.apiKeyValue}`
    fetch(url)
    .then(response => response.json())
    .then((data) => {
      data["suggestions"].forEach(suggestion => {
        if (suggestion["full_address"] && suggestion["full_address"] !== "") {
          suggestions.push(suggestion["full_address"])
        }
      })

      this.suggestionsOutputTarget.innerHTML = ""
      suggestions.forEach(suggestion => {
        this.suggestionsOutputTarget.insertAdjacentHTML("beforeend",
          `<option
          data-action="click->address-autocomplete#selectSuggestion"
          value="${suggestion}">${suggestion}</option>`);
        })
    })
  }

  selectSuggestion(event) {
    this.addressTarget.value = event.target.value;
    this.suggestionsOutputTarget.innerHTML = ""; // Clear suggestions after selection
  }

}
