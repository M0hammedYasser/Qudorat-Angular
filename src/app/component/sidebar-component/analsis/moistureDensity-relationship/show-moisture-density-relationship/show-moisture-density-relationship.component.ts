import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Test} from "../../../../../model/test";
import {AuthenticationService} from "../../../../../service/authentication/authentication.service";
import {TestService} from "../../../../../service/test/test.service";
import {SieveAnalysisService} from "../../../../../service/sieve-analysis/sieve-analysis.service";
import Swal from "sweetalert2";
import {
  MoistureDensityRelationshipService
} from "../../../../../service/MoistureDensityRelationship/moisture-density-relationship.service";

@Component({
  selector: 'app-show-moisture-density-relationship',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './show-moisture-density-relationship.component.html',
  styleUrl: './show-moisture-density-relationship.component.css'
})
export class ShowMoistureDensityRelationshipComponent implements OnInit {

  test: Test = {} as Test;
  id: number = 0;
  role: string = '';

  constructor(private authenticationService: AuthenticationService, private router: Router,
              private activatedRoute: ActivatedRoute, private testService: TestService,
              private service: MoistureDensityRelationshipService) {
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

  reject(id: number) {
    const name = this.authenticationService.getName();

    Swal.fire({
      title: 'Reject Test',
      text: `Please provide a reason for rejecting test ${id}:`,
      input: 'textarea',
      inputPlaceholder: 'Enter rejection comment...',
      inputAttributes: {
        'aria-label': 'Rejection comment'
      },
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Rejection comment is required!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const comment = result.value;

        this.testService.reject(id, name, comment).subscribe(
          () => {
            Swal.fire('Rejected!', 'The test has been rejected successfully.', 'success');
            this.router.navigate(['/tests']);
          },
          () => {
            Swal.fire('Error!', 'Something went wrong.', 'error');
          }
        );
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
