import { Component, OnInit } from '@angular/core';
import { Apiservice } from '../service/apiservice';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent  implements OnInit {
  DriverProfileForm!:FormGroup;
  constructor(private service:Apiservice) { }
  ionViewWillEnter() {
    this.getProfileImageView()
    this.getDriverFullProfile()

  }
  ngOnInit() {
  }



  getProfileImageView(){
    this.service.getProfileImage().subscribe((res:any)=>{
      console.log(res)
    })
  }


getDriverFullProfile(){
  this.service.getDriverProfile().subscribe((res:any)=>{
    console.log(res)
  })
}


updateProfile(){
 let data =  this.DriverProfileForm.value
  this.service.updateDriverProfile(data).subscribe((res:any)=>{
    console.log(res)
  })
}

uploadImage(){
  let file = this.DriverProfileForm.value
  this.service.uploadImage(file).subscribe((res:any)=>{
    console.log(res);
    this.getProfileImageView()
  })
}
}
