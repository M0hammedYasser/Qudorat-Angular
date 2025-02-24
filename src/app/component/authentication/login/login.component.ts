import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthenticationRequest} from "../../../model/authentication-request";
import {AuthenticationService} from "../../../service/authentication/authentication.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{

  auth: AuthenticationRequest = {} as AuthenticationRequest;

  constructor(private service: AuthenticationService, private router: Router) {
  }


  login() {
    this.service.signIn(this.auth).subscribe({
        next: (response) => {
          this.service.login(`Bearer ${response.token}`);
          this.router.navigateByUrl('/dashboard')
        },
        error: (err) => {
          alert(err.error.message)
        }
      }
    )
  }

}
