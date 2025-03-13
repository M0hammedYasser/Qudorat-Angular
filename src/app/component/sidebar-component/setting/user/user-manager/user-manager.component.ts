import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {UserService} from "../../../../../service/user/user.service";
import {User} from "../../../../../model/user";

@Component({
  selector: 'app-user-manager',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    RouterLink,
    NgIf
  ],
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.css'
})
export class UserManagerComponent implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.findAll().subscribe(users => {this.users = users;});
  }

  toggleUserStatus(user: any): void {
    user.isActive = user.isActive ? 0 : 1;
    this.userService.active(user.id).subscribe();
    console.log(user.id);
  }

  addUser(): void {
    console.log("Add Users button clicked!");
  }

}
