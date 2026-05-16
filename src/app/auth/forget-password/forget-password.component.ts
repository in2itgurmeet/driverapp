import { IonicModule } from '@ionic/angular';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../service/authservice';
import { DefultUsageService } from 'src/app/service/defult-usage.service';
import { AuthFlowService } from '../service/auth-flow-service';

@Component({
  selector: 'app-forget-password',
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ForgetPasswordComponent implements OnInit {
  minutes: number = 0;
  seconds: number = 59;
  showTimer: boolean = true;
  otpForm!: FormGroup;
  forgetPasswordForm!: FormGroup;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  password: string = '';
  resetPasswordForm: any;
@ViewChild('d1') d1!: IonInput;
@ViewChild('d2') d2!: IonInput;
@ViewChild('d3') d3!: IonInput;
@ViewChild('d4') d4!: IonInput;
@ViewChild('d5') d5!: IonInput;
@ViewChild('d6') d6!: IonInput;
  constructor(
    private routes: Router,
    public flow: AuthFlowService,
    private fb: FormBuilder,
    private authApi: AuthService,
    private defulService: DefultUsageService,

  ) {
    this.flow.loadEmail();
  }

  ngOnInit() {
    this.initForgetPasswordForm();
    this.initOtpForm();
    this.startTimer();
    this.initResetPasswordForm();
  }

  initForgetPasswordForm() {
    this.forgetPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }
  initOtpForm() {
    this.otpForm = this.fb.group({
      d1: ['', Validators.required],
      d2: ['', Validators.required],
      d3: ['', Validators.required],
      d4: ['', Validators.required],
      d5: ['', Validators.required],
      d6: ['', Validators.required],
    });
  }
  initResetPasswordForm() {
    this.resetPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  startTimer(): void {
    const interval = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else {
        if (this.minutes > 0) {
          this.minutes--;
          this.seconds = 59;
        } else {
          this.showTimer = false;
          clearInterval(interval);
        }
      }
    }, 1000);
  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  togglePasswordVisibility(): void {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }

  sendOtp() {
    this.authApi.forgetPassWord(this.forgetPasswordForm.value).subscribe({
      next: (res) => {
        this.flow.setEmail(this.forgetPasswordForm.value.email);
        this.flow.setStep('otp');
        this.defulService.successToast(res.message);
      },
      error: (err) => {
        this.defulService.errorToast(
          err?.error?.message
        );
      }
    });
  }
  verifyOtp() {
    const otp =
      this.otpForm.value.d1 +
      this.otpForm.value.d2 +
      this.otpForm.value.d3 +
      this.otpForm.value.d4 +
      this.otpForm.value.d5 +
      this.otpForm.value.d6;
    this.authApi.verifyOtp({
      email: this.flow.email(),
      otp: otp
    }).subscribe({
      next: (res) => {
        this.defulService.successToast(res.message);
        this.flow.setStep('reset-password');
      },
      error: (err) => {
        this.defulService.errorToast(err?.error?.message);
      }
    });
  }


onSubmitResetPass() {
  if (this.resetPasswordForm.invalid) return;

  const payload = {
    email: this.flow.email(), // yeh zaroor bhejna hai
    newPassword: this.resetPasswordForm.value.password
  };
  this.authApi.resetPassword(payload).subscribe({
    next: (res) => {
      this.defulService.successToast(res.message);
      this.resetPasswordForm.reset();
      this.forgetPasswordForm.reset();
      this.otpForm.reset();
      this.routes.navigate(['/auth']);
    },
    error: (err) => {
      this.defulService.errorToast(err?.error?.message);
    }
  });
}


  goBack(event: any) {
    this.flow.setStep(event);
  }

  moveToNext(event: any, next: any, prev?: any) {
    const value = event.target.value;

    if (value.length === 1 && next) {
      next.setFocus();
    }

    if (value.length === 0 && prev) {
      prev.setFocus();
    }
  }

}
