import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { icons } from './common/icons';
import { HeaderComponent } from "./layout/header/header.component";
import { NavComponent } from "./layout/nav/nav.component";
import { PoolComponent } from "./layout/pool/pool.component";
import { ToastInfo } from './service/model/toast-info.model';
import { ToastService } from './service/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    FontAwesomeModule, 
    NavComponent, 
    PoolComponent, 
    HeaderComponent, 
    NgbToastModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'vibrix-ui';
  
  private icons = inject(FaIconLibrary);
  private toaster = inject(ToastService);
  toasts = this.toaster.toasts;
  
  ngOnInit(): void {
    this.addIcons();
    this.toaster.add('Hello', 'DANGER');
  }

  removeToast(toast: ToastInfo) {
    this.toaster.remove(toast);
  }

  private addIcons() {
    this.icons.addIcons(...icons);
  }
}
