import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Test} from "../../../../model/test";
import {Project} from "../../../../model/project";
import {TestService} from "../../../../service/test/test.service";
import {ProjectService} from "../../../../service/project/project.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TestManager} from "../../../../model/test-manager";
import {TestManagerService} from "../../../../service/test-manager/test-manager.service";

@Component({
  selector: 'app-update-test',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './update-test.component.html',
  styleUrl: './update-test.component.css'
})
export class UpdateTestComponent implements OnInit {

  test: Test = {project: {} as Project, testManager: {} as TestManager} as Test;
  projects: Project[] = [];
  price: number = 0;
  showExtraFields: boolean = false;
  id: number = 0;
  testManagers: TestManager[] = [];

  constructor(private service: TestService, private projectService: ProjectService, private testManagerService: TestManagerService,
              private router: Router , private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.service.findById(this.id).subscribe(res => {
      this.test = res;
      // When loading an existing test, ensure the conditional fields reflect the current test manager
      if (this.test && this.test.testManager && this.test.testManager.id != null) {
        // Use the same logic as the change handler to set price and extra fields visibility
        this.onSideChange(Number(this.test.testManager.id));
      }
    });
    this.projectService.findAll().subscribe(res => this.projects = res);
    this.testManagerService.findAll().subscribe(res => this.testManagers = res);
  }

  onSideChange(id: number) {
    this.testManagerService.findById(id).subscribe(res => {
      this.price = res.price;
      this.test.price = res.price;
      this.showExtraFields = id == 2;
      if (!this.showExtraFields) {
        this.test.contractor = '';
        this.test.jobOrder = '';
        this.test.asphaltApplier = '';
      }
    });
  }

  insert() {
    this.service.update(this.test , this.id).subscribe(() =>
      this.router.navigateByUrl('/tests')
    )
  }

}
