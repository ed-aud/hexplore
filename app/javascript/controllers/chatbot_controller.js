import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="reset-form"
export default class extends Controller {
  static targets = ["chatbot"]

  toggle() {
    console.log("hello")
    this.chatbotTarget.classList.toggle("hidden");
  }
}
