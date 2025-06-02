import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoistureDensityRelationshipReportComponent } from './moisture-density-relationship-report.component';

describe('MoistureDensityRelationshipReportComponent', () => {
  let component: MoistureDensityRelationshipReportComponent;
  let fixture: ComponentFixture<MoistureDensityRelationshipReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoistureDensityRelationshipReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoistureDensityRelationshipReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
