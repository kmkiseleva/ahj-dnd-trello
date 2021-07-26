import { nanoid } from 'nanoid';
import Card from './card';
// import StateService from './StateService';

export default class AppController {
  constructor(container) {
    this.container = container;
    // this.state = [];
    // this.stateService = new StateService();
  }

  init() {
    // this.state = this.stateService.getData();
    // this.loadData(this.state);
    this.registerEvents();
  }

  registerEvents() {
    const addAnotherCardButton = [...document.querySelectorAll('.tasks-column__button')];
    const form = [...document.querySelectorAll('.tasks-column__form')];
    const addCardButtons = [...document.querySelectorAll('.tasks-column__add-card-button')];
    const placeForCards = [...document.querySelectorAll('.place-for-cards')];

    // показать/скрыть форму новой карточки
    addAnotherCardButton.forEach((item) => {
      item.addEventListener('click', (e) => {
        const index = addAnotherCardButton.indexOf(e.currentTarget);
        form[index].classList.toggle('hidden');
      });
    });

    // показывать / скрывать кнопку удаления карточки при наведении и наоборот
    this.container.addEventListener('mouseover', (e) => {
      if (e.target.classList.contains('tasks-column__card')) {
        this.showDeleteCardButton(e);
      }
    });
    this.container.addEventListener('mouseout', (e) => {
      if (e.target.classList.contains('tasks-column__card')) {
        this.hideDeleteCardButton(e);
      }
    });

    // dnd events
    this.container.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('tasks-column__delete-card-button')) {
        return;
      }

      if (e.target.classList.contains('tasks-column__card')) {
        this.onMouseDown(e);
      }
    });
    this.container.addEventListener('mouseup', (e) => this.onMouseUp(e));
    this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // создать новую карточку
    form.forEach((item) => {
      item.addEventListener('submit', (event) => {
        this.createNewCard(event);
      });
    });

    addCardButtons.forEach((button) => {
      button.addEventListener('click', (event) => this.onClickAddCardButton(event));
    });

    // удалить карточку
    placeForCards.forEach((item) => {
      item.addEventListener('click', (event) => {
        const { target } = event;
        if (target.classList.contains('tasks-column__delete-card-button')) {
          this.deleteCard(event);
        }
      });
    });
  }

  createNewCard(event) {
    event.preventDefault();
    const { currentTarget } = event;
    const parentEl = currentTarget.closest('.tasks-column');
    const placeForCards = parentEl.querySelector('.place-for-cards');
    const input = parentEl.querySelector('.tasks-column__input');
    const text = input.value;
    const newCard = new Card(placeForCards);
    const cardData = {
      text,
      column: placeForCards.dataset.column,
      id: nanoid(),
    };
    newCard.createCard(cardData);
    // this.state.push(cardData);
    // this.stateService.saveData(this.state);
    input.value = '';
  }

  onClickAddCardButton(event) {
    const parentEl = event.currentTarget.closest('.tasks-column');
    const form = parentEl.querySelector('.tasks-column__form');
    form.classList.toggle('hidden');
  }

  showDeleteCardButton(e) {
    const deleteButton = e.target.querySelector('button');
    deleteButton.classList.remove('hidden');
  }

  hideDeleteCardButton(e) {
    const deleteButton = e.target.querySelector('button');
    deleteButton.classList.add('hidden');
  }

  deleteCard(event) {
    const parentEl = event.target.closest('.tasks-column__card');
    // const index = this.state.findIndex((item) => item.id === parentEl.dataset.id);
    // this.state.splice(index, 1);
    // this.stateService.saveData(this.state);
    parentEl.remove();
  }

  onMouseDown(e) {
    e.preventDefault();
    document.body.style.cursor = 'grabbing';
    const currentEl = e.target.closest('.tasks-column__card');
    this.cloneEl = currentEl.cloneNode(true);
    const { width, height, left, top } = currentEl.getBoundingClientRect();
    this.cloneEl.classList.add('dragged');
    this.cloneEl.style.width = `${width}px`;
    this.cloneEl.style.height = `${height}px`;
    document.body.appendChild(this.cloneEl);
    this.coordX = e.clientX - left;
    this.coordY = e.clientY - top;
    this.cloneEl.style.top = `${top}px`;
    this.cloneEl.style.left = `${left}px`;
    this.currentEl = currentEl;
    this.currentEl.classList.add('hidden');
  }

  onMouseMove(e) {
    e.preventDefault();
    if (!this.cloneEl) {
      return;
    }
    this.cloneEl.style.left = `${e.pageX - this.coordX}px`;
    this.cloneEl.style.top = `${e.pageY - this.coordY}px`;
  }

  onMouseUp(e) {
    e.preventDefault();
    document.body.style.cursor = 'default';
    if (!this.currentEl || !this.cloneEl) {
      return;
    }
    const closest = document.elementFromPoint(e.clientX, e.clientY).closest('.tasks-column__card');
    const columnContainer = e.target.closest('.tasks-column');
    if (!columnContainer) {
      this.cloneEl.remove();
      this.currentEl.classList.remove('hidden');
    }
    const placeForCards = columnContainer.querySelector('.place-for-cards');
    this.currentEl.dataset.column = columnContainer.dataset.column;
    placeForCards.insertBefore(this.currentEl, closest);

    // const currentCard = this.state.find((item) => item.id === this.currentEl.dataset.id);
    // currentCard.column = this.currentEl.dataset.column;
    // this.stateService.saveData(this.state);

    this.currentEl.classList.remove('hidden');
    this.cloneEl.remove();
    this.cloneEl = null;
  }

  loadData(data) {
    if (data === '[]') {
      return;
    }

    data.forEach((card) => {
      const cardContainer = this.container
        .querySelector(`.tasks-column[data-column="${card.column}"]`)
        .querySelector('.place-for-cards');
      const newCard = new Card(cardContainer);
      newCard.createCard(card);
    });
  }
}
