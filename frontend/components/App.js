import AppModel from "../model/AppModel";
import Voyage from "./Voyage";

export default class App {
  #voyages = [];

  async init() {
    // init add voyage modal
    // event listener for add voyage button press
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
      }
    } catch (err) {
      console.error(err);
    }
  }
}
