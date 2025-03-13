import { TestBed } from '@angular/core/testing';

import { SieveAnalysisService } from './sieve-analysis.service';

describe('SieveAnalysisService', () => {
  let service: SieveAnalysisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SieveAnalysisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
