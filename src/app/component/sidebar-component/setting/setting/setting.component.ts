import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../../../../service/authentication/authentication.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent implements OnInit {


  role : string = '';

  constructor(private auth :AuthenticationService , private router : Router) {
  }

  ngOnInit() {
    this.role = this.auth.getAuthority();
  }

}
