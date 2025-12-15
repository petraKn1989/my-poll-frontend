import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyActions } from './survey-actions';

describe('SurveyActions', () => {
  let component: SurveyActions;
  let fixture: ComponentFixture<SurveyActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
