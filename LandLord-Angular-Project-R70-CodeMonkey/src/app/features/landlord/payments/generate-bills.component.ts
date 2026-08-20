import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvoiceUtilityLine, MockDataService, periodLabel } from '../../../core/mock-data.service';

@Component({
  selector: 'app-generate-bills',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1>Monthly Bills</h1>
    <div class="card">
      <div class="form-row" style="align-items:flex-end;">
        <div class="field" style="max-width:280px;margin-bottom:0;">
          <label for="period">Month</label>
          <select id="period" name="period" [ngModel]="selectedPeriod()" (ngModelChange)="selectedPeriod.set($event)">
            @for (p of data.knownPeriods(); track p) {
              <option [value]="p">{{ label(p) }}</option>
            }
          </select>
        </div>
        @if (selectedPeriod() === data.currentPeriod()) {
          <button class="btn btn-primary" (click)="generate()">Generate bills for this month</button>
        }
      </div>

      @if (selectedPeriod() === data.currentPeriod()) {
        <div class="notice notice-info" style="margin-top:0.9rem;margin-bottom:0;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          <span>
            Bills for the current month are generated automatically. Use this to pick up any tenant who
            became active after the month started.
          </span>
        </div>
      } @else {
        <div class="notice notice-info" style="margin-top:0.9rem;margin-bottom:0;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          <span>Past months are read-only history.</span>
        </div>
      }
    </div>

    <div class="card">
      <div class="table-scroll">
      <table>
        <thead>
          <tr><th>Tenant</th><th>Rent</th><th>Utilities</th><th>Rolled over</th><th>Total due</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          @for (i of rows(); track i.id) {
            <tr>
              <td><strong>{{ tenantName(i.tenantId) }}</strong></td>
              <td class="tnum">৳{{ i.rent }}</td>
              <td>
                @if (editingId() === i.id) {
                  <div class="stack">
                    @for (item of draftItems; track $index; let idx = $index) {
                      <div class="form-row">
                        <input [(ngModel)]="item.label" [name]="'draftLabel' + idx" placeholder="Label" />
                        <input type="number" [(ngModel)]="item.amount" [name]="'draftAmount' + idx" style="max-width:110px;" />
                        <button type="button" class="btn btn-sm btn-danger" (click)="removeDraftItem(idx)">Remove</button>
                      </div>
                    }
                  </div>
                  <button type="button" class="btn btn-sm" style="margin-top:0.4rem;" (click)="addDraftItem()">+ Add charge</button>
                } @else {
                  @if (i.utilityItems.length) {
                    <span class="tnum" [title]="utilityBreakdown(i)">৳{{ data.invoiceUtilitiesTotal(i) }}</span>
                  } @else {
                    <span class="hint-text">—</span>
                  }
                }
              </td>
              <td class="tnum">৳{{ i.prevUnpaidRolled }}</td>
              <td class="tnum">
                @if (i.status === 'partial') {
                  <strong>৳{{ i.balance }}/৳{{ i.amount }}</strong>
                } @else {
                  <strong>৳{{ i.balance }}</strong>
                }
              </td>
              <td><span class="badge" [class.badge-unpaid]="i.status === 'unpaid'" [class.badge-partial]="i.status === 'partial'" [class.badge-paid]="i.status === 'paid'">{{ i.status }}</span></td>
              <td>
                @if (i.status === 'unpaid') {
                  <div class="table-cell-actions">
                    @if (editingId() === i.id) {
                      <button class="btn btn-sm btn-primary" (click)="saveEdit(i.id)">Save</button>
                      <button class="btn btn-sm" (click)="cancelEdit()">Cancel</button>
                    } @else {
                      <button class="btn btn-sm" (click)="startEdit(i)">Edit utilities</button>
                    }
                  </div>
                }
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="7">
                <div class="empty-state">
                  <span class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                  </span>
                  <p>No bills for this month yet.</p>
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
export class GenerateBillsComponent {
  protected readonly data = inject(MockDataService);

  readonly selectedPeriod = signal(this.data.currentPeriod());
  readonly rows = computed(() => this.data.invoicesForPeriod(this.selectedPeriod()));

  readonly editingId = signal('');
  draftItems: InvoiceUtilityLine[] = [];

  constructor() {
    // Frontend stand-in for the monthly cron job (Part 2): make sure the
    // current month is never empty just because nobody clicked "generate".
    this.data.ensureBillsGenerated(this.data.currentPeriod());
  }

  label(period: string): string {
    return periodLabel(period);
  }

  tenantName(tenantId: string): string {
    return this.data.tenants().find((t) => t.id === tenantId)?.name ?? '—';
  }

  utilityBreakdown(invoice: { utilityItems: InvoiceUtilityLine[] }): string {
    return invoice.utilityItems.map((u) => `${u.label}: ${u.amount}`).join(', ');
  }

  generate(): void {
    this.data.ensureBillsGenerated(this.selectedPeriod());
  }

  startEdit(invoice: { id: string; utilityItems: InvoiceUtilityLine[] }): void {
    this.editingId.set(invoice.id);
    this.draftItems = invoice.utilityItems.map((u) => ({ ...u }));
  }

  cancelEdit(): void {
    this.editingId.set('');
    this.draftItems = [];
  }

  addDraftItem(): void {
    this.draftItems = [...this.draftItems, { label: '', amount: 0 }];
  }

  removeDraftItem(index: number): void {
    this.draftItems = this.draftItems.filter((_, i) => i !== index);
  }

  saveEdit(invoiceId: string): void {
    const items = this.draftItems.filter((u) => u.label.trim());
    this.data.updateInvoiceUtilities(invoiceId, items);
    this.cancelEdit();
  }
}
