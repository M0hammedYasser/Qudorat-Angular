import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSandComponent } from './update-sand.component';

describe('UpdateSandComponent', () => {
  let component: UpdateSandComponent;
  let fixture: ComponentFixture<UpdateSandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSandComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateSandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
