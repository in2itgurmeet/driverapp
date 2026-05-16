import { Injectable, signal } from '@angular/core';

export type AuthStep =
  | 'forget-password'
  | 'otp'
  | 'reset-password';

@Injectable({
  providedIn: 'root'
})
export class AuthFlowService {
  step = signal<AuthStep>('forget-password');
  email = signal<string>('');

  setStep(step: AuthStep) {
    this.step.set(step);
  }
  setEmail(email: string) {
    this.email.set(email);
    localStorage.setItem('auth_email', email);
  }
  loadEmail() {
    const saved = localStorage.getItem('auth_email');
    if (saved) this.email.set(saved);
  }
  reset() {
    this.step.set('forget-password');
    this.email.set('');
    localStorage.removeItem('auth_email');
  }
}
