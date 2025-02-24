import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from "./component/shared/navbar/navbar.component";
import {SidebarComponent} from "./component/shared/sidebar/sidebar.component";
import {AuthenticationService} from "./service/authentication/authentication.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Qudorat';
  isLogin: boolean = false;

  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.authenticationService.isAuthenticated().subscribe(status => {
      this.isLogin = status;
    });
  }
}
