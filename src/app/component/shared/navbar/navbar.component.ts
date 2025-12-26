import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgIf } from "@angular/common";
import { AuthenticationService } from "../../../service/authentication/authentication.service";
import { environment } from "../../../../environments/environment";
import { User } from "../../../model/user";
import { UserService } from "../../../service/user/user.service";
import { NotificationService } from "../../../service/notification/notification.service";
import { interval, Subscription, switchMap } from "rxjs";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

  isLogin: boolean = false;
  id: number = 0;
  user: User = {} as User;
  notificationCount: number = 0;
  private notificationSubscription!: Subscription;


  constructor(private authenticationService: AuthenticationService,
    private userService: UserService,
    private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.authenticationService.isAuthenticated().subscribe(status => {
      this.isLogin = status;
      if (this.isLogin) {
        this.id = Number(this.authenticationService.getUserId());
        this.userService.findById(this.id).subscribe(res => this.user = res);
        this.startNotificationPolling();
      }
    });
  }

  startNotificationPolling() {
    // Initial load
    this.notificationService.count().subscribe(count => {
      this.notificationCount = count;
    });

    // Set up interval to refresh notification count every 5 seconds (less aggressive than sidebar)
    this.notificationSubscription = interval(5000)
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
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  protected readonly environment = environment;

}
