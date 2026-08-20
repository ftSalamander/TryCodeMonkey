import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MockDataService, PaymentRecord, nextId } from '../../../core/mock-data.service';

@Component({
  selector: 'app-receive-payment',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1>Receive payment</h1>
    <div class="card stack form-card">
      <div class="field">
        <label for="tenant">Select tenant</label>
        <select id="tenant" name="tenant" [(ngModel)]="tenantId">
          <option value="">— choose —</option>
          @for (t of data.tenants(); track t.id) {
            <option [value]="t.id">{{ t.name }}</option>
          }
        </select>
      </div>

      @if (tenantId) {
        <div class="notice notice-info" style="margin-bottom:0.5rem;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          <span><strong>Total due:</strong> ৳{{ totalDue() }}</span>
        </div>

        <div class="field">
          <label for="method">Payment method</label>
          <select id="method" name="method" [(ngModel)]="method">
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
            <option value="mobile">Mobile</option>
          </select>
        </div>

        <div class="field">
          <label for="amount">Amount paid</label>
          <input id="amount" type="number" name="amount" [(ngModel)]="amount" placeholder="BDT" />
        </div>

        <div class="actions-row">
          <button class="btn btn-primary" (click)="save()">Save payment, generate receipt</button>
        </div>

        @if (saved()) {
          <div class="notice notice-success" style="margin-bottom:0;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
            <span>Payment saved. {{ amount >= totalDue() ? 'Marked fully paid.' : 'Marked partially paid — remaining ৳' + (totalDue() - amount) + '.' }}</span>
          </div>
        }
      }
    </div>
  `,
})
export class ReceivePaymentComponent {
  protected readonly data = inject(MockDataService);

  tenantId = '';
  method: PaymentRecord['method'] = 'cash';
  amount = 0;
  readonly saved = signal(false);

  totalDue(): number {
    return this.data
      .invoices()
      .filter((i) => i.tenantId === this.tenantId && i.status !== 'paid')
      .reduce((sum, i) => sum + i.balance, 0);
  }

  save(): void {
    if (!this.tenantId || !this.amount) return;

    this.data.applyPaymentToTenant(this.tenantId, this.amount);

    this.data.payments.update((list) => [
      ...list,
      {
        id: nextId('pay'),
        tenantId: this.tenantId,
        invoiceId: '',
        amount: this.amount,
        method: this.method,
        status: 'confirmed',
        date: new Date().toISOString().slice(0, 10),
      },
    ]);

    this.saved.set(true);
  }
}
