import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReadSong } from '../../service/model/song.model';

@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './song-card.component.html',
  styleUrl: './song-card.component.scss',
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(':enter',
          [
            style({
              transform: 'translateY(10px)', 
              opacity: 0
            }),
            animate('.2s ease-out',
              style({
                transform: 'translateY(0px)', 
                opacity: 1
              })
            )
          ]
        ),
        transition(':leave',
          [
            style({
              transform: 'translateY(0px)', 
              opacity: 1
            }),
            animate('.2s ease-in',
              style({
                transform: 'translateY(10px)', 
                opacity: 0
              })
            )
          ]
        )
      ]
    )
  ]
})
export class SongCardComponent implements OnInit {
  @Output() songToPlay$ = new EventEmitter<ReadSong>();

  song = input.required<ReadSong>();
  songToPlay: ReadSong = {
    favorite: false,
    displayPlayIcon: false
  };
  
  ngOnInit(): void {
    this.songToPlay = this.song();
  }

  onHoverPlay(displayPlayIcon: boolean) {
    this.songToPlay.displayPlayIcon = displayPlayIcon;
  }

  play() {
    console.log('song-card-ui');
    console.log(this.songToPlay);
    this.songToPlay$.next(this.songToPlay);
  }
}
