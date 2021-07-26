import AppController from './appController';

const main = document.getElementById('main');
const newApp = new AppController(main);
newApp.init();
