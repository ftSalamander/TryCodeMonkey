import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../../core/mock-data.service';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Booking requests (synced from BariVara)</h1>
    <div class="card">
      <div class="table-scroll">
      <table>
        <thead><tr><th>Applicant</th><th>Unit</th><th>Status</th><th></th></tr></thead>
        <tbody>
          @for (r of data.marketplaceRequests(); track r.id) {
            <tr>
              <td><strong>{{ r.applicantName }}</strong></td>
              <td>{{ unitLabel(r.unitId) }}</td>
              <td><span class="badge"
                        [class.badge-pending]="r.status === 'pending'"
                        [class.badge-approved]="r.status === 'approved'"
                        [class.badge-rejected]="r.status === 'rejected'">{{ r.status }}</span></td>
              <td>
                <div class="table-cell-actions">
                  <a class="btn btn-sm" [routerLink]="['/landlord/marketplace/requests', r.id]">Open</a>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="4">
                <div class="empty-state">
                  <span class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
                  </span>
                  <p>No booking requests yet.</p>
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
export class RequestListComponent {
  protected readonly data = inject(MockDataService);

  unitLabel(unitId: string): string {
    return this.data.units().find((u) => u.id === unitId)?.unitNumber ?? '—';
  }
}
