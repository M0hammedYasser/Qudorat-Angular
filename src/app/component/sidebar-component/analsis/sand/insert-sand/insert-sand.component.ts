import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgForOf} from "@angular/common";
import {SieveAnalysis} from "../../../../../model/sieve-analysis";
import {SieveAnalysisService} from "../../../../../service/sieve-analysis/sieve-analysis.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Test} from "../../../../../model/test";

@Component({
  selector: 'app-insert-sand',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    FormsModule,
    JsonPipe
  ],
  templateUrl: './insert-sand.component.html',
  styleUrl: './insert-sand.component.css'
})
export class InsertSandComponent implements OnInit {

  standard = ["75", "62.5", "50", "37.0", "25.0", "19.0", "12.5", "9.5", "4.75", "2", "0.425", "0.150", "0.075"];
  alertnative = ["3", "21/2", "2", "11/2", "1", "3/4", "1/2", "3/8", "#4", "#10", "#40", "#100", "#200"];

  sieveAnalysis: SieveAnalysis = {test: {} as Test} as SieveAnalysis;
  id: number = 0;


  constructor(private service: SieveAnalysisService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {

  }

  insert() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.sieveAnalysis.test.id = this.id;
    this.service.insert(this.sieveAnalysis).subscribe(() => this.router.navigateByUrl(`/sands/${this.id}`));
  }


}
