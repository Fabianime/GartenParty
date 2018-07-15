import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultDisplaySpotifyComponent } from './result-display-spotify.component';

describe('ResultDisplaySpotifyComponent', () => {
  let component: ResultDisplaySpotifyComponent;
  let fixture: ComponentFixture<ResultDisplaySpotifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultDisplaySpotifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultDisplaySpotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
