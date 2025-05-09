import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertAtterbergComponent } from './insert-atterberg.component';

describe('InsertAtterbergComponent', () => {
  let component: InsertAtterbergComponent;
  let fixture: ComponentFixture<InsertAtterbergComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertAtterbergComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsertAtterbergComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
