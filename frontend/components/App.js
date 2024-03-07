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
  } // initAddVoyageModal

  renderAddModal() {
    const destDatalist = document.getElementById('modal-add-voyage__destinations-datalist');

    const testOption = document.createElement('option');
    testOption.setAttribute('value', 'DESTINATION');

    const testOption1 = document.createElement('option');
    testOption1.setAttribute('value', 'DESTINATION1');

    const arr = [testOption, testOption1]

    //get array of option elements with destinations' and ferries' names

    destDatalist.replaceChildren(...arr);
  } // renderAddModal

  async init() {
    this.initAddVoyageModal();

    document.querySelector('.voyage-adder__btn')
      .addEventListener('click', () => {
          this.renderAddModal();
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
  } // init
}
