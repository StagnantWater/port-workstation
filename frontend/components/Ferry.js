export default class Ferry {
  #ferryID = null;
  #name = "";
  #hold = -1;
  #autopark = -1;

  constructor({ ferryID = null, name, hold, autopark }) {
    this.#ferryID = ferryID;
    this.#name = name;
    this.#hold = hold;
    this.#autopark = autopark;
  }

  get ferryID() {
    return this.#ferryID;
  }
  get name() {
    return this.#name;
  }
  get hold() {
    return this.#hold;
  }
  get autopark() {
    return this.#autopark;
  }

  renderAsOption() {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("value", this.#name);
    optionElement.setAttribute("name", this.#name);
    optionElement.setAttribute("data-id", this.#ferryID);
    optionElement.setAttribute("hold", this.#hold);
    optionElement.setAttribute("autopark", this.#autopark);

    return optionElement;
  }

  static getFromOption(option) {
    try {
      const newFerry = new Ferry({
        ferryID: option.getAttribute("data-id"),
        name: option.getAttribute("name"),
        hold: option.getAttribute("hold"),
        autopark: option.getAttribute("autopark"),
      });

      return newFerry;
    } catch (err) {
      throw new Error("неверно задан паром");
    }
  }
}
