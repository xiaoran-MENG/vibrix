import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PoolSongCardComponent } from '../../common/pool-song-card/pool-song-card.component';
import { ReadSong, SongContent } from '../../service/model/song.model';
import { SongContentService } from '../../service/song-content.service';
import { FavoriteSongButtonComponent } from '../../common/favorite-song-button/favorite-song-button.component';
import { Howl } from 'howler';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    FontAwesomeModule,
    FormsModule,
    PoolSongCardComponent,
    FavoriteSongButtonComponent,
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent {
  private contentService = inject(SongContentService);

  song: SongContent | undefined = undefined;
  howl: Howl | undefined;
  volumn = 0.5;
  playing = false;
  muted = false;

  private queue: Array<SongContent> = [];
  private previousQueue: Array<SongContent> = [];

  constructor() {
    effect(() => {
      const queue = this.contentService.queuing();
      console.log('player-ui');
      console.log(queue);
      if (queue.length > 0) this.onQueue(queue);
    });
    
    effect(() => {
      if (this.contentService.playing().status === 'OK') this.onNext();
    })
  }

  onForward() {
    this.playNext();
  }

  onBackward() {
    if (this.previousQueue.length === 0) return;
    this.playing = false;
    if (this.song) this.queue.unshift(this.song!);
    const previous = this.previousQueue.shift();
    this.contentService.next(previous!);
  }

  play() {
    if (this.howl) this.howl.play();
  }

  
  pause() {
    if (this.howl) this.howl.pause();
  }

  toggleMute() {
    if (!this.howl) return;
    this.muted = !this.muted;
    this.howl.mute(this.muted);
    if (this.muted) this.volumn = 0;
    else {
      this.volumn = 0.5;
      this.howl.volume(this.volumn);
    }
  }

  onVolumnChange(volume: number) {
    this.volumn = volume / 100;
    if (!this.howl) return;
    if (this.volumn === 0) {
      this.muted = true;
      this.howl.mute(this.muted);
    } else if (this.muted) {
      this.muted = false;
      this.howl.mute(this.muted);
    }
  }

  private onNext() {
    this.song = this.contentService.playing().value!;
    console.log('player-onNext() | playing...');
    console.log(this.song);
    const howl = new Howl({
      src: [`data:${this.song.fileContentType};base64,${this.song.file}`],
      volume: this.volumn,
      onplay: () => this.onPlay(),
      onpause: () => this.onPause(),
      onend: () => this.onEnd(),
    });

    if (this.howl) this.howl.stop;
    howl.play();
    this.howl = howl;
  }

  private onPlay() {
    this.playing = true;
  }

  private onPause() {
    this.playing = false;
  }

  private onEnd() {
    this.playNext();
    this.playing = false;
  }

  private onQueue(queue: ReadSong[]) {
    this.queue = queue;
    this.playNext();
  }

  private playNext() {
    if (this.queue.length === 0) return;
    this.playing = false;
    if (this.song) this.previousQueue.unshift(this.song);
    const next = this.queue.shift();
    this.contentService.next(next!);
  }
}
