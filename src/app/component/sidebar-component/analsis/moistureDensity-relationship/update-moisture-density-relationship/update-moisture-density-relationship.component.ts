import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AtterbergLimits} from "../../../../../model/atterberg-limits";
import {Test} from "../../../../../model/test";
import {ActivatedRoute, Router} from "@angular/router";
import {AtterbergLimitsService} from "../../../../../service/atterbergLimits/atterberg-limits.service";
import {MoistureDensityRelationship} from "../../../../../model/moisture-density-relationship";
import {
  MoistureDensityRelationshipService
} from "../../../../../service/MoistureDensityRelationship/moisture-density-relationship.service";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-update-moisture-density-relationship',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './update-moisture-density-relationship.component.html',
  styleUrl: './update-moisture-density-relationship.component.css'
})
export class UpdateMoistureDensityRelationshipComponent implements OnInit {

  id: number = 0;
  moistureDensityRelationship: MoistureDensityRelationship = {test: {} as Test,} as MoistureDensityRelationship;


  constructor(private router: Router,
              private service: MoistureDensityRelationshipService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.service.findById(this.id).subscribe(res => this.moistureDensityRelationship = res);
  }

  insert() {
    this.service.update(this.moistureDensityRelationship , this.id).subscribe(
      () => this.router.navigateByUrl(`/tests`));
  }

}
