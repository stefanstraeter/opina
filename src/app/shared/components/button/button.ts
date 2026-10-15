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
    'primary' | 'secondary' | 'tertiary' | 'filter' | 'neutral' | 'icon'
  >('primary');
  size = input<'sm' | 'md'>('md');
  active = input<boolean>(false);
  disabled = input<boolean>(false);
}
