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
import {InsertSandComponent} from "./component/sidebar-component/analsis/sand/insert-sand/insert-sand.component";
import {ShowSandComponent} from "./component/sidebar-component/analsis/sand/show-sand/show-sand.component";
import {UpdateSandComponent} from "./component/sidebar-component/analsis/sand/update-sand/update-sand.component";
import {SandReportComponent} from "./component/sidebar-component/analsis/sand/sand-report/sand-report.component";
import {ProjectInvoiceComponent} from "./component/sidebar-component/project/project-invoice/project-invoice.component";
import {SettingComponent} from "./component/sidebar-component/setting/setting/setting.component";
import {UserManagerComponent} from "./component/sidebar-component/setting/user/user-manager/user-manager.component";
import {InsertUserComponent} from "./component/sidebar-component/setting/user/insert-user/insert-user.component";
import {ProfileComponent} from "./component/shared/profile/profile.component";
import {UpdateUserComponent} from "./component/sidebar-component/setting/user/update-user/update-user.component";
import {HelpComponent} from "./component/sidebar-component/help/help.component";
import {ShowAsphaltComponent} from "./component/sidebar-component/analsis/asphalt/show-asphalt/show-asphalt.component";
import {
  InsertAsphaltComponent
} from "./component/sidebar-component/analsis/asphalt/insert-asphalt/insert-asphalt.component";
import {
  UpdateAsphaltComponent
} from "./component/sidebar-component/analsis/asphalt/update-asphalt/update-asphalt.component";
import {
  AsphaltReportComponent
} from "./component/sidebar-component/analsis/asphalt/asphalt-report/asphalt-report.component";

export const routes: Routes = [


  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},

  { path: 'clients', component: ShowClientComponent, canActivate: [authGuard] },
  { path: 'clients/insert', component: InsertClientComponent, canActivate: [authGuard] },
  { path: 'clients/update/:id', component: UpdateClientComponent, canActivate: [authGuard] },

  { path: 'projects', component: ShowProjectComponent, canActivate: [authGuard] },
  { path: 'projects/insert', component: InsertProjectComponent, canActivate: [authGuard] },
  { path: 'projects/update/:id', component: UpdateProjectComponent, canActivate: [authGuard] },
  { path: 'projects/invoice/:id', component: ProjectInvoiceComponent, canActivate: [authGuard] },

  { path: 'tests', component: TestComponent, canActivate: [authGuard] },
  { path: 'tests/insert', component: InsertTestComponent, canActivate: [authGuard] },
  { path: 'tests/update/:id', component: UpdateTestComponent, canActivate: [authGuard] },

  { path: 'sands/:id', component: ShowSandComponent, canActivate: [authGuard] },
  { path: 'sands/insert/:id', component: InsertSandComponent, canActivate: [authGuard] },
  { path: 'sands/update/:id', component: UpdateSandComponent, canActivate: [authGuard] },
  { path: 'sands/report/:id', component: SandReportComponent, canActivate: [authGuard] },

  { path: 'asphalt/:id', component: ShowAsphaltComponent, canActivate: [authGuard] },
  { path: 'asphalt/insert/:id', component: InsertAsphaltComponent, canActivate: [authGuard] },
  { path: 'asphalt/update/:id', component: UpdateAsphaltComponent, canActivate: [authGuard] },
  { path: 'asphalt/report/:id', component: AsphaltReportComponent, canActivate: [authGuard] },

  {path: 'report', component: TestReportComponent, canActivate: [authGuard]},


  {path: 'setting', component: SettingComponent, canActivate: [authGuard]},
  {path: 'setting/test-manager', component: TestMangerComponent, canActivate: [authGuard]},
  {path: 'setting/user-manager', component: UserManagerComponent, canActivate: [authGuard]},
  {path: 'setting/user-manager/insert', component: InsertUserComponent, canActivate: [authGuard]},
  {path: 'setting/user-manager/update/:id', component: UpdateUserComponent, canActivate: [authGuard]},


  {path: 'help', component: HelpComponent, canActivate: [authGuard]},

  {path: '**', redirectTo: 'login'},
];
export const appRouterProviders = [provideRouter(routes)];
