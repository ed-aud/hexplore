import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["filtersContainer", "infoContainer", "overlay", "mobileControls"];

  connect() {
    document.addEventListener("click", this._handleClickOutside.bind(this));
  }

  disconnect() {
    document.removeEventListener("click", this._handleClickOutside.bind(this));
  }

  toggleFilters() {
    this._closeAll();
    this.filtersContainerTarget.classList.toggle("open");
    this._toggleOverlay();
  }

  toggleInfo() {
    this._closeAll();
    this.infoContainerTarget.classList.toggle("open");
    this._toggleOverlay();
  }

  _closeAll() {
    this.filtersContainerTarget.classList.remove("open");
    this.infoContainerTarget.classList.remove("open");
    this.overlayTarget.classList.remove("active");
    this.mobileControlsTarget.style.display = "flex"; // Show icons again
  }

  _toggleOverlay() {
    if (this.filtersContainerTarget.classList.contains("open") || this.infoContainerTarget.classList.contains("open")) {
      this.overlayTarget.classList.add("active");
      this.mobileControlsTarget.style.display = "none"; // Hide icons when menu is open
    } else {
      this._closeAll();
    }
  }

  _handleClickOutside(event) {
    // Close menu if clicking outside menu containers
    if (
      !this.filtersContainerTarget.contains(event.target) &&
      !this.infoContainerTarget.contains(event.target) &&
      !event.target.closest(".mobile-controls i") // Ignore clicks on icons
    ) {
      this._closeAll();
    }
  }
}