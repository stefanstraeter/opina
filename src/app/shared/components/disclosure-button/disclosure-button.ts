import { Component, input, output } from '@angular/core';

/**
 * @description Button with a label and a chevron that flips between up/down
 * depending on isOpen. Used for anything that can be expanded/collapsed
 * (Dropdown header and SurveyResults toggle). Does not own the open/closed
 * state itself - the parent decides via isOpen and reacts to toggled.
 * @export
 * @class DisclosureButton
 */
@Component({
  imports: [],
  selector: 'app-disclosure-button',
  styleUrl: './disclosure-button.scss',
  templateUrl: './disclosure-button.html',
})
export class DisclosureButton {
  isOpen = input.required<boolean>();
  color = input<'light' | 'dark'>('light');
  toggled = output<void>();

  protected readonly downPath =
    'M11.5843 15.617L5.26163 9.44681C5.17442 9.3617 5.10901 9.2695 5.06541 9.17021C5.0218 9.07092 5 8.96454 5 8.85106C5 8.62411 5.07994 8.42553 5.23983 8.25532C5.39971 8.08511 5.61047 8 5.87209 8H19.1279C19.3895 8 19.6003 8.08511 19.7602 8.25532C19.9201 8.42553 20 8.62411 20 8.85106C20 8.9078 19.9128 9.10638 19.7384 9.44681L13.4157 15.617C13.2703 15.7589 13.125 15.8582 12.9797 15.9149C12.8343 15.9716 12.6744 16 12.5 16C12.3256 16 12.1657 15.9716 12.0203 15.9149C11.875 15.8582 11.7297 15.7589 11.5843 15.617Z';

  protected readonly upPath =
    'M12.4157 8.38298L18.7384 14.5532C18.8256 14.6383 18.891 14.7305 18.9346 14.8298C18.9782 14.9291 19 15.0355 19 15.1489C19 15.3759 18.9201 15.5745 18.7602 15.7447C18.6003 15.9149 18.3895 16 18.1279 16L4.87209 16C4.61047 16 4.39971 15.9149 4.23983 15.7447C4.07994 15.5745 4 15.3759 4 15.1489C4 15.0922 4.08721 14.8936 4.26163 14.5532L10.5843 8.38298C10.7297 8.24113 10.875 8.14184 11.0203 8.08511C11.1657 8.02837 11.3256 8 11.5 8C11.6744 8 11.8343 8.02837 11.9797 8.08511C12.125 8.14184 12.2703 8.24113 12.4157 8.38298Z';

  /**
   * @description Reports the click upward; the parent decides what open/closed means.
   * @return {void}
   * @memberof DisclosureButton
   */
  onToggle(): void {
    this.toggled.emit();
  }
}
