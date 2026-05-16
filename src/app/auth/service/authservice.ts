import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private url = 'https://top100movies-5f84e.web.app/city/allcountries';

  constructor(private http: HttpClient) { }

  loginUser(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/driver/login`, data);
  }

  registerUser(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/driver/register`, data, { observe: 'response' })
  }

  forgetPassWord(email:any):Observable<any>{
    return this.http.post(`${environment.apiUrl}/auth/driver/forgot-password`, email);
  }

  verifyOtp(data:any):Observable<any>{
    return this.http.post(`${environment.apiUrl}/auth/driver/verify-otp`, data);
  }

  resetPassword(data:any):Observable<any>{
    return this.http.post(`${environment.apiUrl}/auth//driver/reset-password`, data);
  }


    getCountry(): Observable<any> {
    return this.http.get(this.url);
  }

  getStatedata(countryCode: any): Observable<any> {
    return this.http.get(
      `https://top100movies-5f84e.web.app/city/states-by-countrycode?countrycode=${countryCode}`
    );
  }

  getCity(countryCode: any, StateCode: any): Observable<any> {
    return this.http.get(
      `https://top100movies-5f84e.web.app/city/cities-by-countrycode-and-statecode?countrycode=${countryCode}&statecode=${StateCode}`
    );
  }


}
