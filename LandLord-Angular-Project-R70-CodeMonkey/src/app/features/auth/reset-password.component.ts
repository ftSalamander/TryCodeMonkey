import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="card">
      <h2>Set a new password</h2>

      @if (!done()) {
        <div class="field">
          <label for="password">New password</label>
          <input id="password" type="password" name="password" [(ngModel)]="password" placeholder="Create a strong password" required />
        </div>
        <div class="field">
          <label for="confirm">Confirm password</label>
          <input id="confirm" type="password" name="confirm" [(ngModel)]="confirm" placeholder="Repeat your password" required />
        </div>
        @if (error()) {
          <p class="error-text">{{ error() }}</p>
        }
        <div class="actions-row">
          <button class="btn btn-primary btn-block" (click)="save()">Update password</button>
        </div>
      } @else {
        <div class="notice notice-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
          <span>Password updated. You can now log in.</span>
        </div>
        <div class="actions-row">
          <button class="btn btn-primary btn-block" (click)="toLogin()">Return to login</button>
        </div>
      }
    </div>
  `,
})
export class ResetPasswordComponent {
  private readonly router = inject(Router);

  password = '';
  confirm = '';
  readonly error = signal('');
  readonly done = signal(false);

  save(): void {
    if (!this.password || this.password !== this.confirm) {
      this.error.set('Passwords do not match.');
      return;
    }
    this.error.set('');
    this.done.set(true);
  }

  toLogin(): void {
    this.router.navigateByUrl('/auth/login');
  }
}
