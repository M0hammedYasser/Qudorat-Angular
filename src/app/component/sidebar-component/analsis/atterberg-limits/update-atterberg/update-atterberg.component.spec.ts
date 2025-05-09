import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAtterbergComponent } from './update-atterberg.component';

describe('UpdateAtterbergComponent', () => {
  let component: UpdateAtterbergComponent;
  let fixture: ComponentFixture<UpdateAtterbergComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAtterbergComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateAtterbergComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
