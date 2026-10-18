import { Component, computed, input } from '@angular/core';

/**
 * @description Row of small dots that shows where you are in a row of items
 * (for example a horizontally scrolled card row). The active dot is longer.
 * Purely visual and hidden from screen readers; the parent decides which
 * dot is active.
 * @export
 * @class PaginationDots
 */
@Component({
  imports: [],
  selector: 'app-pagination-dots',
  styleUrl: './pagination-dots.scss',
  templateUrl: './pagination-dots.html',
})
export class PaginationDots {
  count = input.required<number>();
  activeIndex = input.required<number>();
  dots = computed(() => Array.from({ length: this.count() }, (_, i) => i));
}
