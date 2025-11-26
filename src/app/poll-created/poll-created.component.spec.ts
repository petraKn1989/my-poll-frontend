import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollCreatedComponent } from './poll-created.component';

describe('PollCreatedComponent', () => {
  let component: PollCreatedComponent;
  let fixture: ComponentFixture<PollCreatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollCreatedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
