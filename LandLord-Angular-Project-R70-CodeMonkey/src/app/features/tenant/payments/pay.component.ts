import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CURRENT_TENANT_ID, MockDataService, nextId } from '../../../core/mock-data.service';

@Component({
  selector: 'app-tenant-pay',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1>Payments</h1>
    <div class="card form-card">
      @if (nextInvoice(); as inv) {
        <div class="notice notice-info" style="margin-bottom:0.9rem;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          <span><strong>Current due:</strong> ৳{{ totalDue() }}</span>
        </div>

        <div class="bill-lines">
          <div class="bill-line">
            <span>Rent</span>
            <span class="amount">৳{{ inv.rent }}</span>
          </div>
          @for (u of inv.utilityItems; track u.label) {
            <div class="bill-line">
              <span>{{ u.label }}</span>
              <span class="amount">৳{{ u.amount }}</span>
            </div>
          }
          @if (inv.prevUnpaidRolled) {
            <div class="bill-line">
              <span>Previous unpaid balance</span>
              <span class="amount">৳{{ inv.prevUnpaidRolled }}</span>
            </div>
          }
          <div class="bill-line total">
            <span>Total for this bill</span>
            <span class="amount">৳{{ inv.amount }}</span>
          </div>
        </div>
      } @else {
        <div class="notice notice-info" style="margin-bottom:0.9rem;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          <span><strong>Current due:</strong> ৳{{ totalDue() }}</span>
        </div>
      }

      <div class="field">
        <label for="amount">Amount to pay</label>
        <input id="amount" type="number" name="amount" [(ngModel)]="amount" placeholder="BDT" />
      </div>

      <div class="field">
        <label for="method">Payment method</label>
        <div class="seg" style="width:100%;">
          <button type="button" [class.active]="method === 'online'" (click)="method = 'online'">Online</button>
          <button type="button" [class.active]="method === 'cash'" (click)="method = 'cash'">Cash (offline)</button>
        </div>
      </div>

      @if (method === 'cash') {
        <div class="field">
          <label for="date">Payment date</label>
          <input id="date" type="date" name="date" [(ngModel)]="date" />
        </div>
        <button class="btn btn-primary btn-block" (click)="payCash()">Submit — awaiting landlord confirmation</button>
      } @else {
        <button class="btn btn-primary btn-block" (click)="payOnline()">Open payment gateway</button>
      }

      @if (result()) {
        <div class="notice" [class.notice-success]="!result()!.startsWith('Error')" [class.notice-warning]="result()!.startsWith('Error')" style="margin-bottom:0;margin-top:0.9rem;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          <span>{{ result() }}</span>
        </div>
      }
    </div>
  `,
})
export class TenantPayComponent {
  private readonly data = inject(MockDataService);

  amount = 0;
  method: 'online' | 'cash' = 'online';
  date = new Date().toISOString().slice(0, 10);
  readonly result = signal('');

  readonly nextInvoice = computed(() =>
    this.data
      .invoicesForTenant(CURRENT_TENANT_ID)
      .filter((i) => i.status !== 'paid')
      .sort((a, b) => a.period.localeCompare(b.period))[0]
  );

  totalDue(): number {
    return this.data
      .invoices()
      .filter((i) => i.tenantId === CURRENT_TENANT_ID && i.status !== 'paid')
      .reduce((sum, i) => sum + i.balance, 0);
  }

  payOnline(): void {
    if (!this.amount) return;
    // Simulated gateway — always succeeds in this frontend-only build.
    this.data.applyPaymentToTenant(CURRENT_TENANT_ID, this.amount);
    this.recordPayment('confirmed');
    this.result.set('Payment successful. Balance updated.');
  }

  payCash(): void {
    if (!this.amount) return;
    // Balance only clears once the landlord confirms the cash arrived — see pending-cash.component.ts.
    this.recordPayment('pending');
    this.result.set('Saved as pending — awaiting landlord confirmation.');
  }

  private recordPayment(status: 'confirmed' | 'pending'): void {
    this.data.payments.update((list) => [
      ...list,
      {
        id: nextId('pay'),
        tenantId: CURRENT_TENANT_ID,
        invoiceId: '',
        amount: this.amount,
        method: this.method,
        status,
        date: this.date,
      },
    ]);
  }
}
