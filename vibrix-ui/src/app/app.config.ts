import { provideHttpClient, withInterceptors, withXsrfConfiguration } from "@angular/common/http";
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './service/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withXsrfConfiguration({cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN'})
    ),
    provideAnimations()
  ]
};
