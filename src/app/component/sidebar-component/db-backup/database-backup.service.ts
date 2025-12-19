import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BackupFile {
  fileName: string;
  fileSize: string;
  createdDate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  fileName?: string;
  backups?: T[];
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseBackupService {

  private apiUrl: string = 'http://localhost:8082/api/backup'; // Update with your backend URL

  constructor(private http: HttpClient) {
  }

  /**
   * Get all backup files from the server
   * @returns Observable of API response containing backup list
   */
  getAllBackups(): Observable<ApiResponse<BackupFile>> {
    return this.http.get<ApiResponse<BackupFile>>(`${this.apiUrl}/list`);
  }

  /**
   * Create a new database backup
   * @returns Observable of API response with backup file name
   */
  createBackup(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/create`, {});
  }

  /**
   * Restore database from a backup file
   * @param backupFileName Name of the backup file to restore
   * @returns Observable of API response
   */
  restoreBackup(backupFileName: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/restore/${backupFileName}`, {});
  }

  /**
   * Delete a backup file
   * @param backupFileName Name of the backup file to delete
   * @returns Observable of API response
   */
  deleteBackup(backupFileName: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${backupFileName}`);
  }

  /**
   * Download a backup file
   * @param backupFileName Name of the backup file to download
   */
  downloadBackup(backupFileName: string): void {
    window.open(`${this.apiUrl}/download/${backupFileName}`, '_blank');
  }

  /**
   * Update the API URL (useful for dynamic configuration)
   * @param url New API URL
   */
  setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  /**
   * Get the current API URL
   * @returns Current API URL
   */
  getApiUrl(): string {
    return this.apiUrl;
  }
}
