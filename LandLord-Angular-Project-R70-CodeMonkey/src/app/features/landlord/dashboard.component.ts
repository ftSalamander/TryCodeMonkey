import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockDataService, periodLabel } from '../../core/mock-data.service';

@Component({
  selector: 'app-landlord-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>{{ currentPeriodLabel() }} overview</h1>
    <div class="stat-grid" style="margin-bottom:2rem;">
      <div class="stat-card stat-blue">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-4h6v4"/><path d="M8 7h.01M12 7h.01M16 7h.01"/></svg>
        </div>
        <div>
          <p class="stat-label">Occupancy</p>
          <h2 class="stat-value">{{ occupancy().occupied }}/{{ occupancy().total }}</h2>
        </div>
      </div>
      <div class="stat-card stat-green">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 7l-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></svg>
        </div>
        <div>
          <p class="stat-label">Collected this month</p>
          <h2 class="stat-value">৳{{ collected() }}</h2>
        </div>
      </div>
      <div class="stat-card stat-red">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        </div>
        <div>
          <p class="stat-label">Outstanding this month</p>
          <h2 class="stat-value">৳{{ outstanding() }}</h2>
        </div>
      </div>
      <div class="stat-card stat-blue">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>
        </div>
        <div>
          <p class="stat-label">Net this month</p>
          <h2 class="stat-value">৳{{ net() }}</h2>
        </div>
      </div>
      <div class="stat-card stat-amber">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </div>
        <div>
          <p class="stat-label">Pending maintenance</p>
          <h2 class="stat-value">{{ pendingMaintenance() }}</h2>
        </div>
      </div>
    </div>

    <h1>Manage your property</h1>
    <div class="module-grid">
      @for (m of modules; track m.link) {
        <a class="module-tile" [routerLink]="m.link">
          <div class="module-title">{{ m.title }}</div>
          <p>{{ m.desc }}</p>
        </a>
      }
    </div>
  `,
})
export class LandlordDashboardComponent {
  private readonly data = inject(MockDataService);

  private readonly period = this.data.currentPeriod();
  readonly occupancy = () => this.data.occupancyStats();
  readonly collected = () => this.data.collectedInPeriod(this.period);
  readonly outstanding = () => this.data.outstandingInPeriod(this.period);
  readonly pendingMaintenance = () => this.data.pendingMaintenanceCount();
  readonly net = () => this.collected() - this.data.expensesInPeriod(this.period);

  currentPeriodLabel(): string {
    return periodLabel(this.period);
  }

  readonly modules = [
    { title: 'Property & Units', desc: 'Manage properties and unit status.', link: '/landlord/properties' },
    { title: 'Tenant Management', desc: 'Register, view, and move out tenants.', link: '/landlord/tenants' },
    { title: 'Marketplace & Leads', desc: 'Ads and booking requests.', link: '/landlord/marketplace' },
    { title: 'Rental Agreements', desc: 'View and edit lease terms.', link: '/landlord/rentals' },
    { title: 'Payments', desc: 'Generate bills, receive payments.', link: '/landlord/payments' },
    { title: 'Expenses', desc: 'Track property and tenant expenses.', link: '/landlord/expenses' },
    { title: 'Ledger', desc: 'All money in and out, one cash book.', link: '/landlord/ledger' },
    { title: 'Maintenance', desc: 'Log and resolve issues.', link: '/landlord/maintenance' },
    { title: 'Messages', desc: 'Chat with tenants and applicants.', link: '/landlord/messages' },
  ];
}
