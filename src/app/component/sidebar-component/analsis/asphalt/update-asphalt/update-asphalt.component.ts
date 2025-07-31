import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Asphalt} from "../../../../../model/asphalt";
import {Test} from "../../../../../model/test";
import {ActivatedRoute, Router} from "@angular/router";
import {AsphaltService} from "../../../../../service/asphalt/asphalt.service";
import {GradationTest} from "../../../../../model/gradation-test";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {Bitumen} from "../../../../../model/bitumen";

@Component({
  selector: 'app-update-asphalt',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    JsonPipe
  ],
  templateUrl: './update-asphalt.component.html',
  styleUrl: './update-asphalt.component.css'
})
export class UpdateAsphaltComponent implements OnInit {

  id: number = 0;
  asphalt: Asphalt = {test: {} as Test, gradationTest: {} as GradationTest , bitumen : {} as Bitumen} as Asphalt;
  currentStep = 1;
  standard = ['37.5', '25', '19.0', '12.5', '9.5', '4.75', '2.00', '0.425', '0.180', '0.075'];
  alternative = ['1.5', '1', '3/4', '1/2', '3/8', '#4', '#10', '#40', '#80', '#200',];

  constructor(private router: Router,
              private service : AsphaltService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.service.findById(this.id).subscribe(res => this.asphalt = res);
  }


  insert() {
    this.service.update(this.asphalt , this.id).subscribe(
      () => this.router.navigateByUrl(`/tests`));
  }

  update() {
    this.service.update(this.asphalt , this.id).subscribe(
      () => this.router.navigateByUrl(`/tests`));
  }

  nextStep() {
    if (this.currentStep < 3) { // Changed from 2 to 3
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }

  }


}
