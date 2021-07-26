export default class Card {
  constructor(container) {
    this.container = container;
  }

  static createCardHTML(text, column, id) {
    return `
    <div class="tasks-column__card" data-column ="${column}" data-id="${id}">
      ${text}
      <button class="tasks-column__delete-card-button hidden">X</button>
    </div>
    `;
  }

  createCard({ text, column, id }) {
    this.container.insertAdjacentHTML(
      'beforeend',
      this.constructor.createCardHTML(text, column, id)
    );
  }
}
