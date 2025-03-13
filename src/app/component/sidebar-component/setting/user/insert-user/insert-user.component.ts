import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Authority} from "../../../../../model/authority";
import {User} from "../../../../../model/user";
import {UserService} from "../../../../../service/user/user.service";
import {Router} from "@angular/router";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-insert-user',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './insert-user.component.html',
  styleUrl: './insert-user.component.css'
})
export class InsertUserComponent implements OnInit {

  user: User = {authority: {}} as User;
  authorities: Authority[] = [];


  constructor(private userService: UserService , private router: Router) {
  }

  ngOnInit() {
    this.userService.findAllAuthority().subscribe(res=>this.authorities = res);
  }

  insert(): void {
      this.userService.insert(this.user).subscribe( ()=> {
        this.router.navigate(['/setting/user-manager']);
      })
  }



}
