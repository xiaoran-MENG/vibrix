import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SongService } from '../../service/song.service';
import { ReadSong } from '../../service/model/song.model';
import { PoolSongCardComponent } from '../../common/pool-song-card/pool-song-card.component';

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

  songs: Array<ReadSong> = [];
  
  constructor() {
    effect(() => {
      if (this.songService.listing().status === 'OK') {
        this.songs = this.songService.listing().value!;
      }
    });
  }
  
  ngOnInit(): void {

  }
}
