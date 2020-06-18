import '../../scss/app.scss';
import * as Promise from 'bluebird';
import EventManager from './EventManager';

export default class App {
  isReady() {
    return new Promise((resolve, reject) => {
      document.addEventListener('readystatechange', () => {
        if (document.readyState === 'complete') resolve();
      });

      let sidebarName: String = 'sidebar';
      let sidebar: Element = document.querySelector(`.${sidebarName}`);
      let sidebarButton: Element = document.querySelector(`.${sidebarName}__button`);
      let sidebarButtonText: Element = document.querySelector(`.${sidebarName}__button-text`);

      sidebarButton.addEventListener('click', (event) => {
        sidebar.classList.toggle(`${sidebarName}--active`);

        if (sidebar.classList.contains(`${sidebarName}--active`)) {
          sidebarButtonText.innerHTML = 'Fermer';

        } else {
          sidebarButtonText.innerHTML = "Les Oo'";
        }

        let infoOo: Element = document.querySelector('.oos__description--active');

        if (infoOo) {
          infoOo.classList.remove('oos__description--active');
        }
      });
    });
  }
}
