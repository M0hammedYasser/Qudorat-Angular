import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import Swal from 'sweetalert2';
import { DatabaseBackupService, BackupFile } from './database-backup.service';

@Component({
  selector: 'app-db-backup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './db-backup.component.html',
  styleUrl: './db-backup.component.css'
})
export class DbBackupComponent implements OnInit {

  backups: BackupFile[] = [];
  isLoading: boolean = false;
  isCreatingBackup: boolean = false;
  backupCount: number = 0;

  constructor(private backupService: DatabaseBackupService) {
  }

  ngOnInit() {
    this.loadBackups();
  }

  /**
   * Load all backup files from the server
   */
  loadBackups() {
    this.isLoading = true;
    this.backupService.getAllBackups().subscribe({
      next: (response) => {
        if (response.success) {
          this.backups = response.backups || [];
          this.backupCount = response.count || 0;
        } else {
          Swal.fire('Error', response.message || 'Failed to load backups', 'error');
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading backups:', error);
        Swal.fire('Error', 'Failed to load backup files', 'error');
        this.isLoading = false;
      }
    });
  }

  /**
   * Create a new database backup
   */
  createBackup() {
    Swal.fire({
      title: 'Create Backup',
      text: 'Are you sure you want to create a new database backup?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Create'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isCreatingBackup = true;
        this.backupService.createBackup().subscribe({
          next: (response) => {
            this.isCreatingBackup = false;
            if (response.success) {
              Swal.fire('Success', response.message || 'Database backup created successfully!', 'success');
              this.loadBackups();
            } else {
              Swal.fire('Error', response.message || 'Failed to create backup', 'error');
            }
          },
          error: (error) => {
            this.isCreatingBackup = false;
            console.error('Error creating backup:', error);
            const errorMessage = error.error?.message || error.message || 'Failed to create backup';
            Swal.fire('Error', 'Failed to create backup: ' + errorMessage, 'error');
          }
        });
      }
    });
  }

  /**
   * Restore database from a backup file
   * @param backupFileName Name of the backup file
   */
  restoreBackup(backupFileName: string) {
    Swal.fire({
      title: 'Restore Backup',
      html: `Are you sure you want to restore the database from:<br><strong>${backupFileName}</strong>?<br><span style="color: red; font-size: 12px;">This will overwrite all current data!</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Restore',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.backupService.restoreBackup(backupFileName).subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response.success) {
              Swal.fire('Success', response.message || 'Database restored successfully!', 'success');
              this.loadBackups();
            } else {
              Swal.fire('Error', response.message || 'Failed to restore backup', 'error');
            }
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error restoring backup:', error);
            const errorMessage = error.error?.message || error.message || 'Failed to restore backup';
            Swal.fire('Error', 'Failed to restore backup: ' + errorMessage, 'error');
          }
        });
      }
    });
  }

  /**
   * Delete a backup file
   * @param backupFileName Name of the backup file
   */
  deleteBackup(backupFileName: string) {
    Swal.fire({
      title: 'Delete Backup',
      text: `Are you sure you want to delete the backup "${backupFileName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.backupService.deleteBackup(backupFileName).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire('Deleted', response.message || 'Backup file deleted successfully!', 'success');
              this.loadBackups();
            } else {
              Swal.fire('Error', response.message || 'Failed to delete backup', 'error');
            }
          },
          error: (error) => {
            console.error('Error deleting backup:', error);
            const errorMessage = error.error?.message || error.message || 'Failed to delete backup';
            Swal.fire('Error', 'Failed to delete backup: ' + errorMessage, 'error');
          }
        });
      }
    });
  }

  /**
   * Download a backup file
   * @param backupFileName Name of the backup file
   */
  downloadBackup(backupFileName: string) {
    this.backupService.downloadBackup(backupFileName);
  }
}
