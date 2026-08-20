import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="public-content">
      <div class="hero hero-split">
        <div class="hero-copy">
          <h1>Run your rental properties without the spreadsheet chaos</h1>
          <p>
            Properties, tenants, rent collection, maintenance, and a real cash-book ledger —
            all in one place built for landlords, not accountants.
          </p>
          <div class="hero-actions">
            <a class="btn btn-primary btn-lg" routerLink="/auth/signup">Get Started Free</a>
            <a class="btn btn-lg" routerLink="/auth/login" style="background:rgba(255,255,255,0.15); border-color:rgba(255,255,255,0.4); color:#fff;">Log in</a>
          </div>
        </div>

        <div class="hero-preview-card" aria-hidden="true">
          <div class="hero-preview-title">Ledger — This Month</div>
          <div class="hero-preview-stats">
            <div>
              <span class="stat-value" style="color:var(--success);">৳48,000</span>
              <span class="stat-label">In</span>
            </div>
            <div>
              <span class="stat-value" style="color:var(--danger);">৳6,200</span>
              <span class="stat-label">Out</span>
            </div>
            <div>
              <span class="stat-value">৳41,800</span>
              <span class="stat-label">Net</span>
            </div>
          </div>
          <div class="hero-preview-row">
            <span>Payment — Rahim Uddin</span>
            <span class="badge badge-paid">+15,000</span>
          </div>
          <div class="hero-preview-row">
            <span>Expense — Maintenance</span>
            <span class="badge badge-unpaid">-1,200</span>
          </div>
          <div class="hero-preview-row">
            <span>Unit A-102</span>
            <span class="badge badge-vacant">vacant</span>
          </div>
        </div>
      </div>

      <h2>Everything you need, already built</h2>
      <div class="module-grid">
        @for (f of features; track f.title) {
          <div class="module-tile">
            <span class="module-tile-icon" [innerHTML]="f.icon"></span>
            <div class="module-title">{{ f.title }}</div>
            <p>{{ f.desc }}</p>
          </div>
        }
      </div>

      <div class="callout-banner">
        <h2>Vacant unit? It's already advertised.</h2>
        <p>
          The moment a unit goes vacant, LandLord auto-posts it to <strong>BariVara.com</strong> —
          our connected rental marketplace. No printed signs, no word-of-mouth-only reach.
          Your listing goes out to renters searching online, far beyond your neighborhood,
          with zero extra work on your part.
        </p>
      </div>

      <h2>Built for landlords managing one unit or a hundred</h2>
      <p>
        Whether it's a single family home or a full apartment building, LandLord scales with
        your portfolio — the same billing, tenant, and maintenance tools either way.
      </p>

      <div class="cta-banner">
        <h2>Ready to get started?</h2>
        <p>Create your account in minutes — no credit card, no setup fees.</p>
        <a class="btn btn-primary btn-lg" routerLink="/auth/signup">Get Started Free</a>
      </div>
    </div>
  `,
})
export class HomepageComponent {
  readonly features = [
    {
      title: 'Property & Units',
      desc: 'Track every property and unit, vacant or occupied, in one list.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-4h6v4"/><path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01"/></svg>',
    },
    {
      title: 'Tenant Management',
      desc: 'Register tenants, manage lease agreements, handle move-outs cleanly.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    },
    {
      title: 'Monthly Billing',
      desc: 'Automatic monthly bills with rollover balances — never lose track of who owes what.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
    },
    {
      title: 'Cash-Book Ledger',
      desc: 'Every payment in, every expense out, one running balance.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    },
    {
      title: 'Maintenance Tracking',
      desc: 'Log issues, track resolution, and know exactly what repairs cost.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    },
    {
      title: 'Marketplace Reach',
      desc: 'Vacant units auto-post to BariVara.com for wider exposure.',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>',
    },
  ];
}
