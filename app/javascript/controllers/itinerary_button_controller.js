import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="itinerary-button"
export default class extends Controller {

  disableButton(event) {
    const icon = event.target
    icon.classList.add("fa-spin-pulse");
    icon.style.setProperty("--fa-animation-iteration-count", "3");

    icon.addEventListener('animationend', () => {
      icon.disabled = true;
      icon.classList.add("opacity-50", "cursor-not-allowed");
    })
  }
}
