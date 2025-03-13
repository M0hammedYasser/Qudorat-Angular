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

  standard = ["9.5 mm", "4.75 mm", "2.36 mm", "1.18 mm", "600 µm", "300 µm", "150 µm", "75 µm"];
  alertnative = ["3/8 in", "NO.4", "NO.8", "NO.16", "NO.30", "NO.50", "NO.100", "NO.200"];
  sieveAnalysis: SieveAnalysis = {test: {} as Test} as SieveAnalysis;
  id: number = 0;


  constructor(private service: SieveAnalysisService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.service.findById(this.id).subscribe(res => this.sieveAnalysis = res);
    console.log(this.sieveAnalysis.test.id);
  }

  insert() {
    this.service.update(this.sieveAnalysis , this.id).subscribe(
      () => this.router.navigateByUrl(`/tests`));
  }


}
