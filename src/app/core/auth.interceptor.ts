import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
  HttpContextToken
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoaderService } from '../service/loader.service';

export const IS_PUBLIC_API = new HttpContextToken<boolean>(() => false);
export const NO_LOADER = new HttpContextToken<boolean>(() => false);

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private loaderService: LoaderService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const isPublic = req.context.get(IS_PUBLIC_API);
    const skipLoader = req.context.get(NO_LOADER);

    const token = localStorage.getItem('token');

    let authReq = req;

    if (!skipLoader) {
      this.loaderService.showLoader();
    }

    if (!isPublic && token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(

      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/auth']);
        }

        return throwError(() => error);
      }),

      finalize(() => {
        if (!skipLoader) {
          this.loaderService.hideLoader();
        }
      })
    );
  }
}
