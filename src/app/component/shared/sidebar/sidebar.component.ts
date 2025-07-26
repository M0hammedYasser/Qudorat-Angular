import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthenticationService} from "../../../service/authentication/authentication.service";
import {NgIf} from "@angular/common";
import {NotificationService} from "../../../service/notification/notification.service";
import {interval, Subscription, switchMap} from "rxjs";

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
export class SidebarComponent implements OnInit , OnDestroy {

  role: string = '';
  notificationCount: number = 0;
  private notificationSubscription!: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.role = this.authenticationService.getAuthority();

    // Set up interval to refresh notification count every 1 seconds
    this.notificationSubscription = interval(1000) // 1000ms = 1 seconds
      .pipe(
        switchMap(() => this.notificationService.count())
      )
      .subscribe(
        count => {
          this.notificationCount = count;
        },
        error => {
          console.error('Error fetching notification count:', error);
        }
      );

    // Initial load
    this.notificationService.count().subscribe(count => {
      this.notificationCount = count;
    });
  }

  ngOnDestroy() {
    // Clean up the subscription when component is destroyed
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }


}
