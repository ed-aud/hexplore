import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["filtersContainer", "infoContainer", "overlay", "mobileControls"];

  connect() {
    document.addEventListener("click", this.handleClickOutside.bind(this));
  }

  disconnect() {
    document.removeEventListener("click", this.handleClickOutside.bind(this));
  }

  toggleFilters() {
    this.closeAll();
    this.filtersContainerTarget.classList.toggle("open");
    this.toggleOverlay();
  }

  toggleInfo() {
    this.closeAll();
    this.infoContainerTarget.classList.toggle("open");
    this.toggleOverlay();
  }

  closeAll() {
    this.filtersContainerTarget.classList.remove("open");
    this.infoContainerTarget.classList.remove("open");
    this.overlayTarget.classList.remove("active");
    this.mobileControlsTarget.style.display = "flex";
  }

  toggleOverlay() {
    if (this.filtersContainerTarget.classList.contains("open") || this.infoContainerTarget.classList.contains("open")) {
      this.overlayTarget.classList.add("active");
      this.mobileControlsTarget.style.display = "none"; 
    } else {
      this.closeAll();
    }
  }

  handleClickOutside(event) {
    if (
      !this.filtersContainerTarget.contains(event.target) &&
      !this.infoContainerTarget.contains(event.target) &&
      !event.target.closest(".mobile-controls i")
    ) {
      this.closeAll();
    }
  }
}