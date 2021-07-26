export default class StateService {
  getData() {
    return JSON.parse(localStorage.getItem('cards')) || [];
  }

  saveData(data) {
    localStorage.setItem('cards', JSON.stringify(data));
  }
}
