import { IonicModule } from '@ionic/angular';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService } from '../service/authservice';
import { DefultUsageService } from 'src/app/service/defult-usage.service';
@Component({
  selector: 'app-registerpage',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './registerpage.component.html',
  styleUrls: ['./registerpage.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterpageComponent implements OnInit {

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  country: any = null;
  state: any;
  city: any;
  stateCode: any;
  countryCode: any;
  registerForm!: FormGroup;
vehicles:any;
  constructor(
    private apiService: AuthService,
    private defultService: DefultUsageService
  ) { 
    this.vehicles = this.defultService.vehicles;
  }


  ngOnInit() {
    this.initForm();
    this.getCountry();
    this.apiService.getVehicles().subscribe({
      next: (res: any) => {
        this.vehicles = res.data || [];
      },
      error: (err: any) => {
        console.error('Failed to load vehicles:', err);
        this.vehicles = this.defultService.vehicles;
      }
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

initForm() {
  this.registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),

    vehicleNumber: new FormControl('', Validators.required),
    vehicleType: new FormControl('', Validators.required),
    vehicleCapacity: new FormControl('', Validators.required),

    licenseNumber: new FormControl('', Validators.required),
    aadhaarNumber: new FormControl('', Validators.required),

    address: new FormControl('', Validators.required),

    country: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),

  });
}

  onSubmit() {

    const form = this.registerForm.value;
    console.log(form);
    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      password: form.password,

      driver: {
        vehicleNumber: form.vehicleNumber,
        vehicleType: form.vehicleType,
        vehicleCapacity: form.vehicleCapacity,
        licenseNumber: form.licenseNumber,
        aadhaarNumber: form.aadhaarNumber,
        address: form.address,
        city: form.city,
        state: form.state,
      }
    };

    this.apiService.registerUser(payload).subscribe({

      next: (res: any) => {
        this.defultService.successToast(res.message);
        this.registerForm.reset();
      },

      error: (err) => {
        this.defultService.errorToast(err.error.message);
      }

    });
  }

  getCountry() {
    this.apiService.getCountry().subscribe((country) => {
      this.country = country;
    });
  }

  onSelectedChangeCountry(event: any) {
    const countryCode = event.detail.value;
    this.registerForm.patchValue({
      country: countryCode,
      state: '',
      city: ''
    });

    this.apiService.getStatedata(countryCode).subscribe((res: any) => {
      this.state = res;
      this.city = [];
    });
  }
onSelectedChangeState(event: any) {
  const stateCode = event.detail.value;
  this.registerForm.patchValue({
    state: stateCode,
    city: ''
  });
  const countryCode = this.registerForm.value.country;
  this.apiService.getCity(countryCode, stateCode).subscribe((res: any) => {
    this.city = res;
  });
}

selectedVehicle: any;
onVehicleChange(event: any) {
  this.selectedVehicle = event.detail.value;
  this.registerForm.patchValue({
    vehicleType: this.selectedVehicle.name,
    vehicleCapacity: this.selectedVehicle.capacity
  })}
}
