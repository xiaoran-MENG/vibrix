import { Component, effect, inject } from '@angular/core';
import { ReadSong } from '../service/model/song.model';
import { SongService } from '../service/song.service';
import { SongContentService } from '../service/song-content.service';
import { FavoriteSongButtonComponent } from '../common/favorite-song-button/favorite-song-button.component';
import { PoolSongCardComponent } from '../common/pool-song-card/pool-song-card.component';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [
    FavoriteSongButtonComponent,
    PoolSongCardComponent
  ],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent {
  songs: Array<ReadSong> = [];
  songService = inject(SongService);
  contentService = inject(SongContentService);

  constructor() {
    effect(() => {
      const state = this.songService.togglingLike();
      if (state.status === 'OK') this.songService.getLikedSongs();
    });

    effect(() => {
      let state = this.songService.listingLiked();
      if(state.status === "OK") {
        state.value?.forEach(song => song.favorite = true)
        this.songs = state.value!;
      }
    });
  }

  ngOnInit(): void {
    this.songService.getLikedSongs();
  }

  onPlay(firstSong: ReadSong) {
    this.contentService.queue(firstSong, this.songs);
  }
}
