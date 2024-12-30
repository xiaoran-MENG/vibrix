import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  return next(req).pipe(
    tap({
      error: (err: HttpErrorResponse) => {
        if (err.status === 401 && err.url && err.url.includes('api/authuser')
          && authService.authenticated()) {
          authService.login();
        } else if (err.url && ((req.method !== 'GET' && !err.url.endsWith('/api/songs'))
          || (err.url && !err.url.endsWith('api/authuser')) && !authService.authenticated())) {
          authService.toggleAuthPopup("OPEN");
        }
      }
    })
  );
};


