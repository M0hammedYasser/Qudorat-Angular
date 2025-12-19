# Database Backup Component - Implementation Guide

## Overview
This Angular component provides a complete UI for managing database backups, including:
- ✅ View all available backups
- ✅ Create new backups
- ✅ Restore from backups
- ✅ Download backup files
- ✅ Delete backups

## Prerequisites

### Frontend Dependencies
The component uses Angular 17+ with the following already installed in your project:
- `@angular/common` - CommonModule for directives
- `@angular/core` - Core Angular features
- `sweetalert2` - Beautiful alerts for user confirmations
- `bootstrap` - Styling support

### Backend API
The component expects the following REST API endpoints:

```
GET  /api/backup/list              - Get all backups
POST /api/backup/create            - Create a new backup
POST /api/backup/restore/{fileName} - Restore from backup
GET  /api/backup/download/{fileName} - Download backup file
DELETE /api/backup/{fileName}      - Delete a backup
```

## Configuration

### 1. Update API URL
In `db-backup.component.ts`, update the `apiUrl` property to match your backend server:

```typescript
apiUrl: string = 'http://localhost:8080/api/backup'; // Update this URL
```

### 2. API Response Format
The backend must return responses in the following format:

**Create Backup Response:**
```json
{
  "success": true,
  "message": "Database backup created successfully",
  "fileName": "backup_20250114_120000.sql"
}
```

**List Backups Response:**
```json
{
  "success": true,
  "count": 5,
  "backups": [
    {
      "fileName": "backup_20250114_120000.sql",
      "fileSize": "125.45 MB",
      "createdDate": "2025-01-14 12:00:00"
    }
  ]
}
```

**Restore Backup Response:**
```json
{
  "success": true,
  "message": "Database restored successfully from: backup_20250114_120000.sql"
}
```

**Delete Backup Response:**
```json
{
  "success": true,
  "message": "Backup file deleted successfully: backup_20250114_120000.sql"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

## Features

### 1. Backup Display
- Shows all available backups in a responsive table
- Displays file name, size, and creation date
- Empty state message when no backups exist
- Loading spinner during data fetch

### 2. Create Backup
- One-click backup creation
- Confirmation dialog to prevent accidental triggers
- Loading state prevents multiple simultaneous creations
- Success notification with file name

### 3. Restore Database
- Select backup file to restore
- Double confirmation warning about data overwrite
- Clear visual warning about potential data loss
- Success notification after restore

### 4. Download Backup
- Direct download of backup file
- Opens in new tab/window

### 5. Delete Backup
- Confirmation dialog before deletion
- Prevents accidental deletion
- Immediate list refresh after deletion

### 6. Security Features
- Directory traversal validation (backend handles `..`, `/`, `\`)
- CORS-aware API calls
- HttpInterceptor compatible for authentication tokens

## Styling

The component follows your project's design system with:
- Bootstrap integration for basic styling
- Custom CSS for enhanced UI
- Responsive design (mobile, tablet, desktop)
- Consistent color scheme with your project
- Icon integration (Bootstrap Icons)

### Color Scheme
- Primary: `#0d6efd` (Blue)
- Success: `#198754` (Green)
- Warning: `#ffc107` (Yellow)
- Danger: `#dc3545` (Red)
- Info: `#0dcaf0` (Cyan)

## Component Structure

```
db-backup.component.ts       - Component logic and API calls
db-backup.component.html     - Template and UI layout
db-backup.component.css      - Styling
```

## Usage in App

The component is standalone, so you can import it directly:

```typescript
import { DbBackupComponent } from './path/to/db-backup.component';

// In your route configuration
{
  path: 'db-backup',
  component: DbBackupComponent
}

// Or in your template
<app-db-backup></app-db-backup>
```

## Backend Controller Implementation

The component is designed to work with the Spring Boot controller provided:

```java
@RestController
@RequestMapping("/api/backup")
@RequiredArgsConstructor
public class DatabaseBackupController {
    // All methods are already compatible
}
```

## Error Handling

The component handles various error scenarios:
- Network errors
- Server errors (5xx)
- Validation errors (4xx)
- Timeout scenarios
- User cancellations

All errors are displayed using SweetAlert2 with clear, user-friendly messages.

## Performance Considerations

- Loading states prevent duplicate API calls
- Lazy loading of backup list on component init
- Debounced delete operations
- Efficient change detection with OnPush strategy ready

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- Semantic HTML structure
- ARIA labels on buttons
- Keyboard navigation support
- Clear visual feedback for all actions
- High contrast colors for readability

## Known Limitations

1. File download requires backend `/download` endpoint implementation
2. Large backups may take time to process
3. Concurrent backup operations not supported
4. Backup list requires manual refresh after restore/delete

## Future Enhancements

- [ ] Add search/filter functionality
- [ ] Add pagination for large backup lists
- [ ] Add backup scheduling
- [ ] Add backup compression options
- [ ] Add backup encryption
- [ ] Add incremental backups
- [ ] Export backup list as CSV/PDF

## Troubleshooting

### API Connection Failed
- Check backend server is running
- Verify API URL in component
- Check CORS settings in backend

### Backups Not Loading
- Check network tab in browser dev tools
- Verify backend endpoint returns correct format
- Check backend permissions

### Download Not Working
- Ensure `/download` endpoint is implemented
- Check file permissions on server
- Verify response content-type headers

## Support

For issues or questions, refer to:
1. Backend Spring Boot controller implementation
2. Component inline documentation
3. Project README
