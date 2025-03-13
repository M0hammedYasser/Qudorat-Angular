import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSandComponent } from './show-sand.component';

describe('ShowSandComponent', () => {
  let component: ShowSandComponent;
  let fixture: ComponentFixture<ShowSandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowSandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowSandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
