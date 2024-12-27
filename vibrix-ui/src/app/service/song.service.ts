import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { SaveSong } from './model/song.model';
import { State } from './model/state.model';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private songAdded$ = signal(State.init<SaveSong>());
  songAdded = computed(() => this.songAdded$());

  http = inject(HttpClient);

  constructor() { }

  reset() {
    this.songAdded$.set(State.init<SaveSong>());
  }

  add(song: SaveSong) {
    const url = `${environment.API_URL}/api/songs`;
    this.http.post<SaveSong>(url, this.toRequestBody(song)).subscribe({
      next: s => this.songAdded$.set(State.ok<SaveSong>(s)),
      error: e => this.songAdded$.set(State.failed<SaveSong>(e))
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
