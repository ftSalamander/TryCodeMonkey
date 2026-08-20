import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MockDataService, periodLabel } from '../../../core/mock-data.service';

@Component({
  selector: 'app-tenant-detail',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (tenant()) {
      <div class="card" style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
        <span class="avatar" style="width:52px;height:52px;font-size:1.1rem;">{{ initials(tenant()!.name) }}</span>
        <div style="flex:1;min-width:200px;">
          <h1 style="margin:0 0 0.2rem;">{{ tenant()!.name }}</h1>
          <span class="badge" [class.badge-active]="tenant()!.status === 'active'" [class.badge-inactive]="tenant()!.status === 'inactive'">{{ tenant()!.status }}</span>
        </div>
      </div>

      <div class="card">
        <div class="kv-list">
          <div class="kv">
            <span class="kv-label">National ID</span>
            <span class="kv-value tnum">{{ tenant()!.nationalId }}</span>
          </div>
          <div class="kv">
            <span class="kv-label">Phone</span>
            <span class="kv-value tnum">{{ tenant()!.phone }}</span>
          </div>
          <div class="kv">
            <span class="kv-label">Email</span>
            <span class="kv-value">{{ tenant()!.email }}</span>
          </div>
          <div class="kv">
            <span class="kv-label">Unit</span>
            <span class="kv-value">{{ unitLabel() }}</span>
          </div>
        </div>
      </div>

      @if (agreement()) {
        <div class="card">
          <h3>Rental agreement</h3>
          @if (!editing()) {
            <div class="kv-list" style="margin-bottom:1rem;">
              <div class="kv">
                <span class="kv-label">Terms</span>
                <span class="kv-value">{{ agreement()!.terms }}</span>
              </div>
              <div class="kv">
                <span class="kv-label">Deposit</span>
                <span class="kv-value">৳{{ agreement()!.deposit }}</span>
              </div>
              <div class="kv">
                <span class="kv-label">Start date</span>
                <span class="kv-value">{{ agreement()!.startDate }}</span>
              </div>
            </div>
            <button class="btn" (click)="editing.set(true)">Edit lease agreement</button>
          } @else {
            <div class="field">
              <label for="terms">Terms</label>
              <input id="terms" name="terms" [(ngModel)]="termsDraft" />
            </div>
            <div class="actions-row">
              <button class="btn btn-primary" (click)="saveTerms()">Save changes</button>
              <button class="btn" (click)="editing.set(false)">Cancel</button>
            </div>
          }
        </div>
      }

      <div class="summary-strip">
        <div class="summary-chip">
          <span class="chip-value" style="color:var(--danger);">৳{{ totalDue() }}</span>
          <span class="chip-label">Total due</span>
        </div>
        <div class="summary-chip">
          <span class="chip-value" style="color:var(--success);">৳{{ totalPaid() }}</span>
          <span class="chip-label">Total paid (lifetime)</span>
        </div>
        <div class="summary-chip">
          <span class="chip-value">৳{{ totalMaintenanceCost() }}</span>
          <span class="chip-label">Maintenance (tenant-borne)</span>
        </div>
      </div>

      <div class="card">
        <h3>Billing history</h3>
        <div class="table-scroll">
        <table>
          <thead><tr><th>Month</th><th>Rent</th><th>Utilities</th><th>Rolled over</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            @for (i of billingHistory(); track i.id) {
              <tr>
                <td>{{ monthLabel(i.period) }}</td>
                <td class="tnum">৳{{ i.rent }}</td>
                <td class="tnum" [title]="i.utilityItems.map(u => u.label + ': ' + u.amount).join(', ')">৳{{ data.invoiceUtilitiesTotal(i) }}</td>
                <td class="tnum">৳{{ i.prevUnpaidRolled }}</td>
                <td class="tnum">
                  @if (i.status === 'partial') {
                    <strong>৳{{ i.balance }}/৳{{ i.amount }}</strong>
                  } @else {
                    <strong>৳{{ i.balance }}</strong>
                  }
                </td>
                <td><span class="badge" [class.badge-unpaid]="i.status === 'unpaid'" [class.badge-partial]="i.status === 'partial'" [class.badge-paid]="i.status === 'paid'">{{ i.status }}</span></td>
              </tr>
            } @empty {
              <tr><td colspan="6" class="hint-text">No bills yet.</td></tr>
            }
          </tbody>
        </table>
        </div>
      </div>

      <div class="card">
        <h3>Payment history</h3>
        <div class="table-scroll">
        <table>
          <thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
          <tbody>
            @for (p of paymentHistory(); track p.id) {
              <tr>
                <td>{{ p.date }}</td>
                <td class="tnum">৳{{ p.amount }}</td>
                <td>{{ p.method }}</td>
                <td>
                  <span class="badge" [class.badge-confirmed]="p.status === 'confirmed'" [class.badge-pending]="p.status === 'pending'" [class.badge-rejected]="p.status === 'rejected'">
                    {{ p.status }}
                  </span>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="4" class="hint-text">No payments yet.</td></tr>
            }
          </tbody>
        </table>
        </div>
      </div>

      <div class="card">
        <h3>Maintenance cost history</h3>
        <div class="table-scroll">
        <table>
          <thead><tr><th>Date</th><th>Description</th><th>Bearer</th><th>Amount</th></tr></thead>
          <tbody>
            @for (m of maintenanceHistory(); track m.id) {
              <tr>
                <td>{{ m.date }}</td>
                <td>{{ m.description }}</td>
                <td>{{ m.bearer === 'tenant' ? 'Tenant' : 'Landlord' }}</td>
                <td class="tnum">৳{{ m.amount }}</td>
              </tr>
            } @empty {
              <tr><td colspan="4" class="hint-text">No maintenance costs yet.</td></tr>
            }
          </tbody>
        </table>
        </div>
      </div>
    }
  `,
})
export class TenantDetailComponent {
  protected readonly data = inject(MockDataService);
  private readonly tenantId = inject(ActivatedRoute).snapshot.paramMap.get('tenantId')!;

  readonly editing = signal(false);
  termsDraft = '';

  readonly tenant = computed(() => this.data.tenants().find((t) => t.id === this.tenantId));
  readonly agreement = computed(() => this.data.agreements().find((a) => a.tenantId === this.tenantId));
  readonly billingHistory = computed(() => this.data.invoicesForTenant(this.tenantId));
  readonly paymentHistory = computed(() => this.data.paymentsForTenant(this.tenantId));
  readonly totalDue = computed(() => this.data.totalDueForTenant(this.tenantId));
  readonly totalPaid = computed(() => this.data.totalPaidForTenant(this.tenantId));
  readonly totalMaintenanceCost = computed(() => this.data.maintenanceCostForTenant(this.tenantId));
  readonly maintenanceHistory = computed(() => this.data.maintenanceHistoryForTenant(this.tenantId));

  constructor() {
    const a = this.agreement();
    if (a) this.termsDraft = a.terms;
  }

  initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  monthLabel(period: string): string {
    return periodLabel(period);
  }

  unitLabel(): string {
    return this.data.units().find((u) => u.id === this.tenant()?.unitId)?.unitNumber ?? '—';
  }

  saveTerms(): void {
    const a = this.agreement();
    if (!a) return;
    this.data.agreements.update((list) => list.map((x) => (x.id === a.id ? { ...x, terms: this.termsDraft } : x)));
    this.editing.set(false);
  }
}
