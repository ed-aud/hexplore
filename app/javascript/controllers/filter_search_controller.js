import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["searchTerm", "category", "checkbox", "reset"]

  // Function to search through category filters and display only ones which match search
  search() {
    let searchQuery = this.searchTermTarget.value.toLowerCase()

    this.categoryTargets.forEach(category => {
      let categoryLetters = category.textContent.toLowerCase()
      category.parentNode.style.display = categoryLetters.includes(searchQuery) ? "" : "none";
    });
  }

  // Function to clear search bar and display all categories again once a category has been selected
  clearSearch() {
    this.searchTermTarget.value = ""

    this.categoryTargets.forEach(category => {
      category.parentNode.style.display = ""
    });
  }

  // Function to deselect all selected categories
  deselectAll() {
    this.checkboxTargets.forEach(checkbox => {
      checkbox.checked = false
      checkbox.dispatchEvent(new Event("change", { bubbles: true }))
    });
  }
}
