import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertTestComponent } from './insert-test.component';

describe('InsertTestComponent', () => {
  let component: InsertTestComponent;
  let fixture: ComponentFixture<InsertTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsertTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
