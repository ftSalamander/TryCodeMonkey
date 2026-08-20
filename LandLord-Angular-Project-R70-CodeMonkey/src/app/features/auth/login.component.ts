import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, UserRole } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="card">
      <h2>Welcome back</h2>
      <p>Enter your account email and password.</p>

      <form (ngSubmit)="submit()">
        <div class="field">
          <label for="email">Email</label>
          <input id="email" type="email" name="email" [(ngModel)]="email" placeholder="name@example.com" required />
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input id="password" type="password" name="password" [(ngModel)]="password" placeholder="••••••••" required />
        </div>
        <div class="field">
          <label for="role">Sign in as</label>
          <div class="seg" style="width:100%;">
            <button type="button" [class.active]="role === 'landlord'" (click)="role = 'landlord'">Landlord</button>
            <button type="button" [class.active]="role === 'tenant'" (click)="role = 'tenant'">Tenant</button>
          </div>
          <span class="hint-text">Demo stub — role normally comes from the account record.</span>
        </div>

        @if (error()) {
          <p class="error-text">{{ error() }}</p>
        }

        <div class="actions-row">
          <button type="submit" class="btn btn-primary btn-block">Log in</button>
        </div>
      </form>

      <div class="auth-links">
        <a routerLink="/auth/forgot-password">Forgot password?</a>
      </div>
      <p class="auth-alt">
        Don't have an account? <a routerLink="/auth/signup">Sign up</a>
      </p>
    </div>
  `,
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  role: UserRole = 'landlord';
  readonly error = signal('');

  submit(): void {
    if (!this.email || !this.password) {
      this.error.set('Enter both email and password.');
      return;
    }
    this.error.set('');
    this.auth.login(this.email, this.password, this.role);
    this.router.navigateByUrl(this.role === 'landlord' ? '/landlord/dashboard' : '/tenant/dashboard');
  }
}
