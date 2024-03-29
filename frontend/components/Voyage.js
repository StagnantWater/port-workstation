import Passenger from "./Passenger";
import App from "./App";

export default class Voyage {
  #voyageID = null;
  #voyageDestination = '';
  #voyageFerry = '';
  #passengers = [];

  constructor({
    voyageID = null,
    destination,
    ferry,
    addNotification
  }) {
    this.#voyageID = voyageID || crypto.randomUUID();
    this.#voyageDestination = destination;
    this.#voyageFerry = ferry;
    this.addNotification = addNotification;
  }

  get voyageID() { return this.#voyageID; }

  get destinationID() { return this.#voyageDestination.destinationID; }

  get destinationName() { return this.#voyageDestination.name; }

  get ferry() { return this.#voyageFerry; }

  get ferryID() { return this.#voyageFerry.ferryID; }

  get ferryName() { return this.#voyageFerry.name; }

  get isEmpty() { return (!this.#passengers || !this.#passengers.length); }

  get destination() { return this.#voyageDestination; }
  set destination(value) {
    if(value) {
      this.#voyageDestination = value;
    }
  }

  get freeHold() {
    let occupied = 0;
    for (const passenger of this.#passengers) {
      if (passenger.type === 'cargo') {
        occupied += passenger.size;
      }
    }
    return(this.#voyageFerry.hold - occupied);
  }

  get freeAutopark() {
    var occupied = 0;
    for (const passenger of this.#passengers) {
      if (passenger.type === 'auto') {
        occupied += passenger.size;
      }
    }

    return (this.#voyageFerry.autopark - occupied);
  }

  pushPassenger = ({ passenger }) => this.#passengers.push(passenger);

  getPassengerByID = ({ passengerID }) => this.#passengers.find(passenger => passenger.passengerID === passengerID);

  addNewPassengerLocal = ({ passengerID = null, name, type, size }) => {
    const newPassenger = new Passenger({
      passengerID,
      name,
      type,
      size
    });
    this.#passengers.push(newPassenger);

    const newPassengerElement = newPassenger.render();
    document.querySelector(`[id="${this.#voyageID}"] .voyage__passengers-list`)
      .appendChild(newPassengerElement);
  } // addNewPassengerLocal

  deletePassengerLocal = ({ passengerID = null }) => {
    if(passengerID) {
      const idx = this.#passengers.findIndex(passenger => passenger.passengerID === passengerID);
      this.#passengers.splice(idx, 1);
      document.getElementById(passengerID).remove();
    }
  } // deletePassengerLocal

  render() {
    const liElement = document.createElement('li');
    liElement.classList.add(
      'voyage-list__item',
      'voyage'
    );
    liElement.setAttribute('id', this.#voyageID);

    const headDiv = document.createElement('div');
    headDiv.classList.add('voyage__head');

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('voyage__info');

    const h2Element = document.createElement('h2');
    h2Element.classList.add('voyage__destination');
    h2Element.innerHTML = `Куда: ${this.#voyageDestination.name}`;
    infoDiv.appendChild(h2Element);

    const h3Element = document.createElement('h3');
    h3Element.classList.add('voyage__ferry');
    h3Element.innerHTML = `Судно: ${this.#voyageFerry.name}`;
    infoDiv.appendChild(h3Element);

    headDiv.appendChild(infoDiv);

    const controlsDiv = document.createElement('div');
    controlsDiv.classList.add('voyage__controls');

    const editButton = document.createElement('button');
    editButton.setAttribute('type', 'button');
    editButton.classList.add('voyage__controls-btn', 'edit-icon');
    editButton.addEventListener('click', () => {
      localStorage.setItem('editVoyageID', this.#voyageID);
      App.renderEditVoyageModal();
      document.getElementById('modal-edit-voyage').showModal();
    });
    controlsDiv.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('type', 'button');
    deleteButton.classList.add('voyage__controls-btn', 'delete-icon');
    deleteButton.addEventListener('click', () => {
      localStorage.setItem('deleteVoyageID', this.#voyageID);

      const deleteVoyageModal = document.getElementById('modal-delete-voyage');
      deleteVoyageModal.querySelector('.app-modal__question')
        .innerHTML = `Рейс '${this.destinationName} (${this.ferryName})' будет удален. Продолжить?`;

      deleteVoyageModal.showModal();
    });
    controlsDiv.appendChild(deleteButton);

    headDiv.appendChild(controlsDiv);

    liElement.appendChild(headDiv);

    const innerUlElement = document.createElement('ul');
    innerUlElement.classList.add('voyage__passengers-list');
    liElement.appendChild(innerUlElement);

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('voyage__add-passenger-btn');
    button.innerHTML = '&#10010; Добавить груз';
    button.addEventListener('click', () => {
      localStorage.setItem('addPassengerVoyageID', this.#voyageID);
      document.getElementById('modal-add-passenger').showModal();
    });
    liElement.appendChild(button);

    const adderElement = document.querySelector('.voyage-adder');
    adderElement.parentElement.insertBefore(liElement, adderElement);
  } // render

  renderFreeSpace() {
    const infoDiv = document.getElementById(this.#voyageID).querySelector('.voyage__info');

    const cells = document.createElement('p');
    cells.classList.add('voyage__free-space', 'cargo-hold');
    cells.innerHTML = `Свободных ячеек: ${this.freeHold}`;
    infoDiv.appendChild(cells);

    const slots = document.createElement('p');
    slots.classList.add('voyage__free-space', 'autopark-slots');
    slots.innerHTML = `Свободных машиномест: ${this.freeAutopark}`;
    infoDiv.appendChild(slots);
  } // renderFreeSpace

  reRenderFreeSpace() {
    const infoDiv = document.getElementById(this.#voyageID).querySelector('.voyage__info');

    const cells = infoDiv.querySelector('.cargo-hold');
    cells.innerHTML = `Свободных ячеек: ${this.freeHold}`;

    const slots = infoDiv.querySelector('.autopark-slots');
    slots.innerHTML = `Свободных машиномест: ${this.freeAutopark}`;
  } // reRenderFreeSpace
}