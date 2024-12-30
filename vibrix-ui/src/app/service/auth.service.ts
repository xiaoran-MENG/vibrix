import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { NOT_CONNECTED, State } from './model/state.model';
import { User } from './model/user.model';

export type AuthPopupState = 'OPEN' | 'CLOSE';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  location = inject(Location);

  private user$ = signal(State.unauthorized());
  private authPopup$ = signal<AuthPopupState>('CLOSE');

  user = computed(() => this.user$());
  authPopup = computed(() => this.authPopup$());

  constructor() { }

  getUser() {
    const url = `${environment.API_URL}/api/authuser`;
    this.http.get<User>(url).subscribe({
      next: u => this.user$.set(State.ok<User>(u)),
      error: e => {
        const authFailed = e.status === HttpStatusCode.Unauthorized && this.authenticated();
        this.user$.set(authFailed ? State.unauthorized() : State.failed<User>(e));
      }
    })
  }

  authenticated(): boolean {
    const user = this.user$().value;
    return user ? user!.email !== NOT_CONNECTED : false;
  }

  toggleAuthPopup(state: AuthPopupState) {
    this.authPopup$.set(state);
  }

  login() {
    location.href = `${location.origin}${this.location.prepareExternalUrl('oauth2/authorization/okta')}`;
  }

  logout() {
    const url = `${environment.API_URL}/api/logout`;
    this.http.post(url, {}, { withCredentials: true }).subscribe({
      next: (r: any) => {
        this.user$.set(State.unauthorized());
        location.href = r.logoutUrl
      }
    });
  }
}
