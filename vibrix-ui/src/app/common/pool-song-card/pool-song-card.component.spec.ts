import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolSongCardComponent } from './pool-song-card.component';

describe('PoolSongCardComponent', () => {
  let component: PoolSongCardComponent;
  let fixture: ComponentFixture<PoolSongCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoolSongCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoolSongCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
