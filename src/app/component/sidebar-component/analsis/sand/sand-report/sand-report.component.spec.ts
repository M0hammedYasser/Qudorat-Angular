import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SandReportComponent } from './sand-report.component';

describe('SandReportComponent', () => {
  let component: SandReportComponent;
  let fixture: ComponentFixture<SandReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SandReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SandReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
