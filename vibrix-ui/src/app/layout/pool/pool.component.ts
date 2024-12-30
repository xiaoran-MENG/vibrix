import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SongService } from '../../service/song.service';
import { ReadSong } from '../../service/model/song.model';
import { PoolSongCardComponent } from '../../common/pool-song-card/pool-song-card.component';
import { SongContentService } from '../../service/song-content.service';

@Component({
  selector: 'app-pool',
  standalone: true,
  imports: [
    FontAwesomeModule, 
    RouterModule,
    PoolSongCardComponent
  ],
  templateUrl: './pool.component.html',
  styleUrl: './pool.component.scss'
})
export class PoolComponent implements OnInit {
  private songService = inject(SongService);
  private contentService = inject(SongContentService);

  songs: Array<ReadSong> = [];
  loading = false;
  
  constructor() {
    effect(() => {
      if (this.songService.listing().status === 'OK') {
        this.songs = this.songService.listing().value!;
      }
      this.loading = false;
    });
  }
  
  ngOnInit(): void {
    this.loading = true;
    this.songService.list();
  }

  onPlay(song: ReadSong) {
    this.contentService.queue(song, this.songs);
  }
}
