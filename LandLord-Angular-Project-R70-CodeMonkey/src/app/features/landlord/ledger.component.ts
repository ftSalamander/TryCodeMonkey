import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MockDataService, periodKey } from '../../core/mock-data.service';

function firstOfMonth(): string {
  const [year, month] = periodKey().split('-');
  return `${year}-${month}-01`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'app-ledger',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1>Ledger</h1>

    <div class="card">
      <div class="form-row">
        <div class="field">
          <label for="property">Property</label>
          <select id="property" name="property" [ngModel]="propertyFilter()" (ngModelChange)="propertyFilter.set($event)">
            <option value="">All properties</option>
            @for (p of data.properties(); track p.id) {
              <option [value]="p.id">{{ p.name }}</option>
            }
          </select>
        </div>
        <div class="field">
          <label for="from">From</label>
          <input id="from" type="date" name="from" [ngModel]="fromDate()" (ngModelChange)="fromDate.set($event)" />
        </div>
        <div class="field">
          <label for="to">To</label>
          <input id="to" type="date" name="to" [ngModel]="toDate()" (ngModelChange)="toDate.set($event)" />
        </div>
      </div>
    </div>

    <div class="summary-strip">
      <div class="summary-chip">
        <span class="chip-value" style="color:var(--success);">+৳{{ totalIn() }}</span>
        <span class="chip-label">Total in</span>
      </div>
      <div class="summary-chip">
        <span class="chip-value" style="color:var(--danger);">-৳{{ totalOut() }}</span>
        <span class="chip-label">Total out</span>
      </div>
      <div class="summary-chip">
        <span class="chip-value">৳{{ net() }}</span>
        <span class="chip-label">Net</span>
      </div>
    </div>

    <div class="card">
      <div class="table-scroll">
      <table>
        <thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Amount</th><th>Balance</th></tr></thead>
        <tbody>
          @for (row of visibleRows(); track row.id) {
            <tr>
              <td>{{ row.date }}</td>
              <td><span class="badge" [class.badge-paid]="row.type === 'income'" [class.badge-unpaid]="row.type === 'expense'">{{ row.type }}</span></td>
              <td>{{ row.description }}</td>
              <td class="tnum" [class.amount-in]="row.type === 'income'" [class.amount-out]="row.type === 'expense'">
                {{ row.type === 'income' ? '+' : '-' }}৳{{ row.amount }}
              </td>
              <td class="tnum">৳{{ row.balance }}</td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5">
                <div class="empty-state">
                  <span class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </span>
                  <p>No transactions in this range.</p>
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
export class LedgerComponent {
  protected readonly data = inject(MockDataService);

  readonly propertyFilter = signal('');
  readonly fromDate = signal(firstOfMonth());
  readonly toDate = signal(today());

  /** Cumulative balance computed over the property-filtered ledger, oldest first,
   *  before the date range narrows what's displayed — so narrowing the date filter
   *  doesn't make the running balance reset to zero. */
  private readonly withBalance = computed(() => {
    let balance = 0;
    return this.data.ledgerEntries(this.propertyFilter() || undefined).map((entry) => {
      balance += entry.type === 'income' ? entry.amount : -entry.amount;
      return { ...entry, balance };
    });
  });

  readonly visibleRows = computed(() =>
    this.withBalance().filter((row) => row.date >= this.fromDate() && row.date <= this.toDate())
  );

  readonly totalIn = computed(() =>
    this.visibleRows()
      .filter((r) => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0)
  );

  readonly totalOut = computed(() =>
    this.visibleRows()
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0)
  );

  readonly net = computed(() => this.totalIn() - this.totalOut());
}
