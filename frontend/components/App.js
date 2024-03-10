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

    const okHandler = () => {
      // const tasklistID = localStorage.getItem('addTaskTasklistID');
      // const modalInput = addTaskModal.querySelector('.app-modal__input');

      // if (tasklistID && modalInput.value) {
      //   this.#tasklists.find(tasklist => tasklist.tasklistID === tasklistID)
      //     .appendNewTask({ text: modalInput.value });
      // }
      this.addNotification({ text: 'OK', type: 'success' });

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

    document.querySelector('.voyage-adder__btn')
      .addEventListener('click', () => {
          this.renderAddVoyageModal();
          document.getElementById('modal-add-voyage').showModal();
        });

    try {
      const voyages = await AppModel.getVoyages();
      for (const voyage of voyages) {
        const voyageObj = new Voyage({
          voyageID: voyage.voyageID,
          destination: voyage.destination,
          ferry: voyage.ferry
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
