export default class Voyage {
  #voyageID = null;
  #voyageDestination = '';
  #voyageFerry = '';

  constructor({
    voyageID = null,
    destination,
    ferry
  }) {
    this.#voyageID = voyageID || crypto.randomUUID();
    this.#voyageDestination = destination,
    this.#voyageFerry = ferry
  }

  get voyageID() { return this.#voyageID }

  render() {
    const liElement = document.createElement('li');
    liElement.classList.add(
      'voyage-list__item',
      'voyage'
    );
    liElement.setAttribute('id', this.#voyageID);

    const h2Element = document.createElement('h2');
    h2Element.classList.add('voyage__destination');
    h2Element.innerHTML = `Куда: ${this.#voyageDestination}`;
    liElement.appendChild(h2Element);

    const h3Element = document.createElement('h3');
    h3Element.classList.add('voyage__ferry');
    h3Element.innerHTML = `Судно: ${this.#voyageFerry}`;
    liElement.appendChild(h3Element);

    const adderElement = document.querySelector('.voyage-adder');
    adderElement.parentElement.insertBefore(liElement, adderElement);
  }
}