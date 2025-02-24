import {provideRouter, Routes} from '@angular/router';
import {LoginComponent} from "./component/authentication/login/login.component";
import {DashboardComponent} from "./component/sidebar-component/dashboard/dashboard.component";
import {authGuard} from "./guards/auth.guard";
import {ShowClientComponent} from "./component/sidebar-component/client/show-client/show-client.component";
import {InsertClientComponent} from "./component/sidebar-component/client/insert-client/insert-client.component";
import {UpdateClientComponent} from "./component/sidebar-component/client/update-client/update-client.component";
import {TestReportComponent} from "./component/sidebar-component/test-report/test-report.component";
import {ShowProjectComponent} from "./component/sidebar-component/project/show-project/show-project.component";
import {InsertProjectComponent} from "./component/sidebar-component/project/insert-project/insert-project.component";
import {UpdateProjectComponent} from "./component/sidebar-component/project/update-project/update-project.component";
import {TestComponent} from "./component/sidebar-component/test/test/test.component";
import {InsertTestComponent} from "./component/sidebar-component/test/insert-test/insert-test.component";
import {UpdateTestComponent} from "./component/sidebar-component/test/update-test/update-test.component";
import {TestMangerComponent} from "./component/sidebar-component/setting/test-manger/test-manger/test-manger.component";

export const routes: Routes = [

  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},

  { path: 'clients', component: ShowClientComponent, canActivate: [authGuard] },
  { path: 'clients/insert', component: InsertClientComponent, canActivate: [authGuard] },
  { path: 'clients/update/:id', component: UpdateClientComponent, canActivate: [authGuard] },

  { path: 'projects', component: ShowProjectComponent, canActivate: [authGuard] },
  { path: 'projects/insert', component: InsertProjectComponent, canActivate: [authGuard] },
  { path: 'projects/update/:id', component: UpdateProjectComponent, canActivate: [authGuard] },

  { path: 'tests', component: TestComponent, canActivate: [authGuard] },
  { path: 'tests/insert', component: InsertTestComponent, canActivate: [authGuard] },
  { path: 'tests/update/:id', component: UpdateTestComponent, canActivate: [authGuard] },

  {path: 'report', component: TestReportComponent, canActivate: [authGuard]},



  {path: 'setting/test-manager', component: TestMangerComponent, canActivate: [authGuard]},

  {path: '**', redirectTo: 'login'},
];
export const appRouterProviders = [provideRouter(routes)];
