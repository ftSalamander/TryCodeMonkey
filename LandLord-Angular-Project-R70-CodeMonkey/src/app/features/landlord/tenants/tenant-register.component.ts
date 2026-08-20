import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MockDataService, nextId } from '../../../core/mock-data.service';

@Component({
  selector: 'app-tenant-register',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1>Register tenant (walk-in)</h1>

    <div class="card stack form-card-lg">
      <div>
        <h3 class="card-heading">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          1 &middot; Tenant info
        </h3>
        <div class="form-row">
          <div class="field">
            <label for="name">Full name</label>
            <input id="name" name="name" [(ngModel)]="name" placeholder="e.g. Rahim Uddin" required />
          </div>
          <div class="field">
            <label for="phone">Phone</label>
            <input id="phone" name="phone" [(ngModel)]="phone" placeholder="e.g. 01XXX-XXXXXX" required />
          </div>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" name="email" [(ngModel)]="email" placeholder="name@example.com" required />
          </div>
          <div class="field">
            <label for="nationalId">National ID (or passport)</label>
            <input id="nationalId" name="nationalId" [(ngModel)]="nationalId" placeholder="e.g. 1234567890" required />
          </div>
        </div>
        @if (nidError()) {
          <div class="notice notice-warning" style="margin-bottom:0;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>
            <span>{{ nidError() }}</span>
          </div>
        }
      </div>

      <div>
        <h3 class="card-heading">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/></svg>
          2 &middot; Assign unit &amp; agreement
        </h3>
        <div class="field">
          <label for="unit">Vacant unit</label>
          <select id="unit" name="unit" [(ngModel)]="unitId">
            @for (u of vacantUnits(); track u.id) {
              <option [value]="u.id">{{ propertyName(u.propertyId) }} &gt; {{ u.unitNumber }} &gt; ৳{{ u.rent }}/mo</option>
            }
          </select>
        </div>
        <div class="form-row">
          <div class="field">
            <label for="terms">Lease terms</label>
            <input id="terms" name="terms" [(ngModel)]="terms" placeholder="e.g. 12-month lease" />
          </div>
          <div class="field">
            <label for="deposit">Security deposit</label>
            <input id="deposit" type="number" name="deposit" [(ngModel)]="deposit" placeholder="BDT" />
          </div>
        </div>
      </div>

      <div class="actions-row">
        <button class="btn btn-primary" (click)="save()">Confirm agreement &amp; assign unit</button>
      </div>
    </div>
  `,
})
export class TenantRegisterComponent {
  private readonly data = inject(MockDataService);
  private readonly router = inject(Router);

  name = '';
  phone = '';
  email = '';
  nationalId = '';
  unitId = '';
  terms = '';
  deposit: number | null = null;
  readonly nidError = signal('');

  vacantUnits() {
    return this.data.units().filter((u) => u.status === 'vacant');
  }

  propertyName(propertyId: string): string {
    return this.data.properties().find((p) => p.id === propertyId)?.name ?? '—';
  }

  save(): void {
    if (!this.name || !this.unitId || !this.nationalId) return;

    const existing = this.data.activeTenantByNationalId(this.nationalId);
    if (existing) {
      this.nidError.set(`This National ID is already registered to an active tenant (${existing.name}).`);
      return;
    }
    this.nidError.set('');

    const tenantId = nextId('t');
    this.data.tenants.update((list) => [
      ...list,
      { id: tenantId, name: this.name, phone: this.phone, email: this.email, nationalId: this.nationalId, unitId: this.unitId, status: 'active' },
    ]);
    this.data.agreements.update((list) => [
      ...list,
      {
        id: nextId('a'),
        tenantId,
        unitId: this.unitId,
        startDate: new Date().toISOString().slice(0, 10),
        terms: this.terms || 'Standard lease',
        deposit: this.deposit ?? 0,
      },
    ]);
    this.data.units.update((list) => list.map((u) => (u.id === this.unitId ? { ...u, status: 'occupied' } : u)));

    this.router.navigateByUrl('/landlord/tenants');
  }
}
