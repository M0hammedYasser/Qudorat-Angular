import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestMangerComponent } from './test-manger.component';

describe('TestMangerComponent', () => {
  let component: TestMangerComponent;
  let fixture: ComponentFixture<TestMangerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestMangerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestMangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
