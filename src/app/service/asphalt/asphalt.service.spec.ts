import { TestBed } from '@angular/core/testing';

import { AsphaltService } from './asphalt.service';

describe('AsphaltService', () => {
  let service: AsphaltService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsphaltService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
