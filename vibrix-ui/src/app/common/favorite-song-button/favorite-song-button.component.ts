import { Component, effect, inject, input } from '@angular/core';
import { ReadSong } from '../../service/model/song.model';
import { AuthService } from '../../service/auth.service';
import { SongService } from '../../service/song.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-favorite-song-button',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './favorite-song-button.component.html',
  styleUrl: './favorite-song-button.component.scss'
})
export class FavoriteSongButtonComponent  {
  song = input.required<ReadSong>();

  authService = inject(AuthService);
  songService = inject(SongService);

  constructor() {
    effect(() => {
      let state = this.songService.togglingLike();
      if(state.status === "OK" && state.value && this.song().publicId === state.value.publicId)
        this.song().favorite = state.value.favorite;
    });
  }

  onFavorite(song: ReadSong) {
    this.songService.toggleFavorite(!song.favorite, song.publicId!);
  }
}
