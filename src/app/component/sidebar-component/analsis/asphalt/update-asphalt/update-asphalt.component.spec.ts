import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAsphaltComponent } from './update-asphalt.component';

describe('UpdateAsphaltComponent', () => {
  let component: UpdateAsphaltComponent;
  let fixture: ComponentFixture<UpdateAsphaltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAsphaltComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateAsphaltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
