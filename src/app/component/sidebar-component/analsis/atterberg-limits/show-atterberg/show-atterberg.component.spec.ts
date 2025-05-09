import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAtterbergComponent } from './show-atterberg.component';

describe('ShowAtterbergComponent', () => {
  let component: ShowAtterbergComponent;
  let fixture: ComponentFixture<ShowAtterbergComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowAtterbergComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowAtterbergComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
