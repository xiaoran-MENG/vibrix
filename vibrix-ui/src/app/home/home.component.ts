import { Component, effect, inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SongCardComponent } from './song-card/song-card.component';
import { SongService } from '../service/song.service';
import { ToastService } from '../service/toast.service';
import { ReadSong } from '../service/model/song.model';
import { SongContentService } from '../service/song-content.service';
import { FavoriteSongCardComponent } from './favorite-song-card/favorite-song-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FontAwesomeModule,
    SongCardComponent,
    FavoriteSongCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private songService = inject(SongService);
  private toastService = inject(ToastService);
  private contentService = inject(SongContentService);
  
  songs: Array<ReadSong> | undefined;
  loading = false;

  constructor() {
    effect(() => {
      this.loading = true;
      const response = this.songService.listing();
      const status = response.status;
      if (status === 'OK') {
        this.songs = response.value;
      } else if (status === 'ERROR') {
        this.toastService.add('Failed to load songs', 'DANGER');
      }
      this.loading = false;
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.songService.list();
  }

  onPlay(song: ReadSong) {
    console.log('home-ui');
    console.log(song);
    this.contentService.queue(song, this.songs!);
  }

}
