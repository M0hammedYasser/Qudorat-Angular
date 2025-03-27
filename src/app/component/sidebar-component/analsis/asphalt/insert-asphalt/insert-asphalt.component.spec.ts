import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertAsphaltComponent } from './insert-asphalt.component';

describe('InsertAsphaltComponent', () => {
  let component: InsertAsphaltComponent;
  let fixture: ComponentFixture<InsertAsphaltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertAsphaltComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsertAsphaltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
