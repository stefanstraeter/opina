import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-progress-bar',
  styleUrl: './progress-bar.scss',
  templateUrl: './progress-bar.html',
})
export class ProgressBar {
  percentage = input.required<number>();
}
