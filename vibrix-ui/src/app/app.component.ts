import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { icons } from './common/icons';
import { NavComponent } from "./layout/nav/nav.component";
import { PoolComponent } from "./layout/pool/pool.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FontAwesomeModule, NavComponent, PoolComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'vibrix-ui';

  private icons = inject(FaIconLibrary);

  ngOnInit(): void {
    this.addIcons();
  }

  private addIcons() {
    this.icons.addIcons(...icons);
  }
}
