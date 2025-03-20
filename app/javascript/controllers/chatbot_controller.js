import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="reset-form"
export default class extends Controller {
  static targets = ["submit"]

  submit(event) {
    if (event.key === "Enter") {
      this.submitTarget.click();
      this.element.reset()
    }
  }
}
