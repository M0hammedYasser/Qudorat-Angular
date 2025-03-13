import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertSandComponent } from './insert-sand.component';

describe('InsertSandComponent', () => {
  let component: InsertSandComponent;
  let fixture: ComponentFixture<InsertSandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertSandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsertSandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
