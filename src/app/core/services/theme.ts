import { signal, effect, Service } from '@angular/core';

@Service()
export class Theme {
  isDarkMode = signal<boolean>(true);

  constructor() {
    effect(() => {
      if (this.isDarkMode()) {
        document.body.classList.remove('light-theme');
      } else {
        document.body.classList.add('light-theme');
      }
    });
  }

  /**
   * @description Switches the app between dark mode and light mode.
   * @param {boolean} value - true for dark mode, false for light mode.
   * @return {void}
   * @memberof Theme
   */
  setDarkMode(value: boolean): void {
    this.isDarkMode.set(value);
  }
}
