import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReadSong, SaveSong } from './model/song.model';
import { State } from './model/state.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private toastService = inject(ToastService);
  private adding$ = signal(State.init<SaveSong>());
  private listing$ = signal(State.init<Array<ReadSong>>());
  private listingLiked$ = signal(State.init<Array<ReadSong>>());
  private togglingLike$ = signal(State.init<ReadSong>());

  adding = computed(() => this.adding$());
  listing = computed(() => this.listing$());
  togglingLike = computed(() => this.togglingLike$());
  listingLiked = computed(() => this.listingLiked$());

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

  search(text: string): Observable<State<Array<ReadSong>, HttpErrorResponse>> {
    const params = new HttpParams().set('term', text);
    const url = `${environment.API_URL}/api/songs/search`;
    return this.http.get<Array<ReadSong>>(url, { params }).pipe(
      map(s => State.ok(s)),
      catchError(e => of(State.failed<Array<ReadSong>>(e)))
    );
  }

  toggleFavorite(favorite: boolean, publicId: string) {
    const url = `${environment.API_URL}/api/songs/like`;
    const body = { favorite, publicId };
    this.http.post<ReadSong>(url, body).subscribe({
      next: s => {
        this.togglingLike$.set(State.ok(s));
        if (s.favorite) {
          this.toastService.add('You liked this song', 'SUCCESS');
        } else {
          this.toastService.add('You unliked this song', 'SUCCESS');
        }
      },
      error: e => {
        this.togglingLike$.set(State.failed<ReadSong>(e));
        this.toastService.add('Failed to like/unlike this sone', 'DANGER');
      }
    });
  }

  getLikedSongs() {
    const url = `${environment.API_URL}/api/songs/like`;
    this.http.get<Array<ReadSong>>(url).subscribe({
      next: s => this.listingLiked$.set(State.ok(s)),
      error: e => this.listingLiked$.set(State.failed<Array<ReadSong>>(e))
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
