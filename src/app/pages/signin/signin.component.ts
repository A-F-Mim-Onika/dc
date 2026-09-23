import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventDataService } from '../../services/event-data.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  eventService = inject(EventDataService);
  router = inject(Router);

  selectedRole = signal<'guest' | 'host'>('guest');
  email = '';
  password = '';
  rememberMe = true;

  onLogin() {
    if (!this.email || !this.password) {
      this.eventService.showToast('warning', 'Missing Credentials', 'Please enter your email and password.');
      return;
    }

    this.eventService.showToast(
      'success',
      'Sign In Successful!',
      `Logged in as ${this.email} (${this.selectedRole() === 'guest' ? 'Member Pass' : 'Host Account'}).`
    );
    this.router.navigate(['/']);
  }

  socialLogin(provider: string) {
    this.eventService.showToast('info', `${provider} Sign In`, `Authenticating via ${provider}... Welcome back!`);
    this.router.navigate(['/']);
  }

  forgotPassword() {
    this.eventService.showToast('info', 'Password Reset', 'A password reset link has been dispatched to your email.');
  }
}
