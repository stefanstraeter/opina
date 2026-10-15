import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '@shared/components/button/button';

/**
 * @description Shows a message that something could not be found, plus a
 * button back to the start page.
 * @export
 * @class NotFound
 */
@Component({
  imports: [Button, RouterLink],
  selector: 'app-not-found',
  styleUrl: './not-found.scss',
  templateUrl: './not-found.html',
})
export class NotFound {
  message = input('Page not found.');
}
