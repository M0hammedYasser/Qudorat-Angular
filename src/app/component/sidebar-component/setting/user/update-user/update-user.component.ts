import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {User} from "../../../../../model/user";
import {Authority} from "../../../../../model/authority";
import {UserService} from "../../../../../service/user/user.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit {

  user: User = {authority: {}} as User;
  authorities: Authority[] = [];
  id: number = 0;

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.userService.findAllAuthority().subscribe(res => this.authorities = res);
    this.id = this.activatedRoute.snapshot.params['id'];
    this.userService.findById(this.id).subscribe(res => this.user = res);
  }

  update(): void {
    this.userService.update(this.user , this.id).subscribe(() => {
      this.router.navigate(['/setting/user-manager']);
    })
  }

}
