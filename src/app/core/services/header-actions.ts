import { Service, signal } from '@angular/core';

@Service()
export class HeaderActions {
  showCreateSurveyButton = signal<boolean>(false);
  showDetailControls = signal<boolean>(false);
  isNarrow = signal<boolean>(false);

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

  /**
   * @description Shows or hides the controls of the survey detail page in the
   * header on small screens: the back button and the "Results" button. The
   * detail page calls this with true when it opens and with false when it is
   * left.
   * @param {boolean} value - true shows the controls, false hides them.
   * @return {void}
   * @memberof HeaderActions
   */
  setDetailControlsVisible(value: boolean): void {
    this.showDetailControls.set(value);
  }

  /**
   * @description Makes the content of the header as narrow as the panel of
   * the create page on large screens. The create page calls this with true
   * when it opens and with false when it is left.
   * @param {boolean} value - true makes the header narrow, false resets it.
   * @return {void}
   * @memberof HeaderActions
   */
  setNarrow(value: boolean): void {
    this.isNarrow.set(value);
  }
}
