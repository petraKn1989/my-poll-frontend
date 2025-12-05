import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollResults } from './poll-results';

describe('PollResults', () => {
  let component: PollResults;
  let fixture: ComponentFixture<PollResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
