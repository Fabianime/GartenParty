import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckRoutComponent } from './check-rout.component';

describe('CheckRoutComponent  ', () => {
  let component: CheckRoutComponent  ;
  let fixture: ComponentFixture<CheckRoutComponent  >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckRoutComponent   ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckRoutComponent  );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
