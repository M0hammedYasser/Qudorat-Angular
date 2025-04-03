import {Component, OnInit} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {SieveAnalysis} from "../../../../../model/sieve-analysis";
import {Test} from "../../../../../model/test";
import {SieveAnalysisService} from "../../../../../service/sieve-analysis/sieve-analysis.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Asphalt} from "../../../../../model/asphalt";
import {AsphaltService} from "../../../../../service/asphalt/asphalt.service";
import {GradationTest} from "../../../../../model/gradation-test";
import {Bitumen} from "../../../../../model/bitumen";

@Component({
  selector: 'app-insert-asphalt',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    JsonPipe
  ],
  templateUrl: './insert-asphalt.component.html',
  styleUrl: './insert-asphalt.component.css'
})
export class InsertAsphaltComponent {

  id: number = 0;
  asphalt: Asphalt = {test: {} as Test, gradationTest: {} as GradationTest , bitumen : {} as Bitumen} as Asphalt;
  currentStep = 1;
  standard = ['37.5', '25', '19.0', '12.5', '9.5', '4.75', '2.00', '0.425', '0.180', '0.075'];
  alternative = ['1.5', '1', '3/4', '1/2', '3/8', '#4', '#10', '#40', '#80', '#200'];

  constructor(private router: Router,
              private service: AsphaltService,
              private activatedRoute: ActivatedRoute) {
  }


  insert() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.asphalt.test.id = this.id;
    console.log(this.asphalt);
    this.service.insert(this.asphalt).subscribe(
      () => this.router.navigateByUrl(`/asphalt/${this.id}`));

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

