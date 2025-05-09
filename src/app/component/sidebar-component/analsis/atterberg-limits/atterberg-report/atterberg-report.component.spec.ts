import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtterbergReportComponent } from './atterberg-report.component';

describe('AtterbergReportComponent', () => {
  let component: AtterbergReportComponent;
  let fixture: ComponentFixture<AtterbergReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtterbergReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AtterbergReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
