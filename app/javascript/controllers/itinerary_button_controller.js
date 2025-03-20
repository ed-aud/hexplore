import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="itinerary-button"
export default class extends Controller {
  static targets = ["icon"]

  activateButton() {
    this.iconTarget.classList.remove("fa-rocket");
    this.iconTarget.classList.add("fa-spinner", "fa-spin-pulse");
    this.iconTarget.style.setProperty("--fa-animation-iteration-count", "8");

    this.iconTarget.addEventListener('animationend', () => {
      this.iconTarget.classList.remove("fa-spinner", "fa-spin-pulse");
      this.iconTarget.classList.add("fa-check");
    })
  }
}
