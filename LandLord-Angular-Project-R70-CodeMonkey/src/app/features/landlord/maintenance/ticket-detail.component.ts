import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseRecord, MockDataService, nextId } from '../../../core/mock-data.service';

@Component({
  selector: 'app-landlord-ticket-detail',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (ticket()) {
      <h1>Ticket</h1>
      <div class="card form-card stack">
        <div class="kv-list">
          <div class="kv">
            <span class="kv-label">Unit</span>
            <span class="kv-value">{{ unitLabel() }}</span>
          </div>
          <div class="kv">
            <span class="kv-label">Tenant</span>
            <span class="kv-value">{{ tenantName() }}</span>
          </div>
          <div class="kv">
            <span class="kv-label">Description</span>
            <span class="kv-value">{{ ticket()!.description }}</span>
          </div>
          <div class="kv">
            <span class="kv-label">Status</span>
            <span class="badge" [class.badge-pending]="ticket()!.status === 'pending'" [class.badge-resolved]="ticket()!.status === 'resolved'">{{ ticket()!.status }}</span>
          </div>
        </div>

        @if (ticket()!.status === 'pending') {
          @if (!asking()) {
            <button class="btn btn-primary" (click)="askCost()">Mark resolved</button>
          }

          @if (asking() && !costingForm()) {
            <div class="field">
              <label>Did repair cost money?</label>
              <div class="btn-group">
                <button class="btn btn-sm btn-primary" (click)="costingForm.set(true)">Yes</button>
                <button class="btn btn-sm" (click)="resolve()">No</button>
              </div>
            </div>
          }

          @if (costingForm()) {
            <div class="field">
              <label for="amount">Amount</label>
              <input id="amount" type="number" name="amount" [(ngModel)]="amount" placeholder="BDT" />
            </div>
            <div class="field">
              <label for="bearer">Who bears this?</label>
              <select id="bearer" name="bearer" [(ngModel)]="bearer">
                <option value="landlord">Landlord</option>
                <option value="tenant">Tenant</option>
              </select>
            </div>
            <div class="actions-row">
              <button class="btn btn-primary" (click)="resolve()">Save &amp; resolve</button>
            </div>
          }
        } @else {
          <div class="notice notice-success" style="margin-bottom:0;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
            <span>This ticket is resolved.</span>
          </div>
        }
      </div>
    }
  `,
})
export class LandlordTicketDetailComponent {
  private readonly data = inject(MockDataService);
  private readonly router = inject(Router);
  private readonly ticketId = inject(ActivatedRoute).snapshot.paramMap.get('ticketId')!;

  readonly asking = signal(false);
  readonly costingForm = signal(false);
  readonly ticket = computed(() => this.data.tickets().find((t) => t.id === this.ticketId));

  amount = 0;
  bearer: ExpenseRecord['bearer'] = 'landlord';

  unitLabel(): string {
    const u = this.data.units().find((unit) => unit.id === this.ticket()?.unitId);
    return u?.unitNumber ?? '—';
  }

  tenantName(): string {
    const t = this.data.tenants().find((tenant) => tenant.id === this.ticket()?.tenantId);
    return t?.name ?? '—';
  }

  askCost(): void {
    this.asking.set(true);
  }

  resolve(): void {
    this.data.tickets.update((list) => list.map((t) => (t.id === this.ticketId ? { ...t, status: 'resolved' } : t)));

    if (this.costingForm() && this.amount > 0) {
      const t = this.ticket();
      const propertyId = this.data.units().find((u) => u.id === t?.unitId)?.propertyId ?? '';
      this.data.expenses.update((list) => [
        ...list,
        {
          id: nextId('exp'),
          propertyId,
          category: 'Maintenance',
          description: t?.description ?? '',
          amount: this.amount,
          bearer: this.bearer,
          tenantId: t?.tenantId,
          date: new Date().toISOString().slice(0, 10),
        },
      ]);
    }
    this.router.navigateByUrl('/landlord/maintenance');
  }
}
