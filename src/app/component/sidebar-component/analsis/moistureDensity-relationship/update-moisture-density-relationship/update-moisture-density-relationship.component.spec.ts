import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMoistureDensityRelationshipComponent } from './update-moisture-density-relationship.component';

describe('UpdateMoistureDensityRelationshipComponent', () => {
  let component: UpdateMoistureDensityRelationshipComponent;
  let fixture: ComponentFixture<UpdateMoistureDensityRelationshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMoistureDensityRelationshipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateMoistureDensityRelationshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
