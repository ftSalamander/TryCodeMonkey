import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MockDataService, TenantRecord } from '../../../core/mock-data.service';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="page-head">
      <h1>Tenant Management</h1>
      <a class="btn btn-primary" routerLink="/landlord/tenants/register">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><path d="M12 5v14M5 12h14"/></svg>
        Register tenant (walk-in)
      </a>
    </div>

    <div class="search-bar" style="margin-bottom:1rem;">
      <input
        [ngModel]="query()"
        (ngModelChange)="query.set($event)"
        name="query"
        placeholder="Search by name, National ID, or phone"
      />
      <select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)" name="statusFilter" style="max-width:160px;">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="all">All</option>
      </select>
    </div>

    <div class="summary-strip">
      <div class="summary-chip">
        <span class="chip-value">{{ activeCount() }}</span>
        <span class="chip-label">Active tenants</span>
      </div>
      <div class="summary-chip">
        <span class="chip-value">{{ data.tenants().length }}</span>
        <span class="chip-label">Total</span>
      </div>
    </div>

    <div class="card">
      <div class="table-scroll">
      <table>
        <thead>
          <tr><th>Name</th><th>National ID</th><th>Phone</th><th>Unit</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          @for (t of filteredTenants(); track t.id) {
            <tr>
              <td>
                <span class="thumb-avatar blue" style="width:30px;height:30px;font-size:0.7rem;border-radius:9px;vertical-align:middle;margin-right:0.5rem;">{{ initials(t.name) }}</span>
                <strong>{{ t.name }}</strong>
              </td>
              <td class="tnum">{{ t.nationalId }}</td>
              <td class="tnum">{{ t.phone }}</td>
              <td>{{ unitLabel(t.unitId) }}</td>
              <td><span class="badge" [class.badge-active]="t.status === 'active'" [class.badge-inactive]="t.status === 'inactive'">{{ t.status }}</span></td>
              <td>
                <div class="table-cell-actions">
                  <a class="btn btn-sm" [routerLink]="['/landlord/tenants', t.id]">View</a>
                  @if (t.status === 'active') {
                    <a class="btn btn-sm btn-danger" [routerLink]="['/landlord/tenants', t.id, 'move-out']">Move out</a>
                  }
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="6">
                <div class="empty-state">
                  <span class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  </span>
                  <p>No tenants match.</p>
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
export class TenantListComponent {
  protected readonly data = inject(MockDataService);

  readonly query = signal('');
  readonly statusFilter = signal<'active' | 'inactive' | 'all'>('active');

  readonly filteredTenants = computed(() => {
    const q = this.query().trim().toLowerCase();
    const status = this.statusFilter();

    return this.data.tenants().filter((t: TenantRecord) => {
      const matchesStatus = status === 'all' || t.status === status;
      const matchesQuery =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.nationalId.toLowerCase().includes(q) ||
        t.phone.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  });

  activeCount(): number {
    return this.data.tenants().filter((t) => t.status === 'active').length;
  }

  initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  unitLabel(unitId?: string): string {
    return this.data.units().find((u) => u.id === unitId)?.unitNumber ?? '—';
  }
}
