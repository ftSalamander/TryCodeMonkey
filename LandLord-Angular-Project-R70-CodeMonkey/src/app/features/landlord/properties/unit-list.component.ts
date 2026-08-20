import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MockDataService } from '../../../core/mock-data.service';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="page-head">
      <h1>{{ propertyName() }} <span class="hint-text" style="font-size:0.85rem;">— units</span></h1>
      <a class="btn btn-primary" [routerLink]="['/landlord/properties', propertyId, 'units', 'new']">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><path d="M12 5v14M5 12h14"/></svg>
        Add unit
      </a>
    </div>

    <div class="summary-strip">
      <div class="summary-chip">
        <span class="chip-value">{{ units().length }}</span>
        <span class="chip-label">Units</span>
      </div>
      <div class="summary-chip">
        <span class="chip-value" style="color:var(--success);">{{ vacantCount() }}</span>
        <span class="chip-label">Vacant</span>
      </div>
      <div class="summary-chip">
        <span class="chip-value">{{ occupiedCount() }}</span>
        <span class="chip-label">Occupied</span>
      </div>
      <div class="summary-chip">
        <span class="chip-value">৳{{ totalRent() }}</span>
        <span class="chip-label">Monthly rent (all units)</span>
      </div>
    </div>

    <div class="card">
      <div class="table-scroll">
      <table>
        <thead>
          <tr><th>Unit</th><th>Type</th><th>Rent</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          @for (u of units(); track u.id) {
            <tr>
              <td><strong>{{ u.unitNumber }}</strong></td>
              <td>{{ typeLabel(u.propertyType) }}</td>
              <td class="tnum">৳{{ u.rent }}</td>
              <td><span class="badge" [class.badge-vacant]="u.status === 'vacant'" [class.badge-occupied]="u.status === 'occupied'">{{ u.status }}</span></td>
              <td>
                <div class="table-cell-actions">
                  <a class="btn btn-sm" [routerLink]="['/landlord/properties', propertyId, 'units', u.id, 'edit']">Edit</a>
                </div>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5">
                <div class="empty-state">
                  <span class="empty-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-4h6v4"/><path d="M8 7h.01M12 7h.01M16 7h.01"/></svg>
                  </span>
                  <p>No units here yet.</p>
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
export class UnitListComponent {
  protected readonly data = inject(MockDataService);
  protected readonly propertyId = inject(ActivatedRoute).snapshot.paramMap.get('propertyId')!;

  propertyName(): string {
    return this.data.properties().find((p) => p.id === this.propertyId)?.name ?? 'Property';
  }

  units() {
    return this.data.unitsByProperty(this.propertyId);
  }

  vacantCount(): number {
    return this.units().filter((u) => u.status === 'vacant').length;
  }

  occupiedCount(): number {
    return this.units().filter((u) => u.status === 'occupied').length;
  }

  totalRent(): number {
    return this.units().reduce((sum, u) => sum + u.rent, 0);
  }

  typeLabel(type: string): string {
    if (type === 'apartment') return 'Flat / Apartment';
    if (type === 'room') return 'Room / Sublet';
    return 'Office Space';
  }
}
