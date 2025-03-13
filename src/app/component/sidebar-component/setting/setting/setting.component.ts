import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
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

  constructor(private auth :AuthenticationService) {
  }

  ngOnInit() {
    this.role = this.auth.getAuthority();
    console.log(this.role);
  }

}
