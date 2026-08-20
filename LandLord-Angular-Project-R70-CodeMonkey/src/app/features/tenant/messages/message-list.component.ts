import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../../core/mock-data.service';

@Component({
  selector: 'app-tenant-message-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Messages</h1>
    <div class="card list-card">
      @for (c of data.conversations(); track c.id) {
        <a class="list-item" [routerLink]="['/tenant/messages', c.id]">
          <span class="thumb-avatar indigo">{{ initials(c.withName) }}</span>
          <div class="list-item-main">
            <div class="list-item-title">{{ c.withName }}</div>
            <div class="list-item-sub">{{ lastMessage(c) }}</div>
          </div>
          <div class="list-item-meta">
            <span class="meta-date">{{ lastDate(c) }}</span>
          </div>
        </a>
      } @empty {
        <div class="empty-state">
          <span class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </span>
          <p>No conversations yet.</p>
        </div>
      }
    </div>
  `,
})
export class TenantMessageListComponent {
  protected readonly data = inject(MockDataService);

  initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  lastMessage(c: { messages: { from: string; text: string; date: string }[] }): string {
    return c.messages[c.messages.length - 1]?.text ?? '';
  }

  lastDate(c: { messages: { from: string; text: string; date: string }[] }): string {
    return c.messages[c.messages.length - 1]?.date ?? '';
  }
}
