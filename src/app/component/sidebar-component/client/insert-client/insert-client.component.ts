import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {Client} from "../../../../model/client";
import {ClientService} from "../../../../service/client/client.service";


@Component({
  selector: 'app-insert-client',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './insert-client.component.html',
  styleUrl: './insert-client.component.css'
})
export class InsertClientComponent implements OnInit{


  client: Client = {} as Client;
  entry: number = 0;

  constructor(private service: ClientService, private router: Router) {
  }

  ngOnInit() {
    this.service.count().subscribe(res=> this.entry = res + 1);
  }


  insert() {
    this.service.insert(this.client).subscribe(
      () => this.router.navigate(['/clients']));
  }

}
