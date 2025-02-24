import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Client} from "../../../../model/client";
import {ClientService} from "../../../../service/client/client.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-update-client',
  standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './update-client.component.html',
  styleUrl: './update-client.component.css'
})
export class UpdateClientComponent implements OnInit {

  client: Client = {} as Client;
  id : number = 0;

  constructor(private service: ClientService, private router: Router , private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.service.findById(this.id).subscribe(res=> this.client = res);
  }

  update() {
    this.service.update(this.client , this.id).subscribe(
      () => this.router.navigate(['/clients']));
  }

}
