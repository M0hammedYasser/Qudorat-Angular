import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsphaltReportComponent } from './asphalt-report.component';

describe('AsphaltReportComponent', () => {
  let component: AsphaltReportComponent;
  let fixture: ComponentFixture<AsphaltReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsphaltReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsphaltReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
