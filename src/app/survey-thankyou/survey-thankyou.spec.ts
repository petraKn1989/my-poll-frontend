import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyThankyou } from './survey-thankyou';

describe('SurveyThankyou', () => {
  let component: SurveyThankyou;
  let fixture: ComponentFixture<SurveyThankyou>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyThankyou]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyThankyou);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
