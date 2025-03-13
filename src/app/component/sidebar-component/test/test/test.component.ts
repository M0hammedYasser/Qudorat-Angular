import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {SearchComponent} from "../../../shared/search/search.component";
import {SearchPipe} from "../../../../pipe/search.pipe";
import {Test} from "../../../../model/test";
import {TestService} from "../../../../service/test/test.service";
import {AuthenticationService} from "../../../../service/authentication/authentication.service";

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    SearchComponent,
    SearchPipe,
    NgIf
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent implements OnInit {

  tests: Test[] = [];
  searchText: string = '';
  role : string = '';

  constructor(private service: TestService, private router: Router , private authService :AuthenticationService) {
  }

  ngOnInit() {
    this.findAll();
    this.role = this.authService.getAuthority();
  }

  findAll() {
    this.service.findAll().subscribe(res => this.tests = res);
  }

  onSearchTextEntered(searchValue: any) {
    this.searchText = searchValue
  }

  delete(id: number) {
    this.service.delete(id).subscribe();
    this.findAll();
    window.location.reload();
  }

  goToTrail(testId: number, id: number) {
    if (id == 1) this.router.navigate([`/sands/${testId}`]);
  }

  changeActive(id: number) {
    this.service.changeActive(id).subscribe(() => {
      const test = this.tests.find(t => t.id === id);
      if (test) {
        test.active = !test.active;
      }
    });
  }
}
