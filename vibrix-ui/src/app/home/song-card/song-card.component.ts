import { animate, style, transition, trigger } from '@angular/animations';
import { Component, input, OnInit } from '@angular/core';
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
  song = input.required<ReadSong>();
  songToDisplay: ReadSong = {
    favorite: false,
    displayPlayIcon: false
  };
  
  ngOnInit(): void {
    this.songToDisplay = this.song();
  }

  onHoverPlay(displayPlayIcon: boolean) {
    this.songToDisplay.displayPlayIcon = displayPlayIcon;
  }

}
