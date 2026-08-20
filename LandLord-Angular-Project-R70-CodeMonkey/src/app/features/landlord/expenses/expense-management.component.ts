import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExpenseRecord, MockDataService, nextId } from '../../../core/mock-data.service';

@Component({
  selector: 'app-expense-management',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1>Expenses</h1>

    <div class="summary-strip">
      <div class="summary-chip">
        <span class="chip-value" style="color:var(--danger);">৳{{ landlordTotal() }}</span>
        <span class="chip-label">Landlord expenses</span>
      </div>
      <div class="summary-chip">
        <span class="chip-value">৳{{ tenantTotal() }}</span>
        <span class="chip-label">Tenant-borne</span>
      </div>
      <div class="summary-chip">
        <span class="chip-value">{{ data.expenses().length }}</span>
        <span class="chip-label">Records</span>
      </div>
    </div>

    <div class="split-layout">
      <div class="card form-card">
        <h3>Log expense</h3>
        <div class="field">
          <label for="property">Property</label>
          <select id="property" name="property" [(ngModel)]="propertyId">
            @for (p of data.properties(); track p.id) {
              <option [value]="p.id">{{ p.name }}</option>
            }
          </select>
        </div>
        <div class="field">
          <label for="bearer">Who bears this?</label>
          <div class="seg" style="width:100%;">
            <button type="button" [class.active]="bearer === 'landlord'" (click)="bearer = 'landlord'">Landlord</button>
            <button type="button" [class.active]="bearer === 'tenant'" (click)="bearer = 'tenant'">Tenant</button>
          </div>
        </div>
        @if (bearer === 'tenant') {
          <div class="field">
            <label for="tenant">Tenant</label>
            <select id="tenant" name="tenant" [(ngModel)]="tenantId">
              <option value="">— choose —</option>
              @for (t of data.tenants(); track t.id) {
                <option [value]="t.id">{{ t.name }}</option>
              }
            </select>
          </div>
        }
        <div class="field">
          <label for="amount">Amount</label>
          <input id="amount" type="number" name="amount" [(ngModel)]="amount" placeholder="BDT" />
        </div>
        <div class="field">
          <label for="category">Category</label>
          <input id="category" name="category" [(ngModel)]="category" placeholder="e.g. Repairs, Utilities" />
        </div>
        <div class="field">
          <label for="description">Description</label>
          <input id="description" name="description" [(ngModel)]="description" />
        </div>
        <div class="actions-row">
          <button class="btn btn-primary" (click)="save()">Save expense</button>
        </div>
      </div>

      <div class="card">
        <div class="table-scroll">
        <table>
          <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Bearer</th><th>Amount</th></tr></thead>
          <tbody>
            @for (e of data.expenses(); track e.id) {
              <tr>
                <td>{{ e.date }}</td>
                <td>{{ e.category }}</td>
                <td>{{ e.description }}</td>
                <td>{{ e.bearer === 'tenant' ? tenantName(e.tenantId) : 'Landlord' }}</td>
                <td class="tnum">৳{{ e.amount }}</td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5">
                  <div class="empty-state">
                    <span class="empty-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2 1z"/></svg>
                    </span>
                    <p>No expenses logged yet.</p>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
        </div>
      </div>
    </div>
  `,
})
export class ExpenseManagementComponent {
  protected readonly data = inject(MockDataService);

  propertyId = this.data.properties()[0]?.id ?? '';
  bearer: ExpenseRecord['bearer'] = 'landlord';
  tenantId = '';
  amount = 0;
  category = '';
  description = '';

  landlordTotal(): number {
    return this.data.expenses().filter((e) => e.bearer === 'landlord').reduce((s, e) => s + e.amount, 0);
  }

  tenantTotal(): number {
    return this.data.expenses().filter((e) => e.bearer === 'tenant').reduce((s, e) => s + e.amount, 0);
  }

  tenantName(tenantId?: string): string {
    return this.data.tenants().find((t) => t.id === tenantId)?.name ?? '—';
  }

  save(): void {
    if (!this.amount || !this.category || !this.propertyId) return;
    if (this.bearer === 'tenant' && !this.tenantId) return;

    this.data.expenses.update((list) => [
      ...list,
      {
        id: nextId('exp'),
        propertyId: this.propertyId,
        category: this.category,
        description: this.description,
        amount: this.amount,
        bearer: this.bearer,
        tenantId: this.bearer === 'tenant' ? this.tenantId : undefined,
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    this.amount = 0;
    this.category = '';
    this.description = '';
    this.tenantId = '';
  }
}
