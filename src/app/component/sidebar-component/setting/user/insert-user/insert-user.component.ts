import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Authority } from "../../../../../model/authority";
import { User } from "../../../../../model/user";
import { UserService } from "../../../../../service/user/user.service";
import { NgForOf } from "@angular/common";
import Swal from 'sweetalert2';

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

  @Output() close = new EventEmitter<void>();

  user: User = { authority: {} } as User;
  authorities: Authority[] = [];

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.findAllAuthority().subscribe(res => this.authorities = res);
  }

  insert(): void {
    this.userService.insert(this.user).subscribe(() => {
      Swal.fire({
        title: "Success",
        text: "User added successfully",
        icon: "success"
      });
      this.close.emit();
    })
  }

}
