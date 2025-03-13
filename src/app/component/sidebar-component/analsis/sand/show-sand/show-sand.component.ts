import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TestService} from "../../../../../service/test/test.service";
import {Test} from "../../../../../model/test";
import {AuthenticationService} from "../../../../../service/authentication/authentication.service";

@Component({
  selector: 'app-show-sand',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    RouterLink,
    NgIf
  ],
  templateUrl: './show-sand.component.html',
  styleUrl: './show-sand.component.css'
})
export class ShowSandComponent implements OnInit {

  test: Test = {} as Test;
  id: number = 0;
  role: string = '';

  constructor(private authenticationService: AuthenticationService, private activatedRoute: ActivatedRoute, private testService: TestService) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.testService.findById(this.id).subscribe(res => {
      this.test = res;
    })
    this.role = this.authenticationService.getAuthority()
  }


}
