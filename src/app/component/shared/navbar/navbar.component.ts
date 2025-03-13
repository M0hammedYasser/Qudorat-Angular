import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {NgIf} from "@angular/common";
import {AuthenticationService} from "../../../service/authentication/authentication.service";
import {environment} from "../../../../environments/environment";
import {User} from "../../../model/user";
import {UserService} from "../../../service/user/user.service";

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
export class NavbarComponent implements OnInit {

  isLogin: boolean = false;
  id: number = 0;
  user: User = {} as User;

  constructor(private authenticationService: AuthenticationService, private userService: UserService) {
  }

  ngOnInit() {
    this.authenticationService.isAuthenticated().subscribe(status => {
      this.isLogin = status;
      this.id = Number(this.authenticationService.getUserId());
      this.userService.findById(this.id).subscribe(res => this.user = res);
    });

  }

  protected readonly environment = environment;

}
