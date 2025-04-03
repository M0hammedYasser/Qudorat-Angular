import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompressiveStrengthReportComponent } from './compressive-strength-report.component';

describe('CompressiveStrengthReportComponent', () => {
  let component: CompressiveStrengthReportComponent;
  let fixture: ComponentFixture<CompressiveStrengthReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompressiveStrengthReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompressiveStrengthReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
