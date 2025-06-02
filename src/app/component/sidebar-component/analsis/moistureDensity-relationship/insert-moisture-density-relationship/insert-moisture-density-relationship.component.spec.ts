import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertMoistureDensityRelationshipComponent } from './insert-moisture-density-relationship.component';

describe('InsertMoistureDensityRelationshipComponent', () => {
  let component: InsertMoistureDensityRelationshipComponent;
  let fixture: ComponentFixture<InsertMoistureDensityRelationshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertMoistureDensityRelationshipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InsertMoistureDensityRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
