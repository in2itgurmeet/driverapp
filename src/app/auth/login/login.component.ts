import { IonicModule } from '@ionic/angular';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '../service/authservice';
import { DefultUsageService } from 'src/app/service/defult-usage.service';
import { SocketService } from 'src/app/service/socket.service';

@Component({
  selector: 'app-my-login',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent implements OnInit {

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  loginForm!: FormGroup;

  constructor(
    private apiService: AuthService,
    private defultService: DefultUsageService,
    private socketService: SocketService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
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

  onSubmit() {
    const form = this.loginForm.value;
    this.apiService.loginUser(form).subscribe({
      next: (res) => {
        this.defultService.successToast(res.message);
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.user._id);
        this.socketService.joinRoom(res.user._id);
        this.loginForm.reset();
        this.route.navigate(['/dashboard']);
      },
      error: (err) => {
        this.defultService.errorToast(err.error.message);
      },
    });
  }

}