import { Component, effect, inject, OnInit } from '@angular/core';
import { State } from '../../service/model/state.model';
import { AuthService } from '../../service/auth.service';
import { Location } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  user = State.unauthorized().value;
  auth = inject(AuthService);
  location = inject(Location);

  constructor() {
    effect(() => {
      const { status, value } = this.auth.user();
      if (status === 'OK') this.user = value;
      console.log('header - effect - user');
      console.log(this.user);
    });
  }

  ngOnInit(): void {
    this.auth.getUser();
    console.log('header - init - got user');
  }

  login() {
    this.auth.login();
  }

  logout() {
    this.auth.logout();
  }

  forward() {
    this.location.forward();
  }

  back() {
    this.location.back();
  }
}
