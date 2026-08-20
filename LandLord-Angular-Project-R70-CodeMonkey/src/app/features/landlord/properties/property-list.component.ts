import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../../core/mock-data.service';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-head">
      <h1>Property &amp; Units</h1>
      <a class="btn btn-primary" routerLink="/landlord/properties/new">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><path d="M12 5v14M5 12h14"/></svg>
        Add property
      </a>
    </div>

    <div class="summary-strip">
      <div class="summary-chip">
        <span class="chip-value">{{ data.properties().length }}</span>
        <span class="chip-label">Properties</span>
      </div>
      <div class="summary-chip">
        <span class="chip-value">{{ totalUnits() }}</span>
        <span class="chip-label">Units</span>
      </div>
      <div class="summary-chip">
        <span class="chip-value" style="color:var(--success);">{{ vacantUnits() }}</span>
        <span class="chip-label">Vacant</span>
      </div>
      <div class="summary-chip">
        <span class="chip-value">{{ occupiedUnits() }}</span>
        <span class="chip-label">Occupied</span>
      </div>
    </div>

    <div class="card">
      <div class="table-scroll">
      <table>
        <thead>
          <tr><th>Property</th><th>Address</th><th>Units</th><th>Vacant</th><th></th></tr>
        </thead>
        <tbody>
          @for (p of data.properties(); track p.id) {
            <tr>
              <td><strong>{{ p.name }}</strong></td>
              <td>{{ p.address }}</td>
              <td>{{ unitsFor(p.id).length }}</td>
              <td><span class="badge" [class.badge-vacant]="vacantFor(p.id) > 0" [class.badge-inactive]="vacantFor(p.id) === 0">{{ vacantFor(p.id) }}</span></td>
              <td>
                <div class="table-cell-actions">
                  <a class="btn btn-sm" [routerLink]="['/landlord/properties', p.id, 'units']">Manage units</a>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5">
                <div class="empty-state">
                  <span class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-4h6v4"/></svg>
                  </span>
                  <p>No properties yet. Add your first one to get started.</p>
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
export class PropertyListComponent {
  protected readonly data = inject(MockDataService);

  totalUnits(): number {
    return this.data.units().length;
  }

  vacantUnits(): number {
    return this.data.units().filter((u) => u.status === 'vacant').length;
  }

  occupiedUnits(): number {
    return this.data.units().filter((u) => u.status === 'occupied').length;
  }

  unitsFor(propertyId: string) {
    return this.data.unitsByProperty(propertyId);
  }

  vacantFor(propertyId: string): number {
    return this.data.unitsByProperty(propertyId).filter((u) => u.status === 'vacant').length;
  }
}
