import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectInvoiceComponent } from './project-invoice.component';

describe('ProjectInvoiceComponent', () => {
  let component: ProjectInvoiceComponent;
  let fixture: ComponentFixture<ProjectInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectInvoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
