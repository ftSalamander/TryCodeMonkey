import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CURRENT_TENANT_ID, MockDataService } from '../../core/mock-data.service';

@Component({
  selector: 'app-tenant-profile',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1>My Profile</h1>

    @if (tenant()) {
      <div class="card form-card">
        <div style="display:flex;align-items:center;gap:0.9rem;margin-bottom:1.1rem;">
          <span class="avatar" style="width:48px;height:48px;font-size:1rem;">{{ initials(tenant()!.name) }}</span>
          <div>
            <strong style="font-size:1.05rem;">{{ tenant()!.name }}</strong>
            <span class="badge badge-active" style="margin-left:0.5rem;">active</span>
          </div>
        </div>

        @if (!editing()) {
          <div class="kv-list">
            <div class="kv">
              <span class="kv-label">Name</span>
              <span class="kv-value">{{ tenant()!.name }}</span>
            </div>
            <div class="kv">
              <span class="kv-label">Phone</span>
              <span class="kv-value tnum">{{ tenant()!.phone }}</span>
            </div>
            <div class="kv">
              <span class="kv-label">Email</span>
              <span class="kv-value">{{ tenant()!.email }}</span>
            </div>
          </div>
          <button class="btn btn-primary" (click)="edit()" style="margin-top:0.4rem;">Edit info</button>
        } @else {
          <div class="field">
            <label for="name">Name</label>
            <input id="name" name="name" [(ngModel)]="name" required />
          </div>
          <div class="field">
            <label for="phone">Phone</label>
            <input id="phone" name="phone" [(ngModel)]="phone" required />
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" name="email" [(ngModel)]="email" required />
          </div>
          @if (error()) {
            <p class="error-text">{{ error() }}</p>
          }
          <div class="actions-row">
            <button class="btn btn-primary" (click)="save()">Save changes</button>
            <button class="btn" (click)="editing.set(false)">Cancel</button>
          </div>
        }
      </div>
    }
  `,
})
export class TenantProfileComponent {
  private readonly data = inject(MockDataService);

  readonly editing = signal(false);
  readonly error = signal('');
  name = '';
  phone = '';
  email = '';

  tenant() {
    return this.data.tenants().find((t) => t.id === CURRENT_TENANT_ID);
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

  edit(): void {
    const t = this.tenant();
    if (!t) return;
    this.name = t.name;
    this.phone = t.phone;
    this.email = t.email;
    this.editing.set(true);
  }

  save(): void {
    if (!this.name || !this.email) {
      this.error.set('Name and email are required.');
      return;
    }
    this.error.set('');
    this.data.tenants.update((list) =>
      list.map((t) => (t.id === CURRENT_TENANT_ID ? { ...t, name: this.name, phone: this.phone, email: this.email } : t))
    );
    this.editing.set(false);
  }
}
