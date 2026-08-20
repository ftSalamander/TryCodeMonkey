import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MockDataService, nextId } from '../../../core/mock-data.service';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1>Add property</h1>
    <div class="card form-card">
      <div class="field">
        <label for="name">Property name</label>
        <input id="name" name="name" [(ngModel)]="name" placeholder="e.g. Greenview Tower" required />
      </div>
      <div class="field">
        <label for="address">Address</label>
        <input id="address" name="address" [(ngModel)]="address" placeholder="e.g. 12/A Dhanmondi, Dhaka" required />
      </div>
      <div class="actions-row">
        <button class="btn btn-primary" (click)="save()">Save property</button>
      </div>
      <p class="hint-text" style="margin:0.5rem 0 0;">After saving you can add units, register tenants, and bills will track against this property.</p>
    </div>
  `,
})
export class PropertyFormComponent {
  private readonly data = inject(MockDataService);
  private readonly router = inject(Router);

  name = '';
  address = '';

  save(): void {
    if (!this.name || !this.address) return;
    this.data.properties.update((list) => [...list, { id: nextId('p'), name: this.name, address: this.address }]);
    this.router.navigateByUrl('/landlord/properties');
  }
}
