# Database Backup Component - Integration Guide

## Quick Start

### 1. Component Files Created
```
src/app/component/sidebar-component/db-backup/
├── db-backup.component.ts           # Main component logic
├── db-backup.component.html         # Template
├── db-backup.component.css          # Styles
├── db-backup.component.spec.ts      # Component tests
├── database-backup.service.ts       # Service for API calls
├── database-backup.service.spec.ts  # Service tests
└── README.md                         # Detailed documentation
```

### 2. Add to Your Routes

Update your `app.routes.ts`:

```typescript
import { DbBackupComponent } from './component/sidebar-component/db-backup/db-backup.component';

export const routes: Routes = [
  // ... other routes
  {
    path: 'db-backup',
    component: DbBackupComponent
  }
];
```

### 3. Update Navigation/Sidebar

Add the route link in your sidebar navigation:

```html
<a routerLink="/db-backup" routerLinkActive="active">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" 
       class="bi bi-cloud-check" viewBox="0 0 16 16">
    <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
    <path d="M8 1a4.5 4.5 0 0 0-4.416 3.15H2.5A2.5 2.5 0 0 0 0 6.5V14a2.5 2.5 0 0 0 2.5 2.5h11a2.5 2.5 0 0 0 2.5-2.5v-7.5A4.5 4.5 0 0 0 8 1zm4.5 7H8V4a3 3 0 0 1 4.5 2.707z"/>
  </svg>
  Database Backup
</a>
```

### 4. Configure Backend API URL

In `database-backup.service.ts`, update the API URL:

```typescript
private apiUrl: string = 'http://localhost:8080/api/backup'; // Update this
```

Or set it dynamically:

```typescript
// In your app initialization/config service
this.backupService.setApiUrl(environment.apiUrl + '/backup');
```

### 5. Ensure HttpClientModule is Imported

Your main component or app config must have `HttpClientModule`:

```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule, /* other imports */],
})
export class AppComponent { }

// Or in standalone mode:
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    // ... other providers
  ]
});
```

## Backend Setup

### Spring Boot Controller Implementation

Use the provided controller:

```java
@RestController
@RequestMapping("/api/backup")
@RequiredArgsConstructor
public class DatabaseBackupController {

    private final DatabaseBackupService backupService;

    @PostMapping("/create")
    public ResponseEntity<?> createBackup() { /* ... */ }

    @GetMapping("/list")
    public ResponseEntity<?> getAllBackups() { /* ... */ }

    @PostMapping("/restore/{backupFileName}")
    public ResponseEntity<?> restoreBackup(@PathVariable String backupFileName) { /* ... */ }

    @GetMapping("/download/{backupFileName}")
    public ResponseEntity<?> downloadBackup(@PathVariable String backupFileName) { /* ... */ }

    @DeleteMapping("/{backupFileName}")
    public ResponseEntity<?> deleteBackup(@PathVariable String backupFileName) { /* ... */ }
}
```

### Service Implementation Example

```java
@Service
@RequiredArgsConstructor
public class DatabaseBackupService {

    private final JdbcTemplate jdbcTemplate;
    private final Environment env;

    public String createBackup() throws IOException, InterruptedException {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String backupFileName = "backup_" + timestamp + ".sql";
        
        // Use mysqldump or similar command
        ProcessBuilder pb = new ProcessBuilder(
            "mysqldump",
            "-u", env.getProperty("spring.datasource.username"),
            "-p" + env.getProperty("spring.datasource.password"),
            getDatabaseName()
        );
        
        // Redirect output to file
        File backupFile = new File("backups/" + backupFileName);
        pb.redirectOutput(backupFile);
        Process process = pb.start();
        process.waitFor();
        
        return backupFileName;
    }

    public List<Map<String, String>> getAllBackupFiles() {
        List<Map<String, String>> backups = new ArrayList<>();
        File backupDir = new File("backups");
        
        if (backupDir.exists() && backupDir.isDirectory()) {
            for (File file : backupDir.listFiles()) {
                Map<String, String> backup = new HashMap<>();
                backup.put("fileName", file.getName());
                backup.put("fileSize", formatFileSize(file.length()));
                backup.put("createdDate", 
                    new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
                    .format(file.lastModified())
                );
                backups.add(backup);
            }
        }
        
        return backups;
    }

    public void restoreBackup(String backupFileName) throws IOException, InterruptedException {
        ProcessBuilder pb = new ProcessBuilder(
            "mysql",
            "-u", env.getProperty("spring.datasource.username"),
            "-p" + env.getProperty("spring.datasource.password"),
            getDatabaseName()
        );
        
        File backupFile = new File("backups/" + backupFileName);
        pb.redirectInput(backupFile);
        Process process = pb.start();
        process.waitFor();
    }

    public void deleteBackup(String backupFileName) throws IOException {
        File backupFile = new File("backups/" + backupFileName);
        if (backupFile.exists()) {
            Files.delete(backupFile.toPath());
        }
    }

    public ResponseEntity<Resource> downloadBackup(String backupFileName) throws IOException {
        File backupFile = new File("backups/" + backupFileName);
        Resource resource = new FileSystemResource(backupFile);
        
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION, 
                "attachment; filename=\"" + backupFileName + "\"")
            .body(resource);
    }

    private String getDatabaseName() {
        // Extract from datasource URL
        String url = env.getProperty("spring.datasource.url");
        return url.substring(url.lastIndexOf("/") + 1);
    }

    private String formatFileSize(long bytes) {
        if (bytes <= 0) return "0 B";
        final String[] units = new String[]{"B", "KB", "MB", "GB"};
        int digitGroups = (int) (Math.log10(bytes) / Math.log10(1024));
        return new DecimalFormat("#,##0.##")
            .format(bytes / Math.pow(1024, digitGroups)) 
            + " " + units[digitGroups];
    }
}
```

## Features Overview

### 1. View Backups
- Display all available backups in a table
- Shows file name, size, and creation date
- Responsive design for all screen sizes
- Empty state when no backups exist

### 2. Create Backup
- One-click backup creation
- Confirmation dialog
- Loading indicator during creation
- Success notification with file name

### 3. Restore Backup
- Select backup file from list
- Double confirmation with data loss warning
- Loading state during restore
- Success notification

### 4. Download Backup
- Direct download capability
- Opens in new tab/window
- Works with file system or cloud storage

### 5. Delete Backup
- Confirmation before deletion
- Prevents accidental deletion
- Immediate list refresh

## API Integration Details

### Response Format Requirements

All API responses must follow this format:

```json
{
  "success": true|false,
  "message": "Optional message",
  "count": 0,
  "backups": [
    {
      "fileName": "backup_20250114_120000.sql",
      "fileSize": "125.45 MB",
      "createdDate": "2025-01-14 12:00:00"
    }
  ]
}
```

### API Endpoints Required

1. **GET /api/backup/list**
   - Returns all backups
   - Response: `{ success, count, backups }`

2. **POST /api/backup/create**
   - Creates new backup
   - Response: `{ success, message, fileName }`

3. **POST /api/backup/restore/{fileName}**
   - Restores from backup
   - Response: `{ success, message }`

4. **DELETE /api/backup/{fileName}**
   - Deletes backup
   - Response: `{ success, message }`

5. **GET /api/backup/download/{fileName}**
   - Downloads backup file
   - Response: File content (binary)

## Error Handling

Component handles all error scenarios:
- Network errors
- Server errors (5xx)
- Validation errors (4xx)
- Connection timeouts
- User cancellations

Errors are displayed using SweetAlert2 with clear messages.

## Security Considerations

1. **Directory Traversal Prevention**
   - Backend validates file names (no `..`, `/`, `\`)
   - Component passes only file names, not paths

2. **CORS Configuration**
   - Ensure backend allows frontend origin
   - Configure CORS in Spring Boot:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:4200")
                    .allowedMethods("GET", "POST", "DELETE", "PUT")
                    .allowCredentials(true);
            }
        };
    }
}
```

3. **Authentication**
   - Add JWT interceptor if needed
   - Protect backup endpoints with roles:

```java
@PostMapping("/create")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> createBackup() { }
```

4. **File Permissions**
   - Ensure backup directory is protected
   - Restrict access to authorized users

## Styling Customization

### Change Colors

Update colors in `db-backup.component.css`:

```css
/* Primary color */
--primary: #0d6efd;

/* Success color */
--success: #198754;

/* Danger color */
--danger: #dc3545;

/* Warning color */
--warning: #ffc107;
```

### Customize Layout

Modify CSS classes:

```css
.page-title { font-size: 28px; } /* Change title size */
.stats-card { background: #667eea; } /* Change card color */
.table-responsive { max-height: 600px; } /* Change table height */
```

## Testing

### Run Unit Tests

```bash
ng test
```

### Run Specific Test

```bash
ng test --include='**/db-backup.component.spec.ts'
ng test --include='**/database-backup.service.spec.ts'
```

## Troubleshooting

### Issue: "Failed to load backup files"
- Check backend is running
- Verify API URL in service
- Check browser console for network errors

### Issue: "CORS error"
- Configure CORS in Spring Boot
- Verify allowed origins

### Issue: Backup doesn't appear
- Check file was created in backup directory
- Verify getAllBackupFiles() returns data
- Check file permissions

### Issue: Download not working
- Implement `/download` endpoint
- Check file exists in backup directory
- Verify response headers (Content-Type, Content-Disposition)

## Performance Tips

1. **Large Backup Lists**
   - Add pagination to `getAllBackupFiles()`
   - Implement lazy loading

2. **Large Backups**
   - Show progress bar during create/restore
   - Consider background processing

3. **Network Issues**
   - Add timeout settings
   - Implement retry logic

## Future Enhancements

- [ ] Backup scheduling
- [ ] Incremental backups
- [ ] Backup encryption
- [ ] Backup compression
- [ ] Cloud storage support
- [ ] Backup verification
- [ ] Restore progress indicator
- [ ] Backup search/filter

## Support

For issues, check:
1. Backend logs for errors
2. Browser dev tools network tab
3. Component console errors
4. API response format

## License

Same as Qudorat project
