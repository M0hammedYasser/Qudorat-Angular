import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CompressiveStrength} from "../../../../../model/compressive-strength";
import {Test} from "../../../../../model/test";
import {CompressiveStrengthService} from "../../../../../service/CompressiveStrength/compressive-strength.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-update-compressive-strength',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './update-compressive-strength.component.html',
  styleUrl: './update-compressive-strength.component.css'
})
export class UpdateCompressiveStrengthComponent implements OnInit{
update() {
throw new Error('Method not implemented.');
}

  compressiveStrength: CompressiveStrength = {test: {} as Test,} as CompressiveStrength;
  id: number = 0;

  constructor(private service: CompressiveStrengthService, private router: Router, private activatedRoute: ActivatedRoute) {
  }
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.service.findById(this.id).subscribe(res => {this.compressiveStrength = res;});
  }

  insert() {
    this.service.update(this.compressiveStrength , this.id).subscribe(
      () => this.router.navigateByUrl(`/tests`)
    );
  }

}
