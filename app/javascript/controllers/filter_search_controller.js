import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["searchTerm", "category"]

  search() {
    let searchQuery = this.searchTermTarget.value.toLowerCase()

    this.categoryTargets.forEach(category => {
      let categoryLetters = category.textContent.toLowerCase()
      category.style.display = categoryLetters.includes(searchQuery) ? "block" : "none";
    });
  }
}
