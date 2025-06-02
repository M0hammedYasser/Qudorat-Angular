import { TestBed } from '@angular/core/testing';

import { MoistureDensityRelationshipService } from './moisture-density-relationship.service';

describe('MoistureDensityRelationshipService', () => {
  let service: MoistureDensityRelationshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoistureDensityRelationshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
