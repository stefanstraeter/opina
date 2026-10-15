import { Service, signal } from '@angular/core';

@Service()
export class HeaderActions {
  showCreateSurveyButton = signal<boolean>(false);

  /**
   * @description Shows or hides the "Create survey" button in the header.
   * Pages that want the button call this with true when they open and with
   * false when they are left.
   * @param {boolean} value - true shows the button, false hides it.
   * @return {void}
   * @memberof HeaderActions
   */
  setCreateSurveyButtonVisible(value: boolean): void {
    this.showCreateSurveyButton.set(value);
  }
}
