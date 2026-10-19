import { signal, Service } from '@angular/core';

const DEFAULT_DURATION_MS = 1500;

/**
 * @description The content of the confirmation card that is shown after an
 * action worked, for example after publishing a survey.
 * @export
 * @interface ConfirmationData
 */
export interface ConfirmationData {
  tone: 'accent' | 'success';
  eyebrow: string;
  headline: string;
  text: string;
  category: string;
  title: string;
  info: string;
  infoAsBadge: boolean;
  isInfoUrgent: boolean;
}

@Service()
export class Notifications {
  message = signal<string | null>(null);
  confirmation = signal<ConfirmationData | null>(null);

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

  /**
   * @description Shows the confirmation card and removes it again after the
   * given time.
   * @param {ConfirmationData} data - The content of the card.
   * @param {number} durationMs - How long the card stays, in milliseconds.
   * @return {void}
   * @memberof Notifications
   */
  showConfirmation(data: ConfirmationData, durationMs: number): void {
    this.confirmation.set(data);
    setTimeout(() => this.confirmation.set(null), durationMs);
  }
}
