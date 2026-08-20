import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-head">
      <h1>Tenant portal</h1>
    </div>
    <div class="module-grid">
      @for (m of modules; track m.link) {
        <a class="module-tile" [routerLink]="m.link">
          <span class="module-tile-icon" [innerHTML]="m.icon"></span>
          <div class="module-title">{{ m.title }}</div>
          <p>{{ m.desc }}</p>
        </a>
      }
    </div>
  `,
})
export class TenantDashboardComponent {
  readonly modules = [
    { title: 'My Profile', desc: 'View and edit your details.', link: '/tenant/profile', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
    { title: 'Notifications', desc: 'Landlord notices and system alerts.', link: '/tenant/notifications', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' },
    { title: 'Payments', desc: 'Pay rent, view history.', link: '/tenant/payments', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>' },
    { title: 'Maintenance', desc: 'Report and track issues.', link: '/tenant/maintenance', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>' },
    { title: 'Documents', desc: 'Your lease and uploaded files.', link: '/tenant/documents', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>' },
    { title: 'Browse & Transfer', desc: 'Find vacant units for transfer.', link: '/tenant/browse-transfer', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' },
    { title: 'Messages', desc: 'Chat with your landlord.', link: '/tenant/messages', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
  ];
}
