import AppModel from "../model/AppModel";
import Destination from "./Destination";
import Ferry from "./Ferry";
import Passenger from "./Passenger";
import Voyage from "./Voyage";

export default class App {
  #voyages = [];

  deleteVoyage = async ({ voyageID }) => {
    try {
      const deleteVoyageIndex = this.#voyages.findIndex(voyage => voyage.voyageID === voyageID);
      if(!this.#voyages[deleteVoyageIndex].isEmpty) {
        throw new Error('Можно удалить только пустой рейс');
      }

      const deleteVoyageResult = await AppModel.deleteVoyage({ voyageID });

      const [deletedVoyage] = this.#voyages.splice(deleteVoyageIndex, 1);
      document.getElementById(voyageID).remove();

      this.addNotification({ text: `${deleteVoyageResult.message}: ${deletedVoyage.destinationName} (${deletedVoyage.ferryName})`, type: 'success' });
    } catch (err) {
      this.addNotification({ text: err.message, type: 'error' });
      console.error(err);
    }
  }; // deleteVoyage

  initAddVoyageModal() {
    const addVoyageModal = document.getElementById('modal-add-voyage');

    const closeHandler = () => {
      addVoyageModal.close();
      addVoyageModal.querySelector('.app-modal__form').reset();
    };

    const addVoyage = async ({ destination, ferry }) => {
      const voyageID = crypto.randomUUID();
      try {
        const addVoyageResult = await AppModel.addVoyage({
          voyageID: voyageID,
          destinationID: destination.destinationID,
          ferryID: ferry.ferryID
        });
        const newVoyage = new Voyage({
          voyageID: voyageID,
          destination: destination,
          ferry: ferry,
          addNotification: this.addNotification
        });

        this.#voyages.push(newVoyage);
        newVoyage.render();

        this.addNotification({ text: `${addVoyageResult.message}: ${newVoyage.destinationName} (${newVoyage.ferryName})`, type: 'success' });
      } catch (err) {
        throw new Error(err.message);
      }
    };

    const okHandler = async () => {
      try {
        const destDatalist = document.getElementById('modal-add-voyage__destinations-datalist');
        const destInput = document.getElementById('modal-add-voyage__dest-input');
        const chosenDestOption = destDatalist.options.namedItem(destInput.value);
        const newDestination = Destination.getFromOption(chosenDestOption);

        const ferryDatalist = document.getElementById('modal-add-voyage__ferries-datalist');
        const ferryInput = document.getElementById('modal-add-voyage__ferry-input');
        const chosenFerryOption = ferryDatalist.options.namedItem(ferryInput.value);
        const newFerry = Ferry.getFromOption(chosenFerryOption);

        await addVoyage({destination: newDestination, ferry: newFerry});
      } catch (err) {
        this.addNotification({ text: `Рейс не был добавлен: ${err.message}`, type: 'error' });
        console.error(err);
      }

      closeHandler();
    };

    addVoyageModal.querySelector('.modal-ok-btn').addEventListener('click', okHandler);
    addVoyageModal.querySelector('.modal-cancel-btn').addEventListener('click', closeHandler);
    addVoyageModal.addEventListener('close', closeHandler);
  } // initAddVoyageModal

  async renderAddVoyageModal() {
    const destDatalist = document.getElementById('modal-add-voyage__destinations-datalist');
    const destOptions = [];
    const destinations = await AppModel.getDestinations();

    for (const dest of destinations) {
      const destObj = new Destination({
        destinationID: dest.destinationID,
        name: dest.name
      });

      destOptions.push(destObj.renderAsOption());
    }

    destDatalist.replaceChildren(...destOptions);

    const ferryDatalist = document.getElementById('modal-add-voyage__ferries-datalist');
    const ferryOptions = [];
    const ferries = await AppModel.getFerries();

    for (const ferry of ferries) {
      const ferryObj = new Ferry({
        ferryID: ferry.ferryID,
        name: ferry.name,
        hold: ferry.hold,
        autopark: ferry.autopark
      });
      if (await AppModel.checkFerryAssignment({ferryID: ferryObj.ferryID}) === false) {
        ferryOptions.push(ferryObj.renderAsOption());
      }
    }

    ferryDatalist.replaceChildren(...ferryOptions);
  } // renderAddVoyageModal

  initDeleteVoyageModal() {
    const deleteVoyageModal = document.getElementById('modal-delete-voyage');

    const cancelHandler = () => {
      deleteVoyageModal.close();
      localStorage.setItem('deleteVoyageID', '');
    };

    const okHandler = () => {
      const voyageID = localStorage.getItem('deleteVoyageID');

      if (voyageID) {
        this.deleteVoyage({ voyageID });
      }

      cancelHandler();
    };

    deleteVoyageModal.querySelector('.modal-ok-btn').addEventListener('click', okHandler);
    deleteVoyageModal.querySelector('.modal-cancel-btn').addEventListener('click', cancelHandler);
    deleteVoyageModal.addEventListener('close', cancelHandler);
  }

  initEditVoyageModal() {
    const editVoyageModal = document.getElementById('modal-edit-voyage');

    const cancelHandler = () => {
      editVoyageModal.close();
      localStorage.setItem('editVoyageID', '');
      editVoyageModal.querySelector('.app-modal__form').reset();
    };

    const editVoyage = async ({ voyageID, destination }) => {
      try {
        const updateVoyageResult = await AppModel.updateVoyage({voyageID: voyageID, destinationID: destination.destinationID});
        const editVoyageIndex = this.#voyages.findIndex(voyage => voyage.voyageID === voyageID);
        this.#voyages[editVoyageIndex].destination = destination;
        document.querySelector(`[id="${voyageID}"] h2.voyage__destination`).innerHTML = `Куда: ${destination.name}`;
        this.addNotification({ text: `${updateVoyageResult.message}: ${destination.name}`, type: 'success' });
      } catch (err) {
        throw new Error(err.message);
      }
    }

    const okHandler = async () => {
      try {
        const voyageID = localStorage.getItem('editVoyageID');

        if (voyageID) {
          const destDatalist = document.getElementById('modal-edit-voyage__destinations-datalist');
          const destInput = document.getElementById('modal-edit-voyage__dest-input');
          const chosenDestOption = destDatalist.options.namedItem(destInput.value);
          const newDestination = Destination.getFromOption(chosenDestOption);

          await editVoyage({ voyageID: voyageID, destination: newDestination });
        }
      } catch (err) {
        this.addNotification({ text: `Рейс не был изменен: ${err.message}`, type: 'error' });
        console.error(err);
      }

      cancelHandler();
    };

    editVoyageModal.querySelector('.modal-ok-btn').addEventListener('click', okHandler);
    editVoyageModal.querySelector('.modal-cancel-btn').addEventListener('click', cancelHandler);
    editVoyageModal.addEventListener('close', cancelHandler);
  }

  static async renderEditVoyageModal() {
    const destDatalist = document.getElementById('modal-edit-voyage__destinations-datalist');
    const destOptions = [];
    const destinations = await AppModel.getDestinations();

    for (const dest of destinations) {
      const destObj = new Destination({
        destinationID: dest.destinationID,
        name: dest.name
      });

      destOptions.push(destObj.renderAsOption());
    }

    destDatalist.replaceChildren(...destOptions);
  } // renderEditVoyageModal

  initAddPassengerModal() {
    const addPassengerModal = document.getElementById('modal-add-passenger');

    const cancelHandler = () => {
      addPassengerModal.close();
      localStorage.setItem('addPassengerVoyageID', '');
      addPassengerModal.querySelector('.app-modal__form').reset();
      addPassengerModal.querySelector('.app-modal__passenger-config').innerHTML = '';
    };

    const addPassenger = async ({ voyageID, type, name, size }) => {
      const passengerID = crypto.randomUUID();
      try {
        const addPassengerResult = await AppModel.addPassenger({
          passengerID: passengerID,
          type: type,
          name: name,
          size: size,
          voyageID: voyageID
        });

        this.#voyages.find(voyage => voyage.voyageID === voyageID)
          .addNewPassengerLocal({
            passengerID,
            name,
            type,
            size});

          this.addNotification({ text: `${addPassengerResult.message}`, type: 'success' });
      } catch (err) {
        throw new Error(err.message);
      }
    }

    const okHandler = async () => {
      const voyageID = localStorage.getItem('addPassengerVoyageID');
      const voyage = this.#voyages.find(voyage => voyage.voyageID === voyageID);

      if (voyageID) {
        try {
          const type = addPassengerModal.querySelector('input[name="passenger-type"]:checked').value;
          if (!type) {
            throw new Error('Не выбран вид груза');
          }

          const name = document.getElementById('modal-add-passenger__name-input').value;
          if (!name) {
            throw new Error('Наименование не может быть пустым');
          }

          let size = 0;
          if (type === 'cargo') {
            size = parseInt(document.getElementById('modal-add-passenger__quantity-input').value);
            if (size > voyage.freeHold) {
              throw new Error('Товар не добавлен: недостаточно места в пароме');
            }
          }
          else {
            const select = document.getElementById("modal-add-passenger__auto-select");
            size = parseInt(select.options[select.selectedIndex].value);
            if (size > voyage.freeAutopark) {
              throw new Error('Автомобиль не добавлен: недостаточно места в пароме');
            }
          }
          if (size <= 0) {
            throw new Error('Размер груза должен быть положительным');
          }

          await addPassenger({ voyageID: voyageID, type: type, name: name, size: size });
        } catch (err) {
          this.addNotification({ text: err.message, type: 'error' });
          console.error(err);
        }
      }

      cancelHandler();
    };

    const renderCargoOption = () => {
      const configElement = addPassengerModal.querySelector('.app-modal__passenger-config');
      configElement.innerHTML = '';

      const labelElement = document.createElement('label');
      labelElement.classList.add('app-modal__label');
      labelElement.setAttribute('for', 'modal-add-passenger__name-input');
      labelElement.innerHTML = 'Введите наименование:';
      configElement.appendChild(labelElement);
      configElement.appendChild(document.createElement('br'));

      const inputName = document.createElement('input');
      inputName.classList.add('app-modal__input');
      inputName.setAttribute('id', 'modal-add-passenger__name-input');
      inputName.setAttribute('type', 'text');
      configElement.appendChild(inputName);
      configElement.appendChild(document.createElement('br'));

      const numberLabel = document.createElement('label');
      numberLabel.classList.add('app-modal__label');
      numberLabel.setAttribute('for', 'modal-add-passenger__quantity-input');
      numberLabel.innerHTML = 'Введите количество:';
      configElement.appendChild(numberLabel);
      configElement.appendChild(document.createElement('br'));

      const inputNunber = document.createElement('input');
      inputNunber.classList.add('app-modal__input');
      inputNunber.setAttribute('id', 'modal-add-passenger__quantity-input');
      inputNunber.setAttribute('type', 'number');
      configElement.appendChild(inputNunber);
    }

    const renderAutoOption = () => {
      const configElement = addPassengerModal.querySelector('.app-modal__passenger-config');
      configElement.innerHTML = '';

      const labelElement = document.createElement('label');
      labelElement.classList.add('app-modal__label');
      labelElement.setAttribute('for', 'modal-add-passenger__name-input');
      labelElement.innerHTML = 'Введите наименование:';
      configElement.appendChild(labelElement);
      configElement.appendChild(document.createElement('br'));

      const inputName = document.createElement('input');
      inputName.classList.add('app-modal__input');
      inputName.setAttribute('id', 'modal-add-passenger__name-input');
      inputName.setAttribute('type', 'text');
      configElement.appendChild(inputName);
      configElement.appendChild(document.createElement('br'));

      const selectLabel = document.createElement('label');
      selectLabel.classList.add('app-modal__label');
      labelElement.setAttribute('for', 'modal-add-passenger__auto-select');
      selectLabel.innerHTML = 'Выберите тип';
      configElement.appendChild(selectLabel);

      const selectElement = document.createElement('select');
      selectElement.classList.add('app-modal__select');
      selectElement.setAttribute('id', 'modal-add-passenger__auto-select');

      const smallOption = document.createElement('option');
      smallOption.value = '1';
      smallOption.innerHTML = 'Легковой автомобиль';
      selectElement.appendChild(smallOption);

      const mediumOption = document.createElement('option');
      mediumOption.value = '2';
      mediumOption.innerHTML = 'Грузовой автомобиль';
      selectElement.appendChild(mediumOption);

      const largeOption = document.createElement('option');
      largeOption.value = '3';
      largeOption.innerHTML = 'Тягач';
      selectElement.appendChild(largeOption);

      configElement.appendChild(selectElement);
    }

    addPassengerModal.querySelector('.modal-ok-btn').addEventListener('click', okHandler);
    addPassengerModal.querySelector('.modal-cancel-btn').addEventListener('click', cancelHandler);
    addPassengerModal.addEventListener('close', cancelHandler);
    document.getElementById('cargo-btn').addEventListener('change', renderCargoOption);
    document.getElementById('auto-btn').addEventListener('change', renderAutoOption);
  }

  initDeletePassengerModal() {
    const deletePassengerModal = document.getElementById('modal-delete-passenger');

    const cancelHandler = () => {
      deletePassengerModal.close();
      localStorage.setItem('deletePassengerID', '');
    };

    const deletePassenger = async ({ passengerID, voyageID }) => {
      try {
        const deletePassengerResult = await AppModel.deletePassenger({ passengerID });

        this.#voyages.find(voyage => voyage.voyageID === voyageID)
          .deletePassengerLocal({ passengerID });

        this.addNotification({ text: `${deletePassengerResult.message}`, type: 'success' });
      } catch (err) {
        this.addNotification({ text: err.message, type: 'error' });
        console.error(err);
      }
    }

    const okHandler = async () => {
      const passengerID = localStorage.getItem('deletePassengerID');

      if (passengerID) {
        let fPassenger = null;
        let fVoyage = null;
        for (let voyage of this.#voyages) {
          fVoyage = voyage;
          fPassenger = voyage.getPassengerByID({ passengerID });
          if (fPassenger) break;
        }
        await deletePassenger({ passengerID: passengerID, voyageID: fVoyage.voyageID });
      }

      cancelHandler();
    };

    deletePassengerModal.querySelector('.modal-ok-btn').addEventListener('click', okHandler);
    deletePassengerModal.querySelector('.modal-cancel-btn').addEventListener('click', cancelHandler);
    deletePassengerModal.addEventListener('close', cancelHandler);
  }

  initNotifications() {
    const notifications = document.getElementById('app-notifications');
    notifications.show();
  } // initNotifications

  addNotification = ({ text, type }) => {
    const notifications = document.getElementById('app-notifications');

    const notificationID = crypto.randomUUID();
    const notification = document.createElement('div');
    notification.classList.add('notification',
      type === 'success' ? 'notification-success' : 'notification-error'
    );
    notification.setAttribute('id', notificationID);
    notification.innerHTML = text;

    notifications.appendChild(notification);

    setTimeout(() => {
      document.getElementById(notificationID).remove();
    }, 5000);
  } // addNotification

  async init() {
    this.initAddVoyageModal();
    this.initEditVoyageModal();
    this.initDeleteVoyageModal();
    this.initAddPassengerModal();
    this.initDeletePassengerModal();
    this.initNotifications();

    document.querySelector('.voyage-adder__btn')
      .addEventListener('click', () => {
          this.renderAddVoyageModal();
          document.getElementById('modal-add-voyage').showModal();
        });

    try {
      const voyages = await AppModel.getVoyages();
      for (const voyage of voyages) {
        const destination = new Destination({
          destinationID: voyage.destinationID,
          name: voyage.destinationName
        });
        const ferry = new Ferry({
          ferryID: voyage.ferryID,
          name: voyage.ferryName,
          hold: voyage.ferryHold,
          autopark: voyage.ferryAutopark
        });
        const voyageObj = new Voyage({
          voyageID: voyage.voyageID,
          destination: destination,
          ferry: ferry,
          addNotification: this.addNotification
        });

        this.#voyages.push(voyageObj);
        voyageObj.render();

        for (const passenger of voyage.passengers) {
          voyageObj.addNewPassengerLocal({
            passengerID: passenger.passengerID,
            name: passenger.name,
            type: passenger.type,
            size: passenger.size
          });
        }
        voyageObj.renderFreeSpace();
      }
    } catch (err) {
      this.addNotification({ text: err.message, type: 'error' });
      console.error(err);
    }
  } // init
}
