export default class Destination {
    #destinationID = null;
    #name = '';

    constructor({
        destinationID = null,
        name
    }) {
        this.#destinationID = destinationID || crypto.randomUUID();;
        this.#name = name;
    }

    get destinationID() { return this.#destinationID }
    get name() { return this.#name }

    renderAsOption() {
        const optionElement = document.createElement('option');
        optionElement.setAttribute('value', this.#name);
        optionElement.setAttribute('id', this.#destinationID);

        return optionElement;
    }
}