import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {UserService} from "../../../service/user/user.service";
import {AuthenticationService} from "../../../service/authentication/authentication.service";
import {User} from "../../../model/user";
import {environment} from "../../../../environments/environment";
import Swal from 'sweetalert2'
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user: User = {} as User;
  isEditing = false;
  selectedFile: File | null = null;


  constructor(private userService: UserService,
              private authService: AuthenticationService , private http : HttpClient , private router : Router) {
  }

  ngOnInit() {
    this.userService.findById(Number(this.authService.getUserId())).subscribe(result => {
      this.user = result;
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges(id: number, name: string, username: string , jobTitle : string) {
    this.isEditing = false;
    this.userService.updateUsername(id, name, username,jobTitle).subscribe(()=> {
      this.authService.logout();
      this.router.navigate(['login']);
    });
  }


  changePassword(userId: number) {
    Swal.fire({
      title: 'Enter New Password',
      input: 'password',
      inputPlaceholder: 'Type your new password',
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

  triggerFileInput() {
    document.getElementById('photoInput')?.click();
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadPhoto() {
    if (!this.selectedFile) {
      return;
    }
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.http.post(`${environment.url}image/upload?pathType=img&userId=${this.user.id}`, formData).subscribe(
      (response: any) => {
        this.user.image.path = response.imageUrl;// Update UI with new image URL
        window.location.reload();
      },
      (error) => {
        window.location.reload();
      }
    );
  }
  protected readonly environment = environment;


}
