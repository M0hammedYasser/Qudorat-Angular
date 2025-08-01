import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AtterbergLimits} from "../../../../../model/atterberg-limits";
import {Test} from "../../../../../model/test";
import {ActivatedRoute, Router} from "@angular/router";
import {AtterbergLimitsService} from "../../../../../service/atterbergLimits/atterberg-limits.service";

@Component({
  selector: 'app-update-atterberg',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './update-atterberg.component.html',
  styleUrl: './update-atterberg.component.css'
})
export class UpdateAtterbergComponent implements OnInit{

  id: number = 0;
  atterbergLimits: AtterbergLimits = {test: {} as Test,} as AtterbergLimits;


  constructor(private router: Router,
              private service: AtterbergLimitsService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.service.findById(this.id).subscribe(res => this.atterbergLimits = res);
  }

  insert() {
    this.service.update(this.atterbergLimits , this.id).subscribe(
      () => this.router.navigateByUrl(`/tests`));
  }

  update() {
    this.service.update(this.atterbergLimits , this.id).subscribe(
      () => this.router.navigateByUrl(`/tests`));
  }


}
