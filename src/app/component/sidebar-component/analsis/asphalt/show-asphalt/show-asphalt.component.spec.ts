import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAsphaltComponent } from './show-asphalt.component';

describe('ShowAsphaltComponent', () => {
  let component: ShowAsphaltComponent;
  let fixture: ComponentFixture<ShowAsphaltComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowAsphaltComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowAsphaltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
