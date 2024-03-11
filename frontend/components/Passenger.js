import App from "./App";

export default class Passenger {
  #passengerID = null;
  #passengerName = '';
  #passengerType = '';
  #passengerSize = 0;

  constructor({
    passengerID = null,
    name,
    type,
    size
  }) {
    this.#passengerID = passengerID || crypto.randomUUID();
    this.#passengerName = name;
    this.#passengerType = type;
    this.#passengerSize = size;
  }

  get passengerID() { return this.#passengerID; }

  get name() { return this.#passengerName; }

  get type() { return this.#passengerType; }

  get size() { return this.#passengerSize; }

  render() {
    const liElement = document.createElement('li');
    liElement.classList.add('voyage__passengers-list-item', 'passenger');
    liElement.setAttribute('id', this.#passengerID);

    const textDiv = document.createElement('div');
    textDiv.classList.add('passenger__info');

    const nameText = document.createElement('h4');
    nameText.classList.add('passenger__text', 'passenger__name');
    nameText.innerHTML = this.#passengerName;
    textDiv.appendChild(nameText);

    const sizeText = document.createElement('span');
    sizeText.classList.add('passenger__text', 'passenger__size');
    if (this.#passengerType === 'auto') {
      switch (parseInt(this.#passengerSize)) {
        case 1:
          sizeText.innerHTML = 'Легковой автомобиль';
          break;
        case 2:
          sizeText.innerHTML = 'Грузовой автомобиль';
          break;
        case 3:
          sizeText.innerHTML = 'Тягач';
          break;
        default:
          break;
      }
    }
    else if (this.#passengerType === 'cargo') {
      sizeText.innerHTML = `Количество: ${this.#passengerSize}`;
    }
    textDiv.appendChild(sizeText);

    liElement.appendChild(textDiv);

    const controlsDiv = document.createElement('div');
    controlsDiv.classList.add('passenger__controls');

    const moveButton = document.createElement('button');
    moveButton.setAttribute('type', 'button');
    moveButton.classList.add('passenger__controls-btn', 'move-icon');
    moveButton.addEventListener('click', () => {
      localStorage.setItem('movePassengerID', this.#passengerID);
      App.renderMovePassengerModal();
      document.getElementById('modal-move-passenger').showModal();
    });
    controlsDiv.appendChild(moveButton);

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('type', 'button');
    deleteButton.classList.add('passenger__controls-btn', 'delete-icon');
    deleteButton.addEventListener('click', () => {
      localStorage.setItem('deletePassengerID', this.#passengerID);

      const deletePassengerModal = document.getElementById('modal-delete-passenger');
      deletePassengerModal.querySelector('.app-modal__question')
        .innerHTML = `Груз '${this.#passengerName}' будет удален. Продолжить?`;

        deletePassengerModal.showModal();
    });
    controlsDiv.appendChild(deleteButton);

    liElement.appendChild(controlsDiv);

    return liElement;
  } // render
}
