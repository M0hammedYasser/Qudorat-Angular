import {Component} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthenticationService} from "../../../service/authentication/authentication.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(private authenticationService: AuthenticationService, private router: Router, private routerLink: Router) {
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }


}
