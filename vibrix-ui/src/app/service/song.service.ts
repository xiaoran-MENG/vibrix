import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { ReadSong, SaveSong } from './model/song.model';
import { State } from './model/state.model';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private adding$ = signal(State.init<SaveSong>());
  private listing$ = signal(State.init<Array<ReadSong>>()); 

  adding = computed(() => this.adding$());
  listing = computed(() => this.listing$());

  http = inject(HttpClient);

  constructor() { }

  reset() {
    this.adding$.set(State.init<SaveSong>());
  }

  list() {
    const url = `${environment.API_URL}/api/songs`;
    this.http.get<Array<ReadSong>>(url).subscribe({
      next: r => this.listing$.set(State.ok<Array<ReadSong>>(r)),
      error: e => this.listing$.set(State.failed<Array<ReadSong>>(e))
    });
  }

  add(song: SaveSong) {
    const url = `${environment.API_URL}/api/songs`;
    this.http.post<SaveSong>(url, this.toRequestBody(song)).subscribe({
      next: s => this.adding$.set(State.ok<SaveSong>(s)),
      error: e => this.adding$.set(State.failed<SaveSong>(e))
    });
  }

  private toRequestBody(song: SaveSong) {
    const body = new FormData();
    body.append('cover', song.cover!);
    body.append('file', song.file!);
    body.append('dto', this.toDTO(song));
    return body;
  }

  private toDTO(song: SaveSong): string {
    const clone = structuredClone(song);
    clone.file = undefined;
    clone.cover = undefined;
    return JSON.stringify(clone);
  }
}
