import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="hexagon-modal"
export default class extends Controller {
  static targets = ['modalButton', 'closeModal','modalPartial','name','notes', 'addHiveForm'];
  connect() {
    this.bootstrapModal = new bootstrap.Modal(this.modalPartialTarget);
  }

  closeModal(){
    let modal = document.getElementById('hexagonShowModal');
    this.bootstrapModal.hide();
  }

}
