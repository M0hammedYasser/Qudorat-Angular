import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgForOf } from "@angular/common";
import { Project } from "../../../../model/project";
import { Client } from "../../../../model/client";
import { ProjectService } from "../../../../service/project/project.service";
import { ClientService } from "../../../../service/client/client.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-project',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './update-project.component.html',
  styleUrl: './update-project.component.css'
})
export class UpdateProjectComponent implements OnInit {

  @Input() id: any;
  @Output() close = new EventEmitter<void>();

  project: Project = { client: {} as Client } as Project;
  clients: Client[] = [];

  constructor(private service: ProjectService, private clientService: ClientService) {
  }

  ngOnInit() {
    if (this.id) {
      this.service.findById(this.id).subscribe(res => this.project = res);
    }
    this.clientService.findAll().subscribe(res => this.clients = res);
  }

  update() {
    this.service.update(this.project, this.id).subscribe(() => {
      Swal.fire({
        title: "Success",
        text: "Project updated successfully",
        icon: "success"
      });
      this.close.emit();
    })
  }

}
