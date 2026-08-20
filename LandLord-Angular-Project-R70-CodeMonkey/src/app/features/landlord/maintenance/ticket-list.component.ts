import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../../core/mock-data.service';

@Component({
  selector: 'app-landlord-ticket-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-head">
      <h1>Maintenance</h1>
      <a class="btn btn-primary" routerLink="/landlord/maintenance/new">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><path d="M12 5v14M5 12h14"/></svg>
        Log new issue
      </a>
    </div>

    <div class="summary-strip">
      <div class="summary-chip">
        <span class="chip-value" style="color:var(--warning);">{{ pendingCount() }}</span>
        <span class="chip-label">Pending</span>
      </div>
      <div class="summary-chip">
        <span class="chip-value" style="color:var(--success);">{{ resolvedCount() }}</span>
        <span class="chip-label">Resolved</span>
      </div>
    </div>

    <div class="card">
      <div class="table-scroll">
      <table>
        <thead><tr><th>Unit</th><th>Tenant</th><th>Description</th><th>Status</th><th></th></tr></thead>
        <tbody>
          @for (t of data.tickets(); track t.id) {
            <tr>
              <td><strong>{{ unitLabel(t.unitId) }}</strong></td>
              <td>{{ tenantName(t.tenantId) }}</td>
              <td>{{ t.description }}</td>
              <td><span class="badge" [class.badge-pending]="t.status === 'pending'" [class.badge-resolved]="t.status === 'resolved'">{{ t.status }}</span></td>
              <td>
                <div class="table-cell-actions">
                  <a class="btn btn-sm" [routerLink]="['/landlord/maintenance', t.id]">Open</a>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5">
                <div class="empty-state">
                  <span class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                  </span>
                  <p>No maintenance tickets yet.</p>
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
export class LandlordTicketListComponent {
  protected readonly data = inject(MockDataService);

  pendingCount(): number {
    return this.data.tickets().filter((t) => t.status === 'pending').length;
  }

  resolvedCount(): number {
    return this.data.tickets().filter((t) => t.status === 'resolved').length;
  }

  unitLabel(unitId: string): string {
    return this.data.units().find((u) => u.id === unitId)?.unitNumber ?? '—';
  }
  tenantName(tenantId: string): string {
    return this.data.tenants().find((t) => t.id === tenantId)?.name ?? '—';
  }
}
