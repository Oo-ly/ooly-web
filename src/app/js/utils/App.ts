import '../../scss/app.scss';
import * as Promise from 'bluebird';

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

      sidebarButton.addEventListener('click', event => {
        sidebar.classList.toggle(`${sidebarName}--active`);

        if (sidebar.classList.contains(`${sidebarName}--active`)) {
          sidebarButtonText.innerHTML = 'Fermer';
        } else {
          sidebarButtonText.innerHTML = "Les Oo'";
        }
      });
    });
  }
}
