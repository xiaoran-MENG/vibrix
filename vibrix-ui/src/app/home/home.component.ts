import { Component, effect, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SongCardComponent } from './song-card/song-card.component';
import { SongService } from '../service/song.service';
import { ToastService } from '../service/toast.service';
import { ReadSong } from '../service/model/song.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FontAwesomeModule,
    SongCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private songService = inject(SongService);
  private toastService = inject(ToastService);
  
  songs: Array<ReadSong> | undefined;

  constructor() {
    effect(() => {
      const response = this.songService.listing();
      const status = response.status;
      if (status === 'OK') {
        this.songs = response.value;
      } else if (status === 'ERROR') {
        this.toastService.add('Failed to load songs', 'DANGER');
      }
    });
  }
  
  ngOnInit(): void {
    this.songService.list();
  }
}
