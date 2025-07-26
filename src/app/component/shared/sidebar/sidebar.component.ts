import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthenticationService} from "../../../service/authentication/authentication.service";
import {NgIf} from "@angular/common";
import {NotificationService} from "../../../service/notification/notification.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        NgIf
    ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  role : string = '';
  notificationCount: number = 0;

  constructor(private authenticationService: AuthenticationService,private notificationService : NotificationService,
              private router: Router, private routerLink: Router) {
  }

  ngOnInit() {
    this.role = this.authenticationService.getAuthority();
    this.notificationService.count().subscribe(count => {this.notificationCount = count;});
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }


}
