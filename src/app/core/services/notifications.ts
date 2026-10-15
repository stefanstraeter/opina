import { signal, Service } from '@angular/core';

const DEFAULT_DURATION_MS = 1500;

@Service()
export class Notifications {
  message = signal<string | null>(null);

  /**
   * @description Shows a notification message and removes it again after
   * the given time.
   * @param {string} message - The text to show.
   * @param {number} [durationMs] - How long the message stays, in milliseconds.
   * @return {void}
   * @memberof Notifications
   */
  show(message: string, durationMs = DEFAULT_DURATION_MS): void {
    this.message.set(message);
    setTimeout(() => this.message.set(null), durationMs);
  }
}
