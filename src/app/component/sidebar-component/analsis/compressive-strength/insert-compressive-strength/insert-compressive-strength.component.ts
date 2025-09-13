import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {JsonPipe, NgIf} from "@angular/common";
import {CompressiveStrength} from "../../../../../model/compressive-strength";
import {CompressiveStrengthService} from "../../../../../service/CompressiveStrength/compressive-strength.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Test} from "../../../../../model/test";

@Component({
  selector: 'app-insert-compressive-strength',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './insert-compressive-strength.component.html',
  styleUrl: './insert-compressive-strength.component.css'
})
export class InsertCompressiveStrengthComponent {

  compressiveStrength: CompressiveStrength = {test: {} as Test,} as CompressiveStrength;
  id: number = 0;

  constructor(private service: CompressiveStrengthService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  insert() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.compressiveStrength.test.id = this.id;
    this.service.insert(this.compressiveStrength).subscribe({
        next: () => {
          this.router.navigateByUrl(`/compressive-strength/${this.id}`);
        },
        error: (err) => {
          this.router.navigateByUrl(`/compressive-strength/${this.id}`);
        }
      }
    )
  }

}
