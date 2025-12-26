import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Client } from "../../../../model/client";
import { ClientService } from "../../../../service/client/client.service";
import Swal from 'sweetalert2';

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

  @Input() id: any;
  @Output() close = new EventEmitter<void>();

  client: Client = {} as Client;

  constructor(private service: ClientService) {
  }

  ngOnInit() {
    if (this.id) {
      this.service.findById(this.id).subscribe(res => this.client = res);
    }
  }

  update() {
    this.service.update(this.client, this.id).subscribe(
      () => {
        Swal.fire({
          title: "Success",
          text: "Client updated successfully",
          icon: "success"
        });
        this.close.emit();
      });
  }

}
