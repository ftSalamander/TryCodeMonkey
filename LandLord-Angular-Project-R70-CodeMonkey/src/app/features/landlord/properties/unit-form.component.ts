import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDataService, PropertyType, Unit, UtilityItem, nextId } from '../../../core/mock-data.service';

@Component({
  selector: 'app-unit-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1>{{ editing ? 'Edit unit' : 'Add unit' }}</h1>
    <div class="card form-card">
      <div class="field">
        <label for="unitNumber">Unit number</label>
        <input id="unitNumber" name="unitNumber" [(ngModel)]="unitNumber" placeholder="e.g. A-201" required />
      </div>
      <div class="form-row">
        <div class="field">
          <label for="propertyType">Property type</label>
          <select id="propertyType" name="propertyType" [(ngModel)]="propertyType">
            <option value="apartment">Flat / Apartment</option>
            <option value="room">Room / Sublet</option>
            <option value="office">Office Space</option>
          </select>
        </div>
        <div class="field">
          <label for="status">Status</label>
          <select id="status" name="status" [(ngModel)]="status">
            <option value="vacant">Vacant</option>
            <option value="occupied">Occupied</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label for="rent">Rent</label>
        <input id="rent" type="number" name="rent" [(ngModel)]="rent" placeholder="Monthly rent in BDT" required />
      </div>

      <div class="field">
        <label>Utility charges (optional — this unit's usual monthly amounts)</label>
        <p class="hint-text" style="margin-top:-0.2rem;">
          Skip electricity here if this unit has a prepaid meter — the tenant recharges it directly, it's not your bill.
        </p>
        <div class="stack">
          @for (item of utilityItems; track item.id; let i = $index) {
            <div class="form-row">
              <input [(ngModel)]="item.label" [name]="'utilLabel' + i" placeholder="e.g. Water" />
              <input type="number" [(ngModel)]="item.defaultAmount" [name]="'utilAmount' + i" placeholder="Amount" style="max-width:140px;" />
              <button type="button" class="btn btn-sm btn-danger" (click)="removeUtility(i)">Remove</button>
            </div>
          }
        </div>
        <div class="actions-row" style="margin-top:0.5rem;">
          <button type="button" class="btn btn-sm" (click)="addUtility('Water')">+ Water</button>
          <button type="button" class="btn btn-sm" (click)="addUtility('Gas')">+ Gas</button>
          <button type="button" class="btn btn-sm" (click)="addUtility('Service Charge')">+ Service Charge</button>
          <button type="button" class="btn btn-sm" (click)="addUtility('Electricity')">+ Electricity</button>
          <button type="button" class="btn btn-sm" (click)="addUtility('')">+ Custom</button>
        </div>
      </div>

      <div class="actions-row">
        <button class="btn btn-primary" (click)="save()">Save unit</button>
      </div>
      @if (posted()) {
        <div class="notice notice-success" style="margin-top:0.9rem;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
          <span>Vacant unit — ad auto-posted to BariVara.com.</span>
        </div>
      }
    </div>
  `,
})
export class UnitFormComponent {
  private readonly data = inject(MockDataService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly propertyId = this.route.snapshot.paramMap.get('propertyId')!;
  private readonly unitId = this.route.snapshot.paramMap.get('unitId');
  readonly editing = !!this.unitId;
  readonly posted = signal(false);

  unitNumber = '';
  propertyType: PropertyType = 'apartment';
  rent: number | null = null;
  status: Unit['status'] = 'vacant';
  utilityItems: UtilityItem[] = [];

  constructor() {
    if (this.unitId) {
      const unit = this.data.units().find((u) => u.id === this.unitId);
      if (unit) {
        this.unitNumber = unit.unitNumber;
        this.propertyType = unit.propertyType;
        this.rent = unit.rent;
        this.status = unit.status;
        this.utilityItems = unit.utilityItems.map((u) => ({ ...u }));
      }
    }
  }

  addUtility(label: string): void {
    this.utilityItems = [...this.utilityItems, { id: nextId('util'), label, defaultAmount: 0 }];
  }

  removeUtility(index: number): void {
    this.utilityItems = this.utilityItems.filter((_, i) => i !== index);
  }

  save(): void {
    if (!this.unitNumber || this.rent == null) return;
    const utilityItems = this.utilityItems.filter((u) => u.label.trim());

    if (this.editing) {
      this.data.units.update((list) =>
        list.map((u) =>
          u.id === this.unitId
            ? { ...u, unitNumber: this.unitNumber, propertyType: this.propertyType, rent: this.rent!, status: this.status, utilityItems }
            : u
        )
      );
    } else {
      this.data.units.update((list) => [
        ...list,
        { id: nextId('u'), propertyId: this.propertyId, unitNumber: this.unitNumber, propertyType: this.propertyType, rent: this.rent!, status: this.status, utilityItems },
      ]);
    }

    if (this.status === 'vacant') {
      this.posted.set(true);
      setTimeout(() => this.router.navigate(['/landlord/properties', this.propertyId, 'units']), 800);
    } else {
      this.router.navigate(['/landlord/properties', this.propertyId, 'units']);
    }
  }
}
