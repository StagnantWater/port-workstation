export default class Destination {
  #destinationID = null;
  #name = "";

  constructor({ destinationID = null, name }) {
    this.#destinationID = destinationID || crypto.randomUUID();
    this.#name = name;
  }

  get destinationID() {
    return this.#destinationID;
  }
  get name() {
    return this.#name;
  }

  renderAsOption() {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("value", this.#name);
    optionElement.setAttribute("name", this.#name);
    optionElement.setAttribute("data-id", this.#destinationID);

    return optionElement;
  }

  static getFromOption(option) {
    try {
      const newDestination = new Destination({
        destinationID: option.getAttribute("data-id"),
        name: option.getAttribute("name"),
      });

      return newDestination;
    } catch (err) {
      throw new Error("неверно задан пункт назначения");
    }
  }
}
