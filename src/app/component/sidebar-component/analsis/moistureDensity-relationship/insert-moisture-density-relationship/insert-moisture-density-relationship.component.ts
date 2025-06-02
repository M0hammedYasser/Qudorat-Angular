import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AtterbergLimits} from "../../../../../model/atterberg-limits";
import {Test} from "../../../../../model/test";
import {ActivatedRoute, Router} from "@angular/router";
import {AtterbergLimitsService} from "../../../../../service/atterbergLimits/atterberg-limits.service";
import {MoistureDensityRelationship} from "../../../../../model/moisture-density-relationship";
import {
  MoistureDensityRelationshipService
} from "../../../../../service/MoistureDensityRelationship/moisture-density-relationship.service";

@Component({
  selector: 'app-insert-moisture-density-relationship',
  standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './insert-moisture-density-relationship.component.html',
  styleUrl: './insert-moisture-density-relationship.component.css'
})
export class InsertMoistureDensityRelationshipComponent {


  id: number = 0;
  moistureDensityRelationship: MoistureDensityRelationship = {test: {} as Test,} as MoistureDensityRelationship;


  constructor(private router: Router,
              private service: MoistureDensityRelationshipService,
              private activatedRoute: ActivatedRoute) {
  }

  insert() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.moistureDensityRelationship.test.id = this.id;
    console.log(this.moistureDensityRelationship);
    this.service.insert(this.moistureDensityRelationship).subscribe(
      () => this.router.navigateByUrl(`/moisture-density-relationship/${this.id}`));

  }

}
