import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDataService } from '../../../core/mock-data.service';

@Component({
  selector: 'app-rental-detail',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (agreement()) {
      <h1>Rental agreement</h1>
      <div class="card form-card">
        @if (!editing()) {
          <div class="kv-list" style="margin-bottom:1.2rem;">
            <div class="kv">
              <span class="kv-label">Terms</span>
              <span class="kv-value">{{ agreement()!.terms }}</span>
            </div>
            <div class="kv">
              <span class="kv-label">Deposit</span>
              <span class="kv-value">৳{{ agreement()!.deposit }}</span>
            </div>
            <div class="kv">
              <span class="kv-label">Start date</span>
              <span class="kv-value">{{ agreement()!.startDate }}</span>
            </div>
          </div>
          <button class="btn btn-primary" (click)="editing.set(true)">Edit / update terms</button>
        } @else {
          <div class="field">
            <label for="terms">Terms</label>
            <input id="terms" name="terms" [(ngModel)]="termsDraft" />
          </div>
          <div class="field">
            <label for="deposit">Deposit</label>
            <input id="deposit" type="number" name="deposit" [(ngModel)]="depositDraft" />
          </div>
          <div class="actions-row">
            <button class="btn btn-primary" (click)="save()">Save changes</button>
            <button class="btn" (click)="editing.set(false)">Cancel</button>
          </div>
        }
      </div>
    }
  `,
})
export class RentalDetailComponent {
  private readonly data = inject(MockDataService);
  private readonly agreementId = inject(ActivatedRoute).snapshot.paramMap.get('agreementId')!;

  readonly editing = signal(false);
  readonly agreement = computed(() => this.data.agreements().find((a) => a.id === this.agreementId));

  termsDraft = '';
  depositDraft = 0;

  constructor() {
    const a = this.agreement();
    if (a) {
      this.termsDraft = a.terms;
      this.depositDraft = a.deposit;
    }
  }

  save(): void {
    this.data.agreements.update((list) =>
      list.map((a) => (a.id === this.agreementId ? { ...a, terms: this.termsDraft, deposit: this.depositDraft } : a))
    );
    this.editing.set(false);
  }
}
