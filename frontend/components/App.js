import AppModel from "../model/AppModel";
import Destination from "./Destination";
import Ferry from "./Ferry";
import Voyage from "./Voyage";

export default class App {
  #voyages = [];

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

        this.addNotification({ text: `${addVoyageResult.message}: ${newVoyage.destinationName} (${newVoyage.ferryName}`, type: 'success' });
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
      }
    } catch (err) {
      this.addNotification({ text: err.message, type: 'error' });
      console.error(err);
    }
  } // init
}
