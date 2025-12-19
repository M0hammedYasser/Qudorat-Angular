// Example: How to integrate DbBackupComponent into your app routes

import { Routes } from '@angular/router';
import { DbBackupComponent } from './component/sidebar-component/db-backup/db-backup.component';
import { AuthGuard } from './guards/auth.guard'; // Your auth guard

/**
 * Example route configuration
 * Add this to your app.routes.ts or your module routing configuration
 */
export const databaseBackupRoute = {
  path: 'db-backup',
  component: DbBackupComponent,
  canActivate: [AuthGuard], // Optional: protect with auth guard
  data: { 
    title: 'Database Backup & Restore',
    description: 'Manage database backups, create new backups, restore, and delete existing backups'
  }
};

/**
 * Example of full routes with db-backup included
 */
export const EXAMPLE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'projects',
    component: ShowProjectComponent
  },
  {
    path: 'tests',
    component: TestComponent
  },
  {
    path: 'clients',
    component: ClientComponent
  },
  {
    path: 'users',
    component: UserComponent
  },
  {
    path: 'settings',
    component: SettingComponent
  },
  // Add the database backup route here
  {
    path: 'db-backup',
    component: DbBackupComponent,
    canActivate: [AuthGuard],
    data: { 
      title: 'Database Backup & Restore',
      roles: ['ROLE_ADMIN'] // Optional: restrict to admin role
    }
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

/**
 * Example: How to import DbBackupComponent in a module
 */
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    DbBackupComponent, // Import as standalone component
    // ... other imports
  ]
})
export class SidebarModule { }

/**
 * Example: Standalone app configuration (main.ts)
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { EXAMPLE_ROUTES } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(EXAMPLE_ROUTES),
    provideHttpClient(),
    // ... other providers
  ]
});

/**
 * Example: Navigation/Sidebar component integration
 */
export const SIDEBAR_MENU_ITEMS = [
  {
    label: 'Dashboard',
    icon: 'bi-speedometer2',
    route: '/dashboard'
  },
  {
    label: 'Projects',
    icon: 'bi-folder',
    route: '/projects'
  },
  {
    label: 'Tests',
    icon: 'bi-graph-up',
    route: '/tests'
  },
  {
    label: 'Clients',
    icon: 'bi-person-circle',
    route: '/clients'
  },
  {
    label: 'Users',
    icon: 'bi-people',
    route: '/users'
  },
  {
    label: 'Settings',
    icon: 'bi-gear',
    route: '/settings'
  },
  // Add backup menu item here
  {
    label: 'Database Backup',
    icon: 'bi-cloud-check',
    route: '/db-backup',
    requiredRole: 'ROLE_ADMIN' // Optional: show only for admins
  }
];

/**
 * Example: Navigation template
 */
// In your sidebar/navigation template (HTML):
/*
<nav class="sidebar">
  <div class="nav-item" *ngFor="let item of menuItems">
    <a [routerLink]="item.route" 
       routerLinkActive="active"
       [hidden]="!canAccessMenuItem(item)">
      <i [class]="'bi ' + item.icon"></i>
      <span>{{ item.label }}</span>
    </a>
  </div>
</nav>
*/

/**
 * Example: Navigation component TypeScript
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './service/authentication/authentication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  
  menuItems = SIDEBAR_MENU_ITEMS;
  userRole: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getAuthority();
  }

  canAccessMenuItem(item: any): boolean {
    if (!item.requiredRole) {
      return true; // No role restriction
    }
    return this.userRole === item.requiredRole;
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}

/**
 * Example: Role-based access control in guard
 */
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const userRole = this.authService.getAuthority();
    
    if (userRole === 'ROLE_ADMIN') {
      return true;
    }

    // Redirect to dashboard if not admin
    this.router.navigate(['/dashboard']);
    return false;
  }
}

/**
 * Example: Using AdminGuard for db-backup route
 */
export const PROTECTED_ROUTES: Routes = [
  {
    path: 'db-backup',
    component: DbBackupComponent,
    canActivate: [AdminGuard], // Use AdminGuard instead of AuthGuard
    data: { title: 'Database Backup & Restore' }
  }
];
