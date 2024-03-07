import AppModel from "../model/AppModel";
import Voyage from "./Voyage";

export default class App {
  #voyages = [];

  initAddVoyageModal() {
    const addVoyageModal = document.getElementById('modal-add-voyage');

    const cancelHandler = () => {
      addVoyageModal.close();
      // localStorage.setItem('addTaskTasklistID', '');
      // addTaskModal.querySelector('.app-modal__input').value = '';
    };

    const okHandler = () => {
      // const tasklistID = localStorage.getItem('addTaskTasklistID');
      // const modalInput = addTaskModal.querySelector('.app-modal__input');

      // if (tasklistID && modalInput.value) {
      //   this.#tasklists.find(tasklist => tasklist.tasklistID === tasklistID)
      //     .appendNewTask({ text: modalInput.value });
      // }

      cancelHandler();
    };

    addVoyageModal.querySelector('.modal-ok-btn').addEventListener('click', okHandler);
    addVoyageModal.querySelector('.modal-cancel-btn').addEventListener('click', cancelHandler);
    addVoyageModal.addEventListener('close', cancelHandler);
  }

  async init() {
    // init add voyage modal
    // event listener for add voyage button press
    this.initAddVoyageModal();

    document.querySelector('.voyage-adder__btn')
      .addEventListener('click', () => {
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
      console.error(err);
    }
  }
}
