import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteSongButtonComponent } from './favorite-song-button.component';

describe('FavoriteSongButtonComponent', () => {
  let component: FavoriteSongButtonComponent;
  let fixture: ComponentFixture<FavoriteSongButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteSongButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavoriteSongButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
