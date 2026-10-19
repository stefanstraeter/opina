import { Component, effect, inject, signal } from '@angular/core';
import { ConfirmationData, Notifications } from '@core/services/notifications';
import { CheckIcon } from '@shared/components/check-icon/check-icon';
import { ClockIcon } from '@shared/components/clock-icon/clock-icon';

/**
 * @description Shows the confirmation card after an action worked. The data
 * comes from the Notifications service. The card stays until the service
 * removes the data, then it leaves with an animation.
 * @export
 * @class Confirmation
 */
@Component({
  imports: [CheckIcon, ClockIcon],
  selector: 'app-confirmation',
  styleUrl: './confirmation.scss',
  templateUrl: './confirmation.html',
})
export class Confirmation {
  private notifications = inject(Notifications);

  displayedData = signal<ConfirmationData | null>(null);
  isLeaving = signal(false);

  constructor() {
    effect(() => {
      const data = this.notifications.confirmation();
      if (data) {
        this.displayedData.set(data);
        this.isLeaving.set(false);
      } else if (this.displayedData()) {
        this.isLeaving.set(true);
      }
    });
  }

  /**
   * @description Removes the card from the screen once the leave animation
   * is finished. Does nothing if the card is not leaving.
   * @return {void}
   * @memberof Confirmation
   */
  onLeaveAnimationEnd(): void {
    if (this.isLeaving()) {
      this.displayedData.set(null);
    }
  }
}
