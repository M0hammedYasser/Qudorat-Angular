import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Test} from "../../../../../model/test";
import {AuthenticationService} from "../../../../../service/authentication/authentication.service";
import {TestService} from "../../../../../service/test/test.service";
import Swal from "sweetalert2";
import {AtterbergLimitsService} from "../../../../../service/atterbergLimits/atterberg-limits.service";

@Component({
  selector: 'app-show-atterberg',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './show-atterberg.component.html',
  styleUrl: './show-atterberg.component.css'
})
export class ShowAtterbergComponent implements OnInit{

  test: Test = {} as Test;
  id: number = 0;
  role: string = '';

  constructor(private authenticationService: AuthenticationService,private router : Router ,
              private activatedRoute: ActivatedRoute, private testService: TestService ,
              private service:AtterbergLimitsService) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.testService.findById(this.id).subscribe(res => {
      this.test = res;
    })
    this.role = this.authenticationService.getAuthority()
  }

  adopt(id: number) {
    const name = this.authenticationService.getName();
    Swal.fire({
      title: 'Are you sure?',
      text: `This test ${id} will be adopted with user ${name}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.testService.adopt(id, name).subscribe(res => {
          Swal.fire('Adopted!', 'The adoption process was successful.', 'success');
          this.router.navigate(['/tests']);
        }, err => {
          Swal.fire('Error!', 'Something went wrong.', 'error');
        });
      }
    });
  }

    approve(id: number) {
    const name = this.authenticationService.getName();
  
    Swal.fire({
      title: 'Are you sure?',
      text: `This test ${id} will be approved with user ${name}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.testService.approve(id, name).subscribe(
          res => {
            Swal.fire('Approved!', 'The approval process was successful.', 'success');
            this.router.navigate(['/tests']);
          },
          err => {
            Swal.fire('Error!', 'Something went wrong.', 'error');
          }
        );
      }
    });
  }

  delete(id: number) {
    this.service.delete(id).subscribe(res => {
      this.testService.findById(this.id).subscribe(res => {
        this.test = res;
      })
    })
  }
}
