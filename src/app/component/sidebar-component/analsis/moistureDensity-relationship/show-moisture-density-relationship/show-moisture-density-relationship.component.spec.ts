import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMoistureDensityRelationshipComponent } from './show-moisture-density-relationship.component';

describe('ShowMoistureDensityRelationshipComponent', () => {
  let component: ShowMoistureDensityRelationshipComponent;
  let fixture: ComponentFixture<ShowMoistureDensityRelationshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowMoistureDensityRelationshipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowMoistureDensityRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
