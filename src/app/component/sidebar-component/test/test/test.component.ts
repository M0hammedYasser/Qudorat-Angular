import { Component, OnInit } from '@angular/core';
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { SearchComponent } from "../../../shared/search/search.component";
import { SearchPipe } from "../../../../pipe/search.pipe";
import { Test } from "../../../../model/test";
import { TestService } from "../../../../service/test/test.service";
import { AuthenticationService } from "../../../../service/authentication/authentication.service";
import Swal from 'sweetalert2';
import { InsertTestComponent } from "../insert-test/insert-test.component";
import { UpdateTestComponent } from "../update-test/update-test.component";

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    SearchComponent,
    SearchPipe,
    NgIf,
    InsertTestComponent,
    UpdateTestComponent,
    NgClass
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent implements OnInit {

  tests: Test[] = [];
  searchText: string = '';
  role: string = '';
  id: string | null = '';
  showModal: boolean = false;
  showUpdateModal: boolean = false;
  selectedTestId: any;

  constructor(private service: TestService, private router: Router, private authService: AuthenticationService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.queryParamMap.get('id');
    if (this.id)
      this.findById(this.id)
    else
      this.findAll();
    this.role = this.authService.getAuthority();
  }

  findAll() {
    this.service.findAll().subscribe(res => this.tests = res);
  }

  findById(id: string) {
    this.service.findOne(id).subscribe({
      next: (response) => {
        if (response) {
          this.tests = [response];
        } else {
          this.findAll();
        }
      },
      error: (err) => {
        this.findAll();
      }
    });
  }

  onSearchTextEntered(searchValue: any) {
    this.searchText = searchValue
  }

  delete(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete(id).subscribe(() => {
          Swal.fire(
            'Deleted!',
            'Test has been deleted.',
            'success'
          );
          this.findAll();
        });
      }
    });
  }

  goToTrail(testId: number, id: number) {
    if (id == 1) this.router.navigate([`/sands/${testId}`]);
    if (id == 2) this.router.navigate([`/asphalt/${testId}`]);
    if (id == 3) this.router.navigate([`/compressive-strength/${testId}`]);
    if (id == 4) this.router.navigate([`/atterberg/${testId}`]);
    if (id == 5) this.router.navigate([`/moisture-density-relationship/${testId}`]);
  }

  changeActive(id: number) {
    this.service.changeActive(id, this.authService.getName()).subscribe(() => {
      const test = this.tests.find(t => t.id === id);
      if (test) {
        test.active = !test.active;
      }
    });
  }

  openNewTestModal() {
    this.showModal = true;
  }

  closeNewTestModal() {
    this.showModal = false;
    this.findAll();
  }

  openUpdateTestModal(id: any) {
    this.selectedTestId = id;
    this.showUpdateModal = true;
  }

  closeUpdateTestModal() {
    this.showUpdateModal = false;
    this.selectedTestId = null;
    this.findAll();
  }

  protected readonly TestService = TestService;
}
