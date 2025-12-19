import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbBackupComponent } from './db-backup.component';

describe('DbBackupComponent', () => {
  let component: DbBackupComponent;
  let fixture: ComponentFixture<DbBackupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbBackupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DbBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
