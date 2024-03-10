import AppModel from "../model/AppModel";

export default class Ferry {
    #ferryID = null;
    #name = '';
    #hold = -1;
    #autopark = -1;

    constructor({
        ferryID = null,
        name,
        hold,
        autopark
    }) {
        this.#ferryID = ferryID;
        this.#name = name;
        this.#hold = hold;
        this.#autopark = autopark;
    }

    get ferryID() { return this.#ferryID; }
    get name() { return this.#name; }

    renderAsOption() {
        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', this.#name);
        optionElement.setAttribute('id', this.#ferryID);

        return optionElement;
    }
}