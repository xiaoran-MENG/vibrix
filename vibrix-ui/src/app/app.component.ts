import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal, NgbModalRef, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { icons } from './common/icons';
import { HeaderComponent } from "./layout/header/header.component";
import { NavComponent } from "./layout/nav/nav.component";
import { PoolComponent } from "./layout/pool/pool.component";
import { ToastInfo } from './service/model/toast-info.model';
import { ToastService } from './service/toast.service';
import { PlayerComponent } from "./layout/player/player.component";
import { AuthPopupState, AuthService } from './service/auth.service';
import { AuthPopupComponent } from './layout/auth-popup/auth-popup.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FontAwesomeModule,
    NavComponent,
    PoolComponent,
    HeaderComponent,
    NgbToastModule,
    PlayerComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'vibrix-ui';
  
  private icons = inject(FaIconLibrary);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private popup = inject(NgbModal);
  private popupRef: NgbModalRef | null = null;

  toasts = this.toastService.toasts;

  constructor() {
    effect(() => this.toggleAuthPopup(this.authService.authPopup()), {
      allowSignalWrites: true
    });
  }
  
  ngOnInit(): void {
    this.addIcons();
    this.toastService.add('Welcome to Vibrix', 'DANGER');
  }
  
  removeToast(toast: ToastInfo) {
    this.toastService.remove(toast);
  }

  private toggleAuthPopup(state: AuthPopupState) {
    if (state === 'OPEN') 
      this.openAuthPopup();
    else if (this.popupRef && state === 'CLOSE' && this.popup.hasOpenModals())
      this.popupRef.close();
  }

  private openAuthPopup() {
    this.popupRef = this.popup.open(AuthPopupComponent, {
      ariaDescribedBy: 'authentication-modal',
      centered: true
    });

    this.popupRef.dismissed.subscribe({
      next: () => this.authService.toggleAuthPopup('CLOSE')
    });

    this.popupRef.closed.subscribe({
      next: () => this.authService.toggleAuthPopup('CLOSE')
    });
  }

  private addIcons() {
    this.icons.addIcons(...icons);
  }
}
