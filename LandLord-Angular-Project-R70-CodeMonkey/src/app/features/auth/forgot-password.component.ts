import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="card">
      <h2>Reset your password</h2>

      @if (!sent()) {
        <p>Enter the email on your account and we'll send a password-reset link.</p>
        <div class="field">
          <label for="email">Account email</label>
          <input id="email" type="email" name="email" [(ngModel)]="email" placeholder="name@example.com" required />
        </div>
        <div class="actions-row">
          <button class="btn btn-primary btn-block" (click)="send()">Send password-reset link</button>
        </div>
      } @else {
        <div class="notice notice-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
          <span>A reset link was sent to {{ email }}.</span>
        </div>
        <div class="actions-row">
          <a class="btn btn-primary btn-block" routerLink="/auth/reset-password">Open reset link (demo)</a>
        </div>
      }

      <p class="auth-alt"><a routerLink="/auth/login">Back to login</a></p>
    </div>
  `,
})
export class ForgotPasswordComponent {
  email = '';
  readonly sent = signal(false);

  send(): void {
    if (!this.email) return;
    this.sent.set(true);
  }
}
