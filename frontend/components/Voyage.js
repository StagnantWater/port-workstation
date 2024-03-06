import Passenger from "./Passenger";

export default class Voyage {
  #voyageID = null;
  #voyageDestination = '';
  #voyageFerry = '';
  #passengers = [];

  constructor({
    voyageID = null,
    destination,
    ferry
  }) {
    this.#voyageID = voyageID || crypto.randomUUID();
    this.#voyageDestination = destination;
    this.#voyageFerry = ferry;
  }

  get voyageID() { return this.#voyageID }

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
  }

  render() {
    const liElement = document.createElement('li');
    liElement.classList.add(
      'voyage-list__item',
      'voyage'
    );
    liElement.setAttribute('id', this.#voyageID);

    const h2Element = document.createElement('h2');
    h2Element.classList.add('voyage__destination');
    h2Element.innerHTML = `Куда: ${this.#voyageDestination}`;
    liElement.appendChild(h2Element);

    const h3Element = document.createElement('h3');
    h3Element.classList.add('voyage__ferry');
    h3Element.innerHTML = `Судно: ${this.#voyageFerry}`;
    liElement.appendChild(h3Element);

    const innerUlElement = document.createElement('ul');
    innerUlElement.classList.add('voyage__passengers-list');
    liElement.appendChild(innerUlElement);

    const adderElement = document.querySelector('.voyage-adder');
    adderElement.parentElement.insertBefore(liElement, adderElement);
  }
}