import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../../core/mock-data.service';

@Component({
  selector: 'app-rental-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Rental Agreements</h1>
    <div class="card">
      <div class="table-scroll">
      <table>
        <thead><tr><th>Tenant</th><th>Unit</th><th>Start date</th><th>Deposit</th><th></th></tr></thead>
        <tbody>
          @for (a of data.agreements(); track a.id) {
            <tr>
              <td><strong>{{ tenantName(a.tenantId) }}</strong></td>
              <td>{{ unitLabel(a.unitId) }}</td>
              <td>{{ a.startDate }}</td>
              <td class="tnum">৳{{ a.deposit }}</td>
              <td>
                <div class="table-cell-actions">
                  <a class="btn btn-sm" [routerLink]="['/landlord/rentals', a.id]">View</a>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5">
                <div class="empty-state">
                  <span class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
                  </span>
                  <p>No rental agreements yet.</p>
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
export class RentalListComponent {
  protected readonly data = inject(MockDataService);

  tenantName(tenantId: string): string {
    return this.data.tenants().find((t) => t.id === tenantId)?.name ?? '—';
  }
  unitLabel(unitId: string): string {
    return this.data.units().find((u) => u.id === unitId)?.unitNumber ?? '—';
  }
}
