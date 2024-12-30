import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { State } from './model/state.model';
import { ReadSong, SongContent } from './model/song.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SongContentService {
  http = inject(HttpClient);

  private queuing$ = signal<Array<ReadSong>>([]);
  private playing$ = signal(State.init<SongContent>());

  queuing = computed(() => this.queuing$());
  playing = computed(() => this.playing$());

  constructor() { }

  queue(first: ReadSong, songs: Array<ReadSong>) {
    songs = songs.filter(s => s.publicId !== first.publicId);
    if (songs) songs.unshift(first);
    this.queuing$.set(songs);
  }

  next(song: SongContent) {
    console.log('content-service-next()');
    console.log(song);
    const params = new HttpParams().set('publicId', song.publicId!);
    const url = `${environment.API_URL}/api/songs/content`;
    this.http.get<SongContent>(url, { params }).subscribe({
      next: content => {
        this.assign(song, content);
        console.log('content to play');
        console.log(content);
        this.playing$.set(State.ok(content));
      },
      error: e => this.playing$.set(State.failed<SongContent>(e))
    });
  }

  private assign(from: ReadSong, to: SongContent) {
    to.cover = from.cover;
    to.coverContentType = from.coverContentType;
    to.title = from.title;
    to.author = from.author;
    to.favorite = from.favorite;
  }

}
