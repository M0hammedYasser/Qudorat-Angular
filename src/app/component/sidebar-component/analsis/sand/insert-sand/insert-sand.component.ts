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

  standard = ["9.5 mm", "4.75 mm", "2.36 mm", "1.18 mm", "600 µm", "300 µm", "150 µm", "75 µm"];
  alertnative = ["3/8 in", "NO.4", "NO.8", "NO.16", "NO.30", "NO.50", "NO.100", "NO.200"];

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
