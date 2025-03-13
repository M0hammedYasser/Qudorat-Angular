import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgForOf} from "@angular/common";
import {Project} from "../../../../model/project";
import {Client} from "../../../../model/client";
import {ProjectService} from "../../../../service/project/project.service";
import {ClientService} from "../../../../service/client/client.service";
import {Router} from "@angular/router";
import {Test} from "../../../../model/test";
import {TestService} from "../../../../service/test/test.service";
import {TestManager} from "../../../../model/test-manager";
import {TestManagerService} from "../../../../service/test-manager/test-manager.service";

@Component({
  selector: 'app-insert-test',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './insert-test.component.html',
  styleUrl: './insert-test.component.css'
})
export class InsertTestComponent implements OnInit {

  test: Test = {project: {} as Project, testManager: {} as TestManager} as Test;
  price: number = 0;
  projects: Project[] = [];
  testManagers: TestManager[] = [];

  constructor(private service: TestService, private projectService: ProjectService, private testManagerService: TestManagerService,
              private router: Router) {
  }

  ngOnInit() {
    this.projectService.findAll().subscribe(res => this.projects = res);
    this.testManagerService.findAll().subscribe(res => this.testManagers = res);
  }

  onSideChange(id: number) {
    this.testManagerService.findById(id).subscribe(res => {
      this.price = res.price;
      this.test.price = res.price;
    });
  }

  insert() {
    this.service.insert(this.test).subscribe({
      next: () => {
        this.router.navigateByUrl('/tests');
      },
      error: (err) => {
        this.router.navigateByUrl('/tests');
      }
    });
  }


}
