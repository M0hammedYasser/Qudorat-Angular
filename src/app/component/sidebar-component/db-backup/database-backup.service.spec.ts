import { TestBed } from '@angular/core/testing';

import { DatabaseBackupService } from './database-backup.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DatabaseBackupService', () => {
  let service: DatabaseBackupService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DatabaseBackupService]
    });
    service = TestBed.inject(DatabaseBackupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all backups', () => {
    const mockBackups = {
      success: true,
      count: 2,
      backups: [
        { fileName: 'backup_1.sql', fileSize: '100MB', createdDate: '2025-01-14' },
        { fileName: 'backup_2.sql', fileSize: '150MB', createdDate: '2025-01-13' }
      ]
    };

    service.getAllBackups().subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.count).toBe(2);
      expect(response.backups?.length).toBe(2);
    });

    const req = httpMock.expectOne(`${service.getApiUrl()}/list`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBackups);
  });

  it('should create a backup', () => {
    const mockResponse = {
      success: true,
      message: 'Database backup created successfully',
      fileName: 'backup_20250114_120000.sql'
    };

    service.createBackup().subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.fileName).toBe('backup_20250114_120000.sql');
    });

    const req = httpMock.expectOne(`${service.getApiUrl()}/create`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should restore a backup', () => {
    const backupFileName = 'backup_20250114_120000.sql';
    const mockResponse = {
      success: true,
      message: 'Database restored successfully from: ' + backupFileName
    };

    service.restoreBackup(backupFileName).subscribe(response => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${service.getApiUrl()}/restore/${backupFileName}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should delete a backup', () => {
    const backupFileName = 'backup_20250114_120000.sql';
    const mockResponse = {
      success: true,
      message: 'Backup file deleted successfully: ' + backupFileName
    };

    service.deleteBackup(backupFileName).subscribe(response => {
      expect(response.success).toBe(true);
    });

    const req = httpMock.expectOne(`${service.getApiUrl()}/${backupFileName}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should set and get API URL', () => {
    const newUrl = 'http://newserver:8080/api/backup';
    service.setApiUrl(newUrl);
    expect(service.getApiUrl()).toBe(newUrl);
  });

  it('should handle error response', () => {
    const mockErrorResponse = {
      success: false,
      message: 'Error creating backup'
    };

    service.createBackup().subscribe({
      next: (response) => {
        expect(response.success).toBe(false);
      }
    });

    const req = httpMock.expectOne(`${service.getApiUrl()}/create`);
    req.flush(mockErrorResponse);
  });
});
