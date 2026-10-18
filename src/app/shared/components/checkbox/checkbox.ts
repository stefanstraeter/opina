import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-checkbox',
  styleUrl: './checkbox.scss',
  templateUrl: './checkbox.html',
})
export class Checkbox {
  checked = input<boolean>(false);
  disabled = input<boolean>(false);
  toggled = output<boolean>();

  /**
   * @description Reports the opposite of the current checked state to the
   * parent, the parent decides whether the checkbox really changes.
   * @return {void}
   * @memberof Checkbox
   */
  onToggle(): void {
    this.toggled.emit(!this.checked());
  }
}
