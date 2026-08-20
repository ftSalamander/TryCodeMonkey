import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MockDataService } from '../../../core/mock-data.service';

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    @if (request()) {
      <h1>Request — {{ request()!.applicantName }}</h1>
      <div class="card form-card">
        <div class="kv-list">
          <div class="kv">
            <span class="kv-label">Unit requested</span>
            <span class="kv-value">{{ unitLabel() }}</span>
          </div>
          <div class="kv">
            <span class="kv-label">Status</span>
            <span class="badge"
                  [class.badge-pending]="request()!.status === 'pending'"
                  [class.badge-approved]="request()!.status === 'approved'"
                  [class.badge-rejected]="request()!.status === 'rejected'">{{ request()!.status }}</span>
          </div>
        </div>
        @if (request()!.tenantId) {
          <a [routerLink]="['/landlord/tenants', request()!.tenantId]">View tenant profile</a>
        }
      </div>

      <div class="card form-card">
        <h3>Chat with applicant (optional)</h3>
        <div class="field">
          <textarea rows="3" name="chat" [(ngModel)]="chatMessage" placeholder="Write a message..."></textarea>
        </div>
        <button class="btn btn-sm">Send</button>
      </div>

      @if (request()!.status === 'pending') {
        <div class="actions-row">
          <button class="btn btn-primary" (click)="decide('approved')">Approve, notify applicant</button>
          <button class="btn btn-danger" (click)="decide('rejected')">Reject, notify applicant</button>
        </div>
      }
    }
  `,
})
export class RequestDetailComponent {
  private readonly data = inject(MockDataService);
  private readonly router = inject(Router);
  private readonly requestId = inject(ActivatedRoute).snapshot.paramMap.get('requestId')!;

  chatMessage = '';
  readonly request = computed(() => this.data.marketplaceRequests().find((r) => r.id === this.requestId));

  unitLabel(): string {
    return this.data.units().find((u) => u.id === this.request()?.unitId)?.unitNumber ?? '—';
  }

  decide(status: 'approved' | 'rejected'): void {
    this.data.marketplaceRequests.update((list) => list.map((r) => (r.id === this.requestId ? { ...r, status } : r)));
    this.router.navigateByUrl('/landlord/marketplace/requests');
  }
}
