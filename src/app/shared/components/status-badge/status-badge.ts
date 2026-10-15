import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-status-badge',
  styleUrl: './status-badge.scss',
  templateUrl: './status-badge.html',
})
export class StatusBadge {
  status = input<'published' | 'draft'>('published');
}
