import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-button',
  styleUrl: './button.scss',
  templateUrl: './button.html',
})
export class Button {
  type = input<'button' | 'submit'>('button');
  variant = input<
    'primary' | 'secondary' | 'tertiary' | 'filter' | 'text' | 'dashed' | 'icon'
  >('primary');
  size = input<'md' | 'round'>('md');
  active = input<boolean>(false);
  disabled = input<boolean>(false);
}
