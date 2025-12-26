import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { Client } from "../../../../model/client";
import { ClientService } from "../../../../service/client/client.service";


@Component({
  selector: 'app-insert-client',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './insert-client.component.html',
  styleUrl: './insert-client.component.css'
})
export class InsertClientComponent implements OnInit {

  @Output() close = new EventEmitter<void>();

  client: Client = {} as Client;
  entry: number = 0;

  constructor(private service: ClientService) {
  }

  ngOnInit() {
    this.service.count().subscribe(res => this.entry = res + 1);
  }


  insert() {
    this.service.insert(this.client).subscribe(
      () => {
        this.close.emit();
      });
  }

}
