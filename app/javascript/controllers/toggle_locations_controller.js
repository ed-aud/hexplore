import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["body", "icon"];

  toggle() {
    const isHidden = this.bodyTargets[0].style.display === "none" || this.bodyTargets[0].style.display === "";

    this.bodyTargets.forEach(body => {
      body.style.display = isHidden ? "flex" : "none";
    });

    this.iconTarget.classList.toggle("fa-plus", !isHidden);
    this.iconTarget.classList.toggle("fa-minus", isHidden);
  }
}
