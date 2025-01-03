import { Component, EventEmitter, input, Output } from '@angular/core';
import { ReadSong } from '../../service/model/song.model';

@Component({
  selector: 'app-pool-song-card',
  standalone: true,
  imports: [],
  templateUrl: './pool-song-card.component.html',
  styleUrl: './pool-song-card.component.scss'
})
export class PoolSongCardComponent {
  @Output() songToPlay$ = new EventEmitter<ReadSong>();

  song = input.required<ReadSong>();

  play() {
    this.songToPlay$.next(this.song());
  }
}
