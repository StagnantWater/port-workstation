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

  get destinationName() { return this.#voyageDestination.name; }

  get ferryName() { return this.#voyageFerry.name; }

  get isEmpty() { return (!this.#passengers || !this.#passengers.length); }

  get destination() { return this.#voyageDestination; }
  set destination(value) {
    if(value) {
      this.#voyageDestination = value;
    }
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

    const adderElement = document.querySelector('.voyage-adder');
    adderElement.parentElement.insertBefore(liElement, adderElement);
  } // render
}