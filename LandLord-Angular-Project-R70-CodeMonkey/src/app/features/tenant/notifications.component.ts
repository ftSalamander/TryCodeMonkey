import { Component, inject, signal } from '@angular/core';
import { MockDataService } from '../../core/mock-data.service';

@Component({
  selector: 'app-tenant-notifications',
  standalone: true,
  template: `
    <h1>Notifications</h1>
    <div class="card list-card">
      @for (n of data.notifications(); track n.id) {
        <div class="list-item" (click)="open(n.id)" style="cursor:pointer;">
          <span class="thumb-avatar" [class.indigo]="n.read" [class.amber]="!n.read">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </span>
          <div class="list-item-main">
            <div class="list-item-title">
              {{ n.title }}
              @if (!n.read) {
                <span class="unread-dot" title="Unread"></span>
              }
            </div>
            @if (opened() === n.id) {
              <div class="list-item-sub" style="white-space:normal;">{{ n.body }}</div>
              <div class="actions-row" style="margin-top:0.5rem;">
                <button class="btn btn-sm btn-danger" (click)="remove(n.id); $event.stopPropagation()">Delete</button>
              </div>
            }
          </div>
        </div>
      } @empty {
        <div class="empty-state">
          <span class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </span>
          <p>No notifications.</p>
        </div>
      }
    </div>
  `,
})
export class TenantNotificationsComponent {
  protected readonly data = inject(MockDataService);
  readonly opened = signal('');

  open(id: string): void {
    this.opened.set(this.opened() === id ? '' : id);
    this.data.notifications.update((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  remove(id: string): void {
    this.data.notifications.update((list) => list.filter((n) => n.id !== id));
  }
}
