import { Component, inject } from '@angular/core';
import { MockDataService } from '../../../core/mock-data.service';

@Component({
  selector: 'app-pending-cash',
  standalone: true,
  template: `
    <h1>Pending cash payments</h1>
    <div class="card">
      <div class="table-scroll">
      <table>
        <thead><tr><th>Tenant</th><th>Amount</th><th>Date</th><th></th></tr></thead>
        <tbody>
          @for (p of pending(); track p.id) {
            <tr>
              <td><strong>{{ tenantName(p.tenantId) }}</strong></td>
              <td class="tnum">৳{{ p.amount }}</td>
              <td>{{ p.date }}</td>
              <td>
                <div class="table-cell-actions">
                  <button class="btn btn-sm btn-primary" (click)="confirm(p.id, true)">Confirm received</button>
                  <button class="btn btn-sm btn-danger" (click)="confirm(p.id, false)">Reject / flag</button>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="4">
                <div class="empty-state">
                  <span class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                  </span>
                  <p>No pending cash payments.</p>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
      </div>
    </div>
  `,
})
export class PendingCashComponent {
  protected readonly data = inject(MockDataService);

  pending() {
    return this.data.payments().filter((p) => p.status === 'pending');
  }

  tenantName(tenantId: string): string {
    return this.data.tenants().find((t) => t.id === tenantId)?.name ?? '—';
  }

  confirm(paymentId: string, received: boolean): void {
    const payment = this.data.payments().find((p) => p.id === paymentId);

    this.data.payments.update((list) =>
      list.map((p) => (p.id === paymentId ? { ...p, status: received ? 'confirmed' : 'rejected' } : p))
    );

    // The invoice only clears once the landlord confirms the cash actually arrived.
    if (received && payment) {
      this.data.applyPaymentToTenant(payment.tenantId, payment.amount);
    }
  }
}
