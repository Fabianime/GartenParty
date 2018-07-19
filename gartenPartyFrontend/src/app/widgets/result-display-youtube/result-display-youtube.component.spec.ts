import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultDisplayYoutubeComponent } from './result-display-youtube.component';

describe('ResultDisplayYoutubeComponent ', () => {
  let component: ResultDisplayYoutubeComponent ;
  let fixture: ComponentFixture<ResultDisplayYoutubeComponent >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultDisplayYoutubeComponent  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultDisplayYoutubeComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
