import { signal, effect, Service } from '@angular/core';

@Service()
export class Theme {
  isLightMode = signal<boolean>(true);

  constructor() {
    effect(() => {
      if (this.isLightMode()) {
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
      }
    });
  }

  /**
   * @description Switches the app between light mode (default) and dark mode.
   * @param {boolean} value - true for light mode, false for dark mode.
   * @return {void}
   * @memberof Theme
   */
  setLightMode(value: boolean): void {
    this.isLightMode.set(value);
  }
}
