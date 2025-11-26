import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillPoll } from './fill-poll';

describe('FillPoll', () => {
  let component: FillPoll;
  let fixture: ComponentFixture<FillPoll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FillPoll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FillPoll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
