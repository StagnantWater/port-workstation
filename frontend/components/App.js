import AppModel from "../model/AppModel";
import Voyage from "./Voyage";

export default class App {
  #voyages = [];

  init() {
    // init add voyage modal
    // event listener for add voyage button press
    try {
      // const voyages = await AppModel.getVoyages();
      // for (const voyage of voyages) {
      //   const voyageObj = new Voyage
      // }
      const voyage1 = new Voyage({
        destination: 'Мангровый колледж',
        ferry: 'Калиго'
      });
      voyage1.render();
    } catch (err) {
      console.error(err);
    }
  }
}
