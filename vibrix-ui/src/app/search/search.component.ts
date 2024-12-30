import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PoolSongCardComponent } from '../common/pool-song-card/pool-song-card.component';
import { SongService } from '../service/song.service';
import { SongContentService } from '../service/song-content.service';
import { ToastService } from '../service/toast.service';
import { ReadSong } from '../service/model/song.model';
import { debounce, filter, interval, of, switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { State } from '../service/model/state.model';
import { FavoriteSongButtonComponent } from "../common/favorite-song-button/favorite-song-button.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    FontAwesomeModule,
    PoolSongCardComponent,
    FavoriteSongButtonComponent
],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  private songService = inject(SongService);
  private contentService = inject(SongContentService);
  private toastService = inject(ToastService);

  text = '';
  songs: Array<ReadSong> = [];
  searching = false;

  onSearch(text: string) {
    this.text = text;
    of(text).pipe(
      tap(t => this.reset(t)),
      filter(t => t.length > 0),
      debounce(() => interval(300)),
      tap(() => this.searching = true),
      switchMap(t => this.songService.search(t))
    ).subscribe({
      next: s => this.onNext(s)
    })
  }

  onNext(state: State<ReadSong[], HttpErrorResponse>): void {
    this.searching = false;
    const status = state.status;
    if (status === 'OK') this.songs = state.value!;
    else if (status === 'ERROR') this.toastService.add('Failed to search', 'DANGER');
  }

  onPlay(song: ReadSong) {
    this.contentService.queue(song, this.songs);
  }
  
  private reset(text: string) {
    if (text.length === 0) {
      this.songs = [];
    }
  }

}
