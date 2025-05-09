import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CompressiveStrength} from "../../../../../model/compressive-strength";
import {Test} from "../../../../../model/test";
import {DecimalPipe, NgForOf} from "@angular/common";
import {AtterbergLimits} from "../../../../../model/atterberg-limits";
import {ActivatedRoute, Router} from "@angular/router";
import {AsphaltService} from "../../../../../service/asphalt/asphalt.service";
import {AtterbergLimitsService} from "../../../../../service/atterbergLimits/atterberg-limits.service";

@Component({
  selector: 'app-insert-atterberg',
  standalone: true,
  imports: [
    FormsModule,
    DecimalPipe,
    NgForOf
  ],
  templateUrl: './insert-atterberg.component.html',
  styleUrl: './insert-atterberg.component.css'
})
export class InsertAtterbergComponent {


  id: number = 0;
  atterbergLimits: AtterbergLimits = {test: {} as Test,} as AtterbergLimits;


  constructor(private router: Router,
              private service: AtterbergLimitsService,
              private activatedRoute: ActivatedRoute) {
  }

  insert() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.atterbergLimits.test.id = this.id;
    console.log(this.atterbergLimits);
    this.service.insert(this.atterbergLimits).subscribe(
      () => this.router.navigateByUrl(`/atterberg/${this.id}`));

  }


}
