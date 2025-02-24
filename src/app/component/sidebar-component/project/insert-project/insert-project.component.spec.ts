import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertProjectComponent } from './insert-project.component';

describe('InsertProjectComponent', () => {
  let component: InsertProjectComponent;
  let fixture: ComponentFixture<InsertProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertProjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsertProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
