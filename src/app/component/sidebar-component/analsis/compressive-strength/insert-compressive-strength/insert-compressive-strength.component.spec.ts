import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertCompressiveStrengthComponent } from './insert-compressive-strength.component';

describe('InsertCompressiveStrengthComponent', () => {
  let component: InsertCompressiveStrengthComponent;
  let fixture: ComponentFixture<InsertCompressiveStrengthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertCompressiveStrengthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsertCompressiveStrengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
