import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCompressiveStrengthComponent } from './update-compressive-strength.component';

describe('UpdateCompressiveStrengthComponent', () => {
  let component: UpdateCompressiveStrengthComponent;
  let fixture: ComponentFixture<UpdateCompressiveStrengthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCompressiveStrengthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateCompressiveStrengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
