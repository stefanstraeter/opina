import { Component, effect, inject, signal } from '@angular/core';
import { Notifications } from '@core/services/notifications';

@Component({
  imports: [],
  selector: 'app-overlay',
  styleUrl: './overlay.scss',
  templateUrl: './overlay.html',
})
export class Overlay {
  private notifications = inject(Notifications);

  displayedMessage = signal<string | null>(null);
  isLeaving = signal(false);

  constructor() {
    effect(() => {
      const text = this.notifications.message();
      if (text) {
        this.displayedMessage.set(text);
        this.isLeaving.set(false);
      } else if (this.displayedMessage()) {
        this.isLeaving.set(true);
      }
    });
  }

  /**
   * @description Removes the message from the screen once the leave animation
   * is finished. Does nothing if the message is not leaving.
   * @return {void}
   * @memberof Overlay
   */
  onLeaveAnimationEnd(): void {
    if (this.isLeaving()) {
      this.displayedMessage.set(null);
    }
  }
}
