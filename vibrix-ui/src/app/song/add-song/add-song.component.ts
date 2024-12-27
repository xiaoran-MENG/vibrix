import { Component, effect, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { SaveSong } from '../../service/model/song.model';
import { SongService } from '../../service/song.service';
import { ToastService } from '../../service/toast.service';
import { AddSongFormData } from './model/add-song-form.model';

type Progress = 'init' | 'invalid-file' | 'invalid-cover' | 'success' | 'error';

@Component({
  selector: 'app-add-song',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgbAlertModule,
    FontAwesomeModule
  ],
  templateUrl: './add-song.component.html',
  styleUrl: './add-song.component.scss'
})
export class AddSongComponent implements OnDestroy {
  private builder = inject(FormBuilder);
  private songService = inject(SongService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  
  adding = false;
  progress: Progress = 'init';
  song: SaveSong = {};
  form = this.builder.nonNullable.group<AddSongFormData>({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    author: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cover: new FormControl(null, { nonNullable: true, validators: [Validators.required] }),
    file: new FormControl(null, { nonNullable: true, validators: [Validators.required] })
  });

  constructor() {
    effect(() => {
      this.adding = false;
      const status = this.songService.adding().status;
      if (status === 'OK') {
        this.toastService.add('Song added', 'SUCCESS');
        this.router.navigate(['/']);
      } else if (status === 'ERROR') {
        this.toastService.add('Failed to add song', 'DANGER');
      }
    })
  }

  ngOnDestroy(): void {
    this.songService.reset();
  }

  get title(): AbstractControl<string, string> | null {
    return this.form.get('title');
  }

  get author(): AbstractControl<string, string> | null {
    return this.form.get('author');
  }

  get file(): AbstractControl<File | null, File | null> | null {
    return this.form.get('file');
  }

  get cover(): AbstractControl<File | null, File | null> | null {
    return this.form.get('cover');
  }

  add() {
    this.adding = true;
    if (!this.song.file) this.progress = 'invalid-file';
    if (!this.song.cover) this.progress = 'invalid-cover';
    this.song.title = { value: this.form.value.title };
    this.song.author = { value: this.form.value.author };
    this.songService.add(this.song);
  }

  
  onCoverUpload(target: EventTarget | null) {
    this.onUpload(target, cover => {
      this.song.cover = cover;
      this.song.coverContentType = cover.type;
    });
  }
  
  onFileUpload(target: EventTarget | null) {
    this.onUpload(target, file => {
      this.song.file = file;
      this.song.fileContentType = file.type;
    });
  }

  private onUpload(target: EventTarget | null, callback: (file: File) => void): void {
    const file = (target as HTMLInputElement)?.files?.[0];
    if (file) callback(file);
  }
}
