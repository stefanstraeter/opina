import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@layout/header/header';
import { Confirmation } from '@shared/components/confirmation/confirmation';
import { Overlay } from '@shared/components/overlay/overlay';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Overlay, Confirmation],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('poll-app');
}
