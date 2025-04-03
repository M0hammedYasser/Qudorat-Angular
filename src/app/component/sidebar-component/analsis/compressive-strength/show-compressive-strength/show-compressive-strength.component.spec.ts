import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCompressiveStrengthComponent } from './show-compressive-strength.component';

describe('ShowCompressiveStrengthComponent', () => {
  let component: ShowCompressiveStrengthComponent;
  let fixture: ComponentFixture<ShowCompressiveStrengthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowCompressiveStrengthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowCompressiveStrengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
