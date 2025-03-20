import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="hexagon-modal"
export default class extends Controller {
  static targets = ['modalButton', 'closeModal','modalPartial','name','notes', 'addHiveForm'];
  connect() {
    console.log('connected mihai');
    console.log(this.modalPartialTarget);
    this.bootstrapModal = new bootstrap.Modal(this.modalPartialTarget);
    console.log(this.bootstrapModal);
  }

  // expandModal(event){
  //   event.preventDefault();
  //   console.log("expandModal function triggred")
  //   console.log(this.modalButtonTarget);
  // }
  closeModal(){
    console.log("closeModal function triggred")
    let modal = document.getElementById('hexagonShowModal');
    this.bootstrapModal.hide();
  }

  // createHive(event){
  //   event.preventDefault();
  //   console.log('Create hive method triggred')
  //   console.log(this.nameTarget.value)
  // }

}
