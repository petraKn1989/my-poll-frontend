import { TestBed } from '@angular/core/testing';

import { PollStoreService } from './poll-store';

describe('PollStore', () => {
  let service: PollStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PollStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
