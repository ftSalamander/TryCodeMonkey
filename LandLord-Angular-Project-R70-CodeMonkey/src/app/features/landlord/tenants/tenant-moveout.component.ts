import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDataService } from '../../../core/mock-data.service';

@Component({
  selector: 'app-tenant-moveout',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (tenant()) {
      <h1>Move out — {{ tenant()!.name }}</h1>

      <div class="card stack form-card">
        <div class="notice notice-warning">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>
          <span><strong>Outstanding balance:</strong> ৳{{ outstandingBalance() }}</span>
        </div>

        <div class="field">
          <label for="deductions">Damage deductions</label>
          <input id="deductions" type="number" name="deductions" [(ngModel)]="deductions" placeholder="BDT" />
        </div>

        <div class="field">
          <label for="mode">Refund or final bill?</label>
          <div class="seg" style="width:100%;">
            <button type="button" [class.active]="mode === 'refund'" (click)="mode = 'refund'">Refund</button>
            <button type="button" [class.active]="mode === 'bill'" (click)="mode = 'bill'">Final bill</button>
          </div>
        </div>

        <div class="summary-strip" style="margin-bottom:0.4rem;">
          <div class="summary-chip">
            <span class="chip-value">{{ resultLabel() }}</span>
            <span class="chip-label">৳{{ resultAmount() }}</span>
          </div>
        </div>

        <div class="actions-row">
          <button class="btn btn-danger" (click)="process()">Process move-out</button>
        </div>

        @if (done()) {
          <div class="notice notice-success" style="margin-bottom:0;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
            <span>Unit set vacant, ad auto-posted to BariVara, tenant archived.</span>
          </div>
        }
      </div>
    }
  `,
})
export class TenantMoveoutComponent {
  private readonly data = inject(MockDataService);
  private readonly router = inject(Router);
  private readonly tenantId = inject(ActivatedRoute).snapshot.paramMap.get('tenantId')!;

  deductions = 0;
  mode: 'refund' | 'bill' = 'refund';
  readonly done = signal(false);

  readonly tenant = computed(() => this.data.tenants().find((t) => t.id === this.tenantId));
  readonly agreement = computed(() => this.data.agreements().find((a) => a.tenantId === this.tenantId));

  outstandingBalance(): number {
    return this.data
      .invoices()
      .filter((i) => i.tenantId === this.tenantId)
      .reduce((sum, i) => sum + i.balance, 0);
  }

  resultLabel(): string {
    return this.mode === 'refund' ? 'Calculated refund' : 'Final invoice';
  }

  resultAmount(): number {
    const deposit = this.agreement()?.deposit ?? 0;
    return this.mode === 'refund' ? Math.max(0, deposit - this.deductions) : this.outstandingBalance() + this.deductions;
  }

  process(): void {
    const t = this.tenant();
    if (!t) return;

    this.data.units.update((list) => list.map((u) => (u.id === t.unitId ? { ...u, status: 'vacant' } : u)));
    this.data.tenants.update((list) => list.map((x) => (x.id === t.id ? { ...x, status: 'inactive', unitId: undefined } : x)));
    this.done.set(true);
    setTimeout(() => this.router.navigateByUrl('/landlord/tenants'), 900);
  }
}
