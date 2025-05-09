import { TestBed } from '@angular/core/testing';

import { AtterbergLimitsService } from './atterberg-limits.service';

describe('AtterbergLimitsService', () => {
  let service: AtterbergLimitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtterbergLimitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
