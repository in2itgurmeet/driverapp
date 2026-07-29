import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Apiservice } from '../service/apiservice';
import { Router } from '@angular/router';
import { DefultUsageService } from '../../service/defult-usage.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  DriverProfileForm!: FormGroup;
  isUploadModalOpen = false;
  selectedFile!: File;
  isEditing = false;

  profileImage: string =
    'https://ionicframework.com/docs/img/demos/avatar.svg';

  openUploadModal() {
    this.isUploadModalOpen = true;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  constructor(
    private service: Apiservice,
    private fb: FormBuilder,
    private defulService: DefultUsageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
  }

  ionViewWillEnter() {
    this.getProfileImageView();
    this.getDriverFullProfile();
  }

  initForm() {
    this.DriverProfileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      city: [''],
      state: [''],
      vehicleNumber: [''],
      vehicleType: [''],
      vehicleCapacity: [''],
      licenseNumber: [''],
      aadhaarNumber: [''],
      isOnline: [false],
      isAvailable: [true],
    });
  }

  getProfileImageView() {
    this.service.getProfileImage().subscribe({
      next: (res: any) => {
        if (res?.data?.profileImage) {
          this.profileImage = res.data.profileImage;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getDriverFullProfile() {
    this.service.getDriverProfile().subscribe({
      next: (res: any) => {
        const data = res?.data;
        const driver = data?.driver;
        this.DriverProfileForm.patchValue({
          name: data?.name,
          email: data?.email,
          phone: data?.phone,
          address: driver?.address,
          city: driver?.city,
          state: driver?.state,
          vehicleNumber: driver?.vehicleNumber,
          vehicleType: driver?.vehicleType,
          vehicleCapacity: driver?.vehicleCapacity,
          licenseNumber: driver?.licenseNumber,
          aadhaarNumber: driver?.aadhaarNumber,
          isOnline: driver?.isOnline,
          isAvailable: driver?.isAvailable,
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateProfile() {
    if (this.DriverProfileForm.invalid) {
      return;
    }
    const formValue = this.DriverProfileForm.value;
    const data = {
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      driver: {
        vehicleNumber: formValue.vehicleNumber,
        vehicleType: formValue.vehicleType,
        vehicleCapacity: formValue.vehicleCapacity,
        licenseNumber: formValue.licenseNumber,
        aadhaarNumber: formValue.aadhaarNumber,
        address: formValue.address,
        city: formValue.city,
        state: formValue.state,
        pincode: formValue.pincode,
        isOnline: formValue.isOnline,
        isAvailable: formValue.isAvailable
      }
    };
    
    this.service.updateDriverProfile(data).subscribe({
      next: async (res: any) => {
        this.isEditing = false;
        this.defulService.successToast('Profile updated successfully');
      },
      error: async (err) => {
        this.defulService.errorToast('Something went wrong');
      },
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
      this.uploadImage();
    }
  }


  closeUploadModal() {
    this.isUploadModalOpen = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  upgradeProfile() {
    this.defulService.warningToast('Upgrade functionality coming soon!');
  }


  removeSelectedFile() {
    this.selectedFile = null as any;
  }

  uploadImage() {

    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();

    formData.append(
      'profileImage',
      this.selectedFile
    );

    this.service.uploadImage(formData)
      .subscribe({

        next: (res: any) => {
          this.getProfileImageView();
          this.closeUploadModal();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
}