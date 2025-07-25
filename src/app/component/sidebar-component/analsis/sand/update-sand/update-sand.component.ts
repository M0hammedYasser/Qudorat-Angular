import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SieveAnalysis} from "../../../../../model/sieve-analysis";
import {Test} from "../../../../../model/test";
import {SieveAnalysisService} from "../../../../../service/sieve-analysis/sieve-analysis.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-update-sand',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './update-sand.component.html',
  styleUrl: './update-sand.component.css'
})
export class UpdateSandComponent implements OnInit {
update() {
throw new Error('Method not implemented.');
}

  standard = ["75", "62.5", "50", "37.0", "25.0", "19.0", "12.5", "9.5", "4.75", "2", "0.425", "0.150", "0.075"];
  alertnative = ["3", "21/2", "2", "11/2", "1", "3/4", "1/2", "3/8", "#4", "#10", "#40", "#100", "#200"];
  sieveAnalysis: SieveAnalysis = {test: {} as Test} as SieveAnalysis;
  id: number = 0;


  constructor(private service: SieveAnalysisService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.service.findById(this.id).subscribe(res => this.sieveAnalysis = res);
  }

  insert() {
    this.service.update(this.sieveAnalysis , this.id).subscribe(
      () => this.router.navigateByUrl(`/tests`));
  }


}
