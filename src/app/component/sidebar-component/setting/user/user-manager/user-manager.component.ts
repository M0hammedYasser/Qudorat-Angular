import { Component, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";
import { UserService } from "../../../../../service/user/user.service";
import { User } from "../../../../../model/user";
import Swal from "sweetalert2";
import { InsertUserComponent } from "../insert-user/insert-user.component";

@Component({
  selector: 'app-user-manager',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    RouterLink,
    NgIf,
    InsertUserComponent
  ],
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.css'
})
export class UserManagerComponent implements OnInit {

  users: User[] = [];
  showModal: boolean = false;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.userService.findAll().subscribe(users => { this.users = users; });
  }

  toggleUserStatus(user: any): void {
    user.isActive = user.isActive ? 0 : 1;
    this.userService.active(user.id).subscribe();
    console.log(user.id);
  }

  changePassword(userId: number): void {
    Swal.fire({
      title: 'Enter New Password',
      input: 'password',
      inputPlaceholder: 'Type new password',
      inputAttributes: {
        autocapitalize: 'off',
        required: 'true'
      },
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm: (newPassword) => {
        if (!newPassword) {
          Swal.showValidationMessage('Password is required');
          return false;
        } else if (newPassword.length < 6) {
          Swal.showValidationMessage('Password must be at least 6 characters');
          return false;
        }
        return newPassword;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.updatePassword(userId, result.value).subscribe({
          next: () => {
            Swal.fire('Updated!', 'Your password has been changed.', 'success');
          },
          error: () => {
            Swal.fire('Error', 'Failed to update password. Try again!', 'error');
          }
        });
      }
    });
  }

  openNewUserModal() {
    this.showModal = true;
  }

  closeNewUserModal() {
    this.showModal = false;
    this.findAll();
  }

}
