import { TestBed } from '@angular/core/testing';

import { CompressiveStrengthService } from './compressive-strength.service';

describe('CompressiveStrengthService', () => {
  let service: CompressiveStrengthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompressiveStrengthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
