import { TestBed } from '@angular/core/testing';

import { TestManagerService } from './test-manager.service';

describe('TestManagerService', () => {
  let service: TestManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
